'use strict';

window.StarParticleEmitter = function () {

    var SHADER_VERTEX = null;
    var SHADER_FRAGMENT = null;

    var texture = new THREE.TextureLoader().load("img/effect/effectTextures1024.png");

    function StarParticleEmitter(scene, particleCount, blending) {
        Animation.call(this);

        console.log("STAR PARTICLE EMITTER")

        if (!blending) blending = THREE.AdditiveBlending;

        if (!particleCount) {
            particleCount = 1000;
        }

        this.scene = scene;

        this.free = [];
        for (var i = 0; i < particleCount; i++) {
            this.free.push(i);
        }

        this.effects = 0;

        var customMatrix = new THREE.Matrix4();
        customMatrix.set(0.00078125, 0, 0, 0, 0, 0.0024813895781637717, 0, 0, 0, 0, -0.001, 0, -0, -0, -0, 1)

        var uniforms = {
            gameTime: { type: 'f', value: 0.0 },
            texture: { type: 't', value: texture },
            customMatrix: { type: 'm4', value: customMatrix}
        };

        this.particleGeometry = new THREE.BufferGeometry();

        this.particleGeometry.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3).setDynamic(true));
        this.particleGeometry.addAttribute('size', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('sizeChange', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3).setDynamic(true));
        this.particleGeometry.addAttribute('opacity', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('fadeInTime', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('fadeInSpeed', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('fadeOutTime', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('fadeOutSpeed', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('activationGameTime', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('velocity', new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3).setDynamic(true));
        this.particleGeometry.addAttribute('acceleration', new THREE.Float32BufferAttribute(new Float32Array(particleCount * 3), 3).setDynamic(true));
        this.particleGeometry.addAttribute('textureNumber', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('angle', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('angleChange', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));
        this.particleGeometry.addAttribute('parallaxFactor', new THREE.Float32BufferAttribute(new Float32Array(particleCount), 1).setDynamic(true));


        this.particleGeometry.dynamic = true;

        this.particleGeometry.setDrawRange(0, particleCount);

        var shaders = getShaders();

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shaders.vertex,
            fragmentShader: shaders.fragment,
            transparent: true,
            alphaTest: 0.5, // if having transparency issues, try including: alphaTest: 0.5,
            blending: blending, depthTest: true
        });

        /*
        THREE.NormalBlending = 0;
        THREE.AdditiveBlending = 1;
        THREE.SubtractiveBlending = 2;
        THREE.MultiplyBlending = 3;
        THREE.AdditiveAlphaBlending = 4;
        */

        this.flyParticle = new StarParticle(this.particleMaterial, this.particleGeometry);

        while (particleCount--) {
            this.flyParticle.create(particleCount).setInitialValues();
        }

        this.mesh = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.mesh.frustumCulled = false;
        this.mesh.matrixAutoUpdate = false;
        this.mesh.position.set(0, 0, -10);

        this.needsUpdate = false;

        this.scene.add(this.mesh);
        
        console.log(customMatrix)
    }

    StarParticleEmitter.prototype = Object.create(Animation.prototype);

    StarParticleEmitter.prototype.start = function () {
        this.active = true;
    };

    StarParticleEmitter.prototype.stop = function () {
        this.active = false;
    };

    StarParticleEmitter.prototype.reset = function () {};

    StarParticleEmitter.prototype.cleanUp = function () {
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);
    };

    StarParticleEmitter.prototype.update = function (gameData) {};

    StarParticleEmitter.prototype.render = function (now, total) {
        this.particleMaterial.uniforms.gameTime.value = total;
        this.mesh.material.needsUpdate = true;
    };

    StarParticleEmitter.prototype.done = function () {
        if (this.onDoneCallback) {
            this.onDoneCallback();
        }
    };

    StarParticleEmitter.prototype.getParticle = function () {
        if (this.free.length === 0) {
            return false;
        }

        var i = this.free.pop();

        return this.flyParticle.create(i);
    };

    StarParticleEmitter.prototype.freeParticles = function (particleIndices) {
        particleIndices.forEach(function (i) {
            this.flyParticle.create(i).setInitialValues();
        }, this);
        this.free = this.free.concat(particleIndices);
    };

    function getShaders() {
        if (!SHADER_VERTEX) var SHADER_VERTEX = document.getElementById('starVertexShader').innerHTML;

        if (!SHADER_FRAGMENT) var SHADER_FRAGMENT = document.getElementById('starFragmentShader').innerHTML;

        return { vertex: SHADER_VERTEX, fragment: SHADER_FRAGMENT };
    }

    return StarParticleEmitter;
}();