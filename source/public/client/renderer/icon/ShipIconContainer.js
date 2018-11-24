"use strict";

window.ShipIconContainer = (function() {
  function ShipIconContainer(coordinateConverter, scene, movementService) {
    this.iconsAsObject = {};
    this.iconsAsArray = [];
    this.coordinateConverter = coordinateConverter;
    this.scene = scene;
    this.movementService = movementService;
  }

  ShipIconContainer.prototype.consumeGamedata = function(gamedata) {
    setShips.call(this, gamedata.ships);
  };

  function setShips(ships) {
    ships.forEach(function(ship) {
      if (!this.hasIcon(ship.id)) {
        this.iconsAsObject[ship.id] = createIcon(ship, this.scene);
      } else {
        this.iconsAsObject[ship.id].consumeShipdata(ship);
      }
    }, this);

    buildShipArray.call(this);
  }

  ShipIconContainer.prototype.getByShip = function(ship) {
    return this.iconsAsObject[ship.id];
  };

  ShipIconContainer.prototype.getById = function(id) {
    return this.iconsAsObject[id];
  };

  ShipIconContainer.prototype.onEvent = function(name, payload) {
    var target = this["on" + name];
    if (target && typeof target === "function") {
      target.call(this, payload);
    }
  };

  ShipIconContainer.prototype.onZoomEvent = function(payload) {
    var zoom = payload.zoom;

    var alpha = zoom > 2 ? zoom - 2 : 0;
    if (alpha > 1) {
      alpha = 1;
    }
    this.iconsAsArray.forEach(function(icon) {
      icon.setOverlayColorAlpha(alpha);
    });
  };

  ShipIconContainer.prototype.getArray = function() {
    return this.iconsAsArray;
  };

  ShipIconContainer.prototype.hasIcon = function(shipId) {
    return Boolean(this.iconsAsObject[shipId]);
  };

  ShipIconContainer.prototype.getIconById = function(shipId) {
    return this.iconsAsObject[shipId];
  };

  ShipIconContainer.prototype.getIconsInProximity = function(payload) {
    var hexHeight = this.coordinateConverter.getHexHeightViewport();
    var distance = hexHeight / 10;

    var icons = [];

    if (distance < 30) {
      icons = this.getIconsInSameHex(payload.hex);
    } else {
      var closest = null;
      var closestDistance = null;

      this.iconsAsArray.forEach(function(shipIcon) {
        var currentDistance = mathlib.distance(
          shipIcon.getPosition(),
          payload.game
        );

        if (
          currentDistance < 10 &&
          (!closest || currentDistance < closestDistance)
        ) {
          closest = shipIcon;
          closestDistance = currentDistance;
        }
      }, this);

      if (closest) icons.push(closest);
    }

    return icons;
  };

  ShipIconContainer.prototype.getIconsInSameHex = function(hex) {
    return this.iconsAsArray.filter(function(shipIcon) {
      return this.coordinateConverter
        .fromGameToHex(shipIcon.getPosition())
        .equals(hex);
    }, this);
  };

  ShipIconContainer.prototype.getFinalMovementInSameHex = function(hex) {
    return this.iconsAsArray.filter(function(shipIcon) {
      return (
        !shipManager.isDestroyed(shipIcon.ship) &&
        shipIcon.getLastMovement().position.equals(hex)
      );
    }, this);
  };

  ShipIconContainer.prototype.positionAndFaceAllIcons = function() {
    this.getArray().forEach(function(icon) {
      icon.positionAndFaceIcon(this.getHexOffset(icon), this.movementService);
    }, this);
  };

  ShipIconContainer.prototype.positionAndFaceShip = function(ship) {
    var icon = this.getByShip(ship);
    icon.positionAndFaceIcon(this.getHexOffset(icon), this.movementService);
  };

  function buildShipArray() {
    this.iconsAsArray = Object.keys(this.iconsAsObject).map(function(key) {
      return this.iconsAsObject[key];
    }, this);
  }

  function createIcon(ship, scene) {
    if (ship.flight) {
      return new window.FlightIcon(ship, scene);
    } else {
      return new window.shipObjects[ship.shipModel](ship, scene);
    }
  }

  ShipIconContainer.prototype.getHexOffset = function(icon) {
    /*
        var lastMove = this.movementService.getLastMovement(icon.ship);
        var hex = lastMove.position;

        var iconsInHex = this.getFinalMovementInSameHex(hex).filter(function (otherIcon) {
            return shipManager.hasBetterInitive(icon.ship, otherIcon.ship);
        });

        if (!icon.getMovementBefore(lastMove)) {
            return null;
        }

        var previousHex = icon.getMovementBefore(lastMove).position;

        var iconsFromSameHex = iconsInHex; /* iconsInHex.filter(function (otherIcon) {
                                           var movement = otherIcon.getMovementBefore(otherIcon.getLastMovement());
                                           if (!movement) {
                                           return false;
                                           }
                                           return movement.position.equals(previousHex);
                                           });*/

    var steps = 0;

    /*
        if (iconsInHex.length > 0) {
            steps = 1;
        }
        */

    /*
        steps += iconsFromSameHex.length;

        if (steps === 0) {
            return null;
        }

        var angle = mathlib.getCompassHeadingOfPoint(hex, previousHex);
        return mathlib.getPointInDirection(steps * 7, angle, 0, 0);
        */
    return { x: 0, y: 0 };
  };

  ShipIconContainer.prototype.hideAllMovementPaths = function(ship) {
    this.iconsAsArray.forEach(function(icon) {
      icon.hideMovementPath();
    });
  };

  ShipIconContainer.prototype.hideMovementPath = function(ship) {
    this.getByShip(ship).hideMovementPath();
  };

  ShipIconContainer.prototype.showMovementPath = function(ship) {
    this.getByShip(ship).showMovementPath(ship, this.movementService);
  };

  return ShipIconContainer;
})();
