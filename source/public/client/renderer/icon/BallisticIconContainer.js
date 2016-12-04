window.BallisticIconContainer = (function(){

    function BallisticIconContainer(coordinateConverter, scene){
        this.ballisticIcons = [];
        this.coordinateConverter = coordinateConverter;
        this.scene = scene;
        this.zoomScale = 1;
    }

    BallisticIconContainer.prototype.consumeGamedata = function(gamedata, iconContainer) {
        this.ballisticIcons.forEach(function(ballisticIcon) {
            ballisticIcon.used = false;
        });

        var allBallistics = weaponManager.getAllFireOrdersForAllShipsForTurn(gamedata.turn, 'ballistic');

        allBallistics.forEach(function(ballistic) {
            createOrUpdateBallistic.call(this, ballistic, iconContainer, gamedata.turn);
        }, this);


        this.ballisticIcons = this.ballisticIcons.filter(function (icon) {
            if (!icon.used) {
                this.scene.remove(icon.sprite);
                return false;
            }

            return true;
        }, this)
    };

    BallisticIconContainer.prototype.hide = function() {
        this.ballisticIcons.forEach(function(icon) {
            icon.sprite.hide();
        })
    };

    BallisticIconContainer.prototype.showForShip = function(ship) {
        this.ewIcons.filter(function(icon) {
            return icon.shipId == ship.id || icon.targetId == ship.id;
        }).forEach(function(icon) {
            icon.launchSprite.show();
            if (icon.targetSprite){
                icon.targetSprite.show();
            }
        });
    };

    BallisticIconContainer.prototype.onEvent = function(name, payload) {
        var target = this['on'+ name];
        if (target && typeof target == 'function') {
            target.call(this, payload);
        }
    };

    BallisticIconContainer.prototype.onZoomEvent = function (payload) {
        /* TODO: lines between launch and target
        var zoom = payload.zoom;
        if (zoom <= 0.5) {
            this.zoomScale = 2 * zoom;
            this.ewIcons.forEach(function(icon){
                icon.sprite.setLineWidth(getOEWLineWidth.call(this, icon.amount));
            }, this);
        }else{
            this.zoomScale = 1;
        }
        */
    };

    function createOrUpdateBallistic(ballistic, iconContainer, turn) {
        console.log(ballistic);
        var icon = getBallisticIcon.call(this, ballistic.id);
        if (icon){

        }else {
            createBallisticIcon.call(this, ballistic, iconContainer, turn, this.scene);
        }
    }

    function createBallisticIcon(ballistic, iconContainer, turn, scene) {

        var shooterIcon = iconContainer.getById(ballistic.shooterid);
        var launchPosition = this.coordinateConverter.fromHexToGame(shooterIcon.getFirstMovementOnTurn(turn, 'start').position);
        var targetPosition = this.coordinateConverter.fromHexToGame(new hexagon.FVHex(ballistic.x, ballistic.y));
        console.log(targetPosition);

        var launchSprite = new BallisticSprite(launchPosition, 'launch');
        var targetSprite = ballistic.targetid === -1 ? new BallisticSprite(targetPosition, 'hex') : null;

        scene.add(launchSprite.mesh);
        if (targetSprite) {
            scene.add(targetSprite.mesh);
        }

        return {
            id: ballistic.id,
            shooterId: ballistic.shooterid,
            targetId: ballistic.targetid,
            position: new hexagon.FVHex(ballistic.x, ballistic.y),
            launchSprite: launchSprite,
            targetSprite: targetSprite,
            used: true
        };
    }

    function getBallisticIcon(id) {
        this.ballisticIcons.filter(function (icon) {
           return icon.id == id;
        }).pop();
    }

    return BallisticIconContainer;
})();