window.StarField = (function(){

    function StarField(webglScene)
    {
        this.starCount = 5000;
        this.emitterContainer = null;
        this.webglScene = webglScene;
        this.lastAnimationTime = null;
        this.totalAnimationTime = 0;

        this.create();

    };

    StarField.prototype.create = function()
    {
     
        //Math.seedrandom(gamedata.gameid);

        this.emitterContainer = new ParticleEmitterContainer(this.webglScene.scene, this.starCount, StarParticleEmitter);
        
        /*
        var particle = this.emitterContainer.getParticle(this);
        particle.setActivationTime(0).setSize(160).setOpacity(1.0).setColor(new THREE.Color(1, 0, 0)).setParallaxFactor(0).setTexture(particle.texture.gas);

        
        particle = this.emitterContainer.getParticle(this);
        particle.setActivationTime(0).setSize(160).setOpacity(1.0).setPosition({x: 0, y: 100}).setColor(new THREE.Color(1, 0, 0)).setParallaxFactor(0.5);

        particle = this.emitterContainer.getParticle(this);
        particle.setActivationTime(0).setSize(160).setOpacity(1.0).setPosition({x: 0, y: 200}).setColor(new THREE.Color(1, 0, 0)).setParallaxFactor(1.0);

        */
       
        var stars = this.starCount;
        while(stars--) {
            createStar(this.emitterContainer, this.webglScene.width, this.webglScene.height);
        }

       
        var gas = 10;
         
        while(gas--){
            createGasCloud(this.emitterContainer, this.webglScene.width, this.webglScene.height)
        }

        this.emitterContainer.start();
        this.lastAnimationTime = new Date().getTime();
        this.totalAnimationTime = 0;
        return this;
    };

    StarField.prototype.render = function()
    {
        var deltaTime = new Date().getTime() - this.lastAnimationTime;
        this.totalAnimationTime += deltaTime;
        this.emitterContainer.render(0, this.totalAnimationTime);

        var frequency = 100;

        var y = 0.5 * Math.sin(this.totalAnimationTime/frequency);
        console.log(y)
        this.lastAnimationTime = new Date().getTime();
    };

    function createStar(emitterContainer, width, height) {
        var particle = emitterContainer.getParticle(this);

        var x = ((Math.random() - 0.5) * width * 1.5);
        var y = ((Math.random() - 0.5) * height * 1.5);

        particle
            .setActivationTime(0)
            .setSize(2 + Math.random() * 2)
            .setOpacity(Math.random() * 0.2 + 0.9)
            .setPosition({x: x, y: y})
            .setColor(new THREE.Color(1, 1, 1))
            .setParallaxFactor(0.005 + Math.random() * 0.005);
    }

    function createGasCloud(emitterContainer, width, height) {
        var gas = Math.floor(Math.random() * 10 + 10);
    
        var position = {
            x: ((Math.random() - 0.5) * width),
            y: ((Math.random() - 0.5) * height)
        }

        var vector = {
            x: getRandomBand(0.5, 1) * 100,
            y: getRandomBand(0.5, 1) * 100
        }

        var iterations = Math.floor(Math.random() * 3) + 5;

        while(iterations--) {
            createGasCloudPart(emitterContainer, {x: position.x, y: position.y});
            position.x += getRandomBand(0, 1) * 50 + vector.x; 
            position.y += getRandomBand(0, 1) * 50 + vector.y; 
        }
    }

    function getRandomBand(min, max) {
        var random = Math.random() * (max-min) + min;
        console.log("RANDOM", random, min, max)
        return Math.random() > 0.5 ? random * -1 : random;
    }

    function createGasCloudPart(emitterContainer, position) {
        var gas = Math.floor(Math.random() * 5 + 5);
        var baseRotation = (Math.random() - 0.5) * 0.002;

        while(gas--) {  
            createGas(emitterContainer, position, baseRotation, Math.random() * 250 + 750)
        }
    }

    function createGas(emitterContainer, position, baseRotation, size){
        var particle = emitterContainer.getParticle(this);

        position.x += (Math.random() - 0.5) * 100; 
        position.y += (Math.random() - 0.5) * 100; 

        particle
            .setActivationTime(0)
            .setSize( Math.random() * size*0.5 + size*0.5)
            .setOpacity(Math.random() * 0.005 + 0.005)
            .setPosition({x: position.x, y: position.y})
            .setColor(new THREE.Color(104/255, 204/255, 249/255))
            .setTexture(particle.texture.gas)   
            .setAngle(Math.random(360))
            .setAngleChange(baseRotation + (Math.random() - 0.5) * 0.001)
            .setParallaxFactor(0.005 + Math.random() * 0.005);

    }

    return StarField
})();