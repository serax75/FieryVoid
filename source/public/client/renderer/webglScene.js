"use strict";

window.webglScene = (function() {
  var ZOOM_MAX = 7;
  var ZOOM_MIN = 0.1;

  function webglScene() {
    this.scene = null;
    this.camera = null;
    this.hexGridRenderer = null;
    this.phaseDirector = null;
    this.coordinateConverter = null;
    this.starField = null;
    this.width = null;
    this.height = null;

    this.element = null;

    this.initialized = false;

    this.zoom = 1;
    this.zoomTarget = this.zoom;

    this.draggingStartPosition = null;
    this.lastDraggingPosition = null;
    this.dragging = false;
    this.draggingDistanceTreshold = 20;
    this.distanceDragged = 0;

    this.lastPinchDistance = null;
    this.lastTouchMove = null;
    this.cameraAngle = -500;
    this.starFieldScene = null;
    this.starFieldCamera = null;
  }

  webglScene.prototype.init = function(
    canvasId,
    element,
    hexGridRenderer,
    animationTimeline,
    gamedata,
    coordinateConverter
  ) {
    this.element = element;
    this.hexGridRenderer = hexGridRenderer;
    this.phaseDirector = animationTimeline;
    this.coordinateConverter = coordinateConverter;

    this.scene = new THREE.Scene();

    this.width = jQuery("#pagecontainer").width();
    this.height = jQuery("#pagecontainer").height();

    this.camera = new THREE.OrthographicCamera(
      (this.zoom * this.width) / -2,
      (this.zoom * this.width) / 2,
      (this.zoom * this.height) / 2,
      (this.zoom * this.height) / -2,
      -4000,
      30000
    );

    this.camera.position.set(0, this.cameraAngle, 500);
    this.camera.lookAt(0, 0, 0);
    this.setCameraAngle(-250);

    this.coordinateConverter.init(
      this.width,
      this.height,
      this.camera,
      this.scene
    );
    this.phaseDirector.init(this.coordinateConverter, this.scene);

    this.starFieldScene = new THREE.Scene();
    this.starFieldCamera = new THREE.OrthographicCamera(
      (this.zoom * this.width) / -2,
      (this.zoom * this.width) / 2,
      (this.zoom * this.height) / 2,
      (this.zoom * this.height) / -2,
      -4000,
      30000
    );

    this.starFieldCamera.position.set(0, 0, 500);
    this.starFieldCamera.lookAt(0, 0, 0);

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    var directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight3.position.set(500, -500, 500);
    this.scene.add(directionalLight3);
    var directionalLight4 = new THREE.DirectionalLight(0x609dc1, 0.5);
    directionalLight4.position.set(0, 100, -500);
    this.scene.add(directionalLight4);

    this.scene.add(new THREE.AmbientLight(0x000007));
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.autoClear = false;
    this.renderer.context.getExtension("OES_standard_derivatives");

    jQuery(this.renderer.domElement)
      .addClass("webglCanvas")
      .appendTo(canvasId);

    this.initEventListeners();

    this.initialized = true;
    this.hexGridRenderer.renderHexGrid(this.scene, ZOOM_MIN, ZOOM_MAX);
    this.phaseDirector.receiveGamedata(gamedata, this);
    this.starField = new StarField(this.starFieldScene);
    this.render();
  };

  webglScene.prototype.setCameraAngleRelative = function(newAngle) {
    this.setCameraAngle(this.cameraAngle + newAngle);
  };

  webglScene.prototype.setCameraAngle = function(newAngle) {
    if (newAngle > 0) {
      newAngle = 0;
    }

    if (newAngle < -500) {
      newAngle = -500;
    }

    var currentLookat = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y - this.cameraAngle,
      this.camera.position.z - 500
    );
    var delta = this.cameraAngle - newAngle;
    this.camera.position.set(
      this.camera.position.x,
      this.camera.position.y - delta,
      this.camera.position.z
    );
    this.camera.lookAt(currentLookat);
    this.cameraAngle = newAngle;
  };

  webglScene.prototype.receiveGamedata = function(gamedata) {
    if (!this.phaseDirector) {
      return;
    }

    this.phaseDirector.receiveGamedata(gamedata, this);
  };

  webglScene.prototype.customEvent = function(name, payload) {
    if (!this.initialized) {
      return;
    }

    this.phaseDirector.relayEvent(name, payload);
  };

  webglScene.prototype.moveCamera = function(position) {
    if (!this.initialized) {
      return;
    }

    this.camera.position.x -= position.x * this.zoom * this.zoom;
    this.camera.position.y += position.y * this.zoom * this.zoom;
    this.starFieldCamera.position.x -=
      position.x * this.zoom * this.zoom * 0.05;
    this.starFieldCamera.position.y +=
      position.y * this.zoom * this.zoom * 0.05;

    this.phaseDirector.relayEvent("ScrollEvent", this.camera.position);
  };

  webglScene.prototype.moveCameraTo = function(position) {
    if (!this.initialized) {
      return;
    }

    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.starFieldCamera.position.x = position.x * 0.1;
    this.starFieldCamera.position.y = position.y * 0.1;

    this.phaseDirector.relayEvent("ScrollEvent", this.camera.position);
  };

  webglScene.prototype.zoomCamera = function(zoom, animationReady) {
    this.zoom = zoom;

    if (!this.initialized) {
      return;
    }

    this.camera.left = (this.zoom * this.width) / -2;
    this.camera.right = (this.zoom * this.width) / 2;
    this.camera.top = (this.zoom * this.height) / 2;
    this.camera.bottom = (this.zoom * this.height) / -2;

    this.camera.updateProjectionMatrix();

    this.coordinateConverter.onZoom(this.zoom);
    this.hexGridRenderer.onZoom(this.zoom);

    this.phaseDirector.relayEvent("ZoomEvent", {
      zoom: this.zoom,
      animationReady: Boolean(animationReady)
    });

    var alpha = zoom > 6 ? zoom - 6 : 0;
    if (alpha > 1) {
      alpha = 1;
    }

    jQuery("#background").css({ opacity: 1 - alpha });
  };

  var time = 0;

  webglScene.prototype.render = function() {
    this.stats.begin();
    this.phaseDirector.render(this.scene, this.coordinateConverter, this.zoom);

    this.renderer.clear();
    this.renderer.render(this.starFieldScene, this.starFieldCamera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);

    animateZoom.call(this);
    this.starField.render();

    //time++

    //this.setCameraAngleRelative(time * 0.001);
    /*

        if (this.ship) {

            this.ship.setRotation(time/3,time/3, 0);
        }

        if (this.testObject2) {

            this.testObject2.rotation.set(mathlib.degreeToRadian(90 + time/3), mathlib.degreeToRadian(90 + time/3), 0);
        }

        */

    //this.testParticleEmitter.render(time, time, 0, 0, 1);
    //this.cube.position.set(0, 0, time)
    this.stats.end();
    requestAnimationFrame(this.render.bind(this));
  };

  webglScene.prototype.initEventListeners = function() {
    bindMouseWheelEvent.call(this, this.element);
    animateZoom.call(this);

    jQuery(window).resize(this.onWindowResize.bind(this));
    this.element.on("mousedown", this.mouseDown.bind(this));
    this.element.on("mouseup", this.mouseUp.bind(this));
    this.element.on("mouseout", this.mouseOut.bind(this));
    this.element.on("mouseover", this.mouseOver.bind(this));
    this.element.on("mousemove", this.mouseMove.bind(this));
    this.element.on("touchmove", this.touchmove.bind(this));
    this.element.on("touchstart", this.touchstart.bind(this));
    this.element.on("touchend", this.touchend.bind(this));

    jQuery(window).on("keydown", this.keyDown.bind(this));
    jQuery(window).on("keyup", this.keyUp.bind(this));

    return this;
  };

  webglScene.prototype.touchstart = function(event) {
    this.lastTouchMove = event;
    if (event.originalEvent.touches.length === 1) {
      this.mouseDown(event);
    } else if (event.originalEvent.touches.length === 2) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  webglScene.prototype.touchmove = function(event) {
    event.stopPropagation();
    event.preventDefault();

    this.lastTouchMove = event;

    if (event.originalEvent.touches.length === 1 && !this.lastPinchDistance) {
      this.drag(event);
    } else if (event.originalEvent.touches.length === 2) {
      var dist = Math.hypot(
        event.originalEvent.touches[0].pageX -
          event.originalEvent.touches[1].pageX,
        event.originalEvent.touches[0].pageY -
          event.originalEvent.touches[1].pageY
      );
      if (!this.lastPinchDistance) {
        this.lastPinchDistance = dist;
        return;
      }
      var delta = dist - this.lastPinchDistance;
      var zoom = this.zoom * (1 - delta * 0.02);

      if (zoom < ZOOM_MIN) zoom = ZOOM_MIN;
      if (zoom > ZOOM_MAX) zoom = ZOOM_MAX;

      this.zoomTarget = zoom;
      this.zoomCamera(zoom);
      this.lastPinchDistance = dist;
    }
  };

  webglScene.prototype.touchend = function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (event.originalEvent.touches.length === 0) {
      if (!this.lastPinchDistance) {
        this.mouseUp(this.lastTouchMove);
      }
      this.lastTouchMove = null;
      this.lastPinchDistance = null;
    } else if (event.originalEvent.touches.length === 1) {
      this.phaseDirector.relayEvent("ZoomEvent", {
        zoom: this.zoom,
        animationReady: true
      });
    }
  };

  webglScene.prototype.onWindowResize = function() {
    this.width = jQuery("#pagecontainer").width();
    this.height = jQuery("#pagecontainer").height();

    this.zoomCamera(this.zoom);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.coordinateConverter.onResize(window.innerWidth, window.innerHeight);
    this.starField.cleanUp();
  };

  webglScene.prototype.keyDown = function(event) {
    var action = window.Settings.matchEvent(event);
    this.customEvent(action, { up: false });
  };

  webglScene.prototype.keyUp = function(event) {
    var action = window.Settings.matchEvent(event);
    this.customEvent(action, { up: true });
  };

  webglScene.prototype.mouseDown = function(event) {
    event.stopPropagation();
    event.preventDefault();
    var pos = getMousePositionInObservedElement.call(this, event);
    var gamePos = this.coordinateConverter.fromViewPortToGame(pos);

    this.draggingStartPosition = getPositionObject(pos, gamePos);
    this.lastDraggingPosition = getPositionObject(pos, gamePos);

    var self = this;
    var payload = {
      start: this.draggingStartPosition,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      capture: function capture(callback) {
        self.dragging = callback;
        payload.stopped = true;
      }
    };

    scroll.call(this, payload);
  };

  webglScene.prototype.mouseUp = function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.distanceDragged < this.draggingDistanceTreshold) this.click(event);

    if (this.dragging) this.dragging({ release: true });

    this.distanceDragged = 0;
    this.dragging = false;
  };

  webglScene.prototype.mouseOut = function(e) {
    if (this.dragging) this.fireEvent("DragEvent", { release: true });

    this.fireEvent("MouseOutEvent", {});

    this.distanceDragged = 0;
    this.dragging = false;
  };

  webglScene.prototype.mouseOver = function(e) {};

  webglScene.prototype.mouseMove = function(event) {
    if (this.dragging) this.drag(event);
    else this.doMouseMove(event);
  };

  webglScene.prototype.doMouseMove = function(event) {
    var pos = getMousePositionInObservedElement.call(this, event);
    var gamePos = this.coordinateConverter.fromViewPortToGame(pos);
    var hexPos = this.coordinateConverter.fromGameToHex(gamePos);
    var entities = this.coordinateConverter.getEntitiesIntersected(pos);

    this.phaseDirector.relayEvent(
      "MouseMoveEvent",
      getPositionObject(pos, gamePos, hexPos, entities)
    );
  };

  webglScene.prototype.drag = function(event) {
    var pos = getMousePositionInObservedElement.call(this, event);
    var gamePos = this.coordinateConverter.fromViewPortToGame(pos);
    var current = getPositionObject(pos, gamePos);

    if (!this.lastDraggingPosition) {
      this.lastDraggingPosition = current;
    }

    var deltaView = {
      x: pos.x - this.lastDraggingPosition.view.x,
      y: pos.y - this.lastDraggingPosition.view.y
    };

    var deltaGame = {
      x: (pos.x - this.lastDraggingPosition.view.x) * (1 / this.zoom),
      y: (pos.y - this.lastDraggingPosition.view.y) * (1 / this.zoom)
    };

    var payload = {
      start: this.draggingStartPosition,
      previous: this.lastDraggingPosition,
      current: current,
      delta: getPositionObject(deltaView, deltaGame)
    };

    this.distanceDragged += mathlib.distance({ x: 0, y: 0 }, deltaView);
    this.lastDraggingPosition = current;
    this.dragging && this.dragging(payload);
  };

  webglScene.prototype.click = function(event) {
    var pos = getMousePositionInObservedElement.call(this, event);
    var gamePos = this.coordinateConverter.fromViewPortToGame(pos);
    var entities = this.coordinateConverter.getEntitiesIntersected(pos);
    var hexPos = this.coordinateConverter.fromGameToHex(gamePos, true);
    var payload = getPositionObject.call(this, pos, gamePos, hexPos, entities);
    payload.button = event.button;

    console.log(payload.hex);
    if (this.lastPositionClicked) {
      //console.log("direction", mathlib.getCompassHeadingOfPoint(hexPos, this.lastPositionClicked));
    }

    this.phaseDirector.relayEvent("ClickEvent", payload);

    if (!this.lastPositionClicked) {
      //console.log("set last position clicked");
      this.lastPositionClicked = hexPos;
    }
  };

  webglScene.prototype.fireEvent = function(eventName, payload) {};

  function scroll(payload) {
    if (payload.stopped) return;

    if (payload.capture) {
      payload.capture(scroll.bind(this));
      return;
    }

    if (payload.release) return;

    var position = {
      x: payload.delta.game.x,
      y: payload.delta.game.y
    };

    this.moveCamera(position);
  }

  function animateZoom() {
    if (this.zoomTarget && this.zoomTarget != this.zoom) {
      var change = (this.zoomTarget - this.zoom) * 0.1;
      if (
        Math.abs(change) < 0.0001 ||
        (this.zoomTarget == 1 && Math.abs(change) < 0.0001)
      ) {
        this.zoomCamera(this.zoomTarget, true);
      } else {
        this.zoomCamera(this.zoom + change);
      }
    }
  }

  function mouseWheel(e) {
    e = e ? e : window.event;
    var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;

    var step = 0;
    if (wheelData < 0) step = 1;
    else step = -1;

    changeZoom.call(this, step);
  }

  function changeZoom(zoom) {
    zoom *= 0.5;
    if (zoom < -0.5) zoom = -0.5;

    this.zoominprogress = false;
    var newzoom = this.zoom + this.zoom * zoom;

    if (newzoom < ZOOM_MIN) newzoom = ZOOM_MIN;

    if (newzoom > ZOOM_MAX) newzoom = ZOOM_MAX;

    this.zoomTarget = newzoom;
  }

  function bindMouseWheelEvent(element) {
    element = element.get(0);
    if (element.addEventListener) {
      element.addEventListener("DOMMouseScroll", mouseWheel.bind(this), false);
      element.addEventListener("mousewheel", mouseWheel.bind(this), false);
    }
  }

  function getMousePositionInObservedElement(event) {
    if (event.originalEvent.touches) {
      return {
        x: event.originalEvent.touches[0].pageX - this.element.offset().left,
        y: event.originalEvent.touches[0].pageY - this.element.offset().top,
        xR:
          ((event.originalEvent.touches[0].pageX - this.element.offset().left) /
            window.innerWidth) *
            2 -
          1,
        yR:
          -(
            (event.originalEvent.touches[0].pageY - this.element.offset().top) /
            window.innerHeight
          ) *
            2 +
          1
      };
    }

    return {
      x: event.pageX - this.element.offset().left,
      y: event.pageY - this.element.offset().top,
      xR:
        ((event.pageX - this.element.offset().left) / window.innerWidth) * 2 -
        1,
      yR:
        -((event.pageY - this.element.offset().top) / window.innerHeight) * 2 +
        1
    };
  }

  function getPositionObject(view, game, hex, entities) {
    var o = {
      view: view,
      game: game,
      entities: entities || []
    };

    if (hex) {
      o.hex = hex;
    }

    return o;
  }

  return new webglScene();
})();
