


window.damageDrawer = {
    
    damageimg: null,
    damagemaskimg: null, 
    
    getOrginalImage: function(ship){
        return shipManager.shipImages[ship.id];
    },
    
    getShipImage: function(ship){
        //{orginal:img, orginalimagedata:null, modimagedata:null};
        var images = shipManager.shipImages[ship.id];
        if (!images.modified){

            var width = ship.canvasSize;
			var height = ship.canvasSize;
            var canvas  = $('<canvas id="constcan" width="'+width+'" height="'+height+'"></canvas>');
            var context = canvas.get(0).getContext("2d");
            var orginal = images.orginal;
            if (!orginal.loaded){
                //console.log("image not loaded, returning orginal");
                return images.orginal;
            }
                
            context.drawImage(orginal, 0, 0);
            var data = context.getImageData(0, 0, width, height);
            data = damageDrawer.drawDamage(ship, data, true);
            context.clearRect ( 0 , 0 , width, height );
            context.putImageData(data, 0, 0);
            
            var img = new Image();
            img.src = canvas.get(0).toDataURL();
            
            images.modified = img;
            $(images.modified).bind("load", function(){
                images.modified.loaded = true;
                
                
            });
            
        }
        return images.modified;
        
        
        
        
    },
    
    checkDamages: function(){
        
        for (var i in gamedata.ships){
            
            damageDrawer.checkDamage(gamedata.ships[i]);
            
        }
        
        
    },
    
    checkDamage: function(ship){
        var images = shipManager.shipImages[ship.id];
        var width = ship.canvasSize;
        var height = ship.canvasSize;
        
        var canvas  = $('<canvas id="constcan" width="'+width+'" height="'+height+'"></canvas>');
        var context = canvas.get(0).getContext("2d");
        var image = images.modified;
        if (!image){
            console.log("checkDamage: modified image not ready");
            return;
        }
            
        if (!image.loaded){
            console.log("checkDamage: image not loaded");
            return;
        }
        
        context.drawImage(image, 0, 0);
        var data = context.getImageData(0, 0, width, height);
        data = damageDrawer.drawDamage(ship, data, false);
        context.clearRect ( 0 , 0 , width, height );
        context.putImageData(data, 0, 0);
        
        var img = new Image();
        img.src = canvas.get(0).toDataURL();
        
        images.modified = img;
         $(images.modified).bind("load", function(){
            images.modified.loaded = true;
            ship.drawDamage = true;
            shipManager.drawShip(ship);
         });
    },
    
    drawDamage: function(ship, image, all){
        var images = shipManager.shipImages[ship.id];
        
        if (images.turn == gamedata.turn && images.phase == gamedata.gamephase)
            return image;
            
        if (ship.flight){
			//return image;
			image = damageDrawer.drawFlight(ship, image);
		}else{
        
			var stru = shipManager.systems.getStructureSystem(ship, 1);
			var desTurn = damageManager.getTurnDestroyed(ship, stru);
					
			if (stru && desTurn && (desTurn >= images.turn || all)){
				image = damageDrawer.applyDamage(ship, 1, image);
			}
			
			stru = shipManager.systems.getStructureSystem(ship, 2);
			desTurn = damageManager.getTurnDestroyed(ship, stru);
					
			if (stru && desTurn && (desTurn >= images.turn || all)){
				image = damageDrawer.applyDamage(ship, 2, image);
			}
			
			stru = shipManager.systems.getStructureSystem(ship, 3);
			desTurn = damageManager.getTurnDestroyed(ship, stru);
					
			if (stru && desTurn && (desTurn >= images.turn || all)){
				image = damageDrawer.applyDamage(ship, 3, image);
			}
			
			stru = shipManager.systems.getStructureSystem(ship, 4);
			desTurn = damageManager.getTurnDestroyed(ship, stru);
					
			if (stru && desTurn && (desTurn >= images.turn || all)){
				image = damageDrawer.applyDamage(ship, 4, image);
			}
		}
        images.turn = gamedata.turn;
        images.phase = gamedata.gamephase;
        
        return image;
        
        
    },
    
    applyDamage: function(ship, location, image){
		console.log("apply damage: " + ship.name);
        var images = shipManager.shipImages[ship.id];
        var width = images.orginal.width;
        var height = images.orginal.height;
        var canvas  = $('<canvas id="constcanDam" width="'+width+'" height="'+height+'"></canvas>');
        var context = canvas.get(0).getContext("2d");
        var x = 0;
        var y = 0;
        var imageData = image.data;
        
        var range = Math.floor((width - 200)*0.66);
       
        var pixels = 4 * width * height;
        
        if (location == 1){
            x = width-100;
            y = Math.floor((height-200)*0.5);
        }else if (location == 2){
            x = -100;
            y = Math.floor((height-200)*0.5);
        }else if (location == 3){
            x = Math.floor((width-200)*0.5);
            //y = 100 + range;
            y = (-100)+range;
        }else if (location == 4){
            x = Math.floor((width-200)*0.5);
            
            y = height-100 - range;
        }
        console.log("r: " +range+"x: " + x + " y: " + y + " loc: " + location);
        
        context.drawImage(damageDrawer.damageimg, x, y);
        var damage = context.getImageData(0, 0, width, height);
        var damageData = damage.data;
        context.clearRect ( 0 , 0 , width, height );
        
        context.drawImage(damageDrawer.damagemaskimg, x, y);
        var mask = context.getImageData(0, 0, width, height);
        var maskData = mask.data;
        context.clearRect ( 0 , 0 , width, height );
        
        while (pixels) {
            var r = pixels-4;
            var g = pixels-3;
            var b = pixels-2;
            var a = pixels-1;
            
            var a1 = imageData[a];
            var a2 = damageData[a];
            var a3 = 255 - maskData[a];
            
            if (a3 < 255 ){
                var na = (a1 < a3) ? a1 : a3;
                imageData[a] = na;
                    
            }
            
            
            
            if (a1 == 0 || a2 == 0){
                    pixels -= 4;
                    continue;
            }
            
            
            
                
            var m = a2 / 255;
            //alphaComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 3];
            imageData[r] = imageData[r] * (1-m) + damageData[r] * m;
            imageData[g] = imageData[g] * (1-m) + damageData[g] * m;
            imageData[b] = imageData[b] * (1-m) + damageData[b] * m;
            
            
            
            
            
            
            pixels -= 4;
            
            
        }
        image.data = imageData;
        
        return image;

    },
    
    drawFlight: function(flight, image){
		console.log("Draw flight: " + flight.name);
		var images = shipManager.shipImages[flight.id];
        var width = flight.canvasSize;
        var height = flight.canvasSize;
        var canvas  = $('<canvas id="constcanFlight" width="'+width+'" height="'+height+'"></canvas>');
        var context = canvas.get(0).getContext("2d");
        
        
        
        
        for (var i in flight.systems){
			var x = 50;
			var y = 50;
			
			//if (i != 2)
			//	continue;
				
			var fighter = flight.systems[i];
			
			if (shipManager.systems.isDestroyed(flight, fighter)){
				continue;
			}
			var offset = shipManager.getFighterPosition(fighter.location, 0, 2);
		
			x += offset.x;
			y += offset.y;
			
			
			
			var w = images.orginal.width;
			var h = images.orginal.height;
			
			x -= Math.round(w/2);
			y -= Math.round(h/2);
			
			context.drawImage(images.orginal, x, y, w, h);
		}
        
        return context.getImageData(0, 0, width, height);
        
	}  
    
    
    
};

(function(){
    
    window.damageDrawer.damageimg = new Image();
    window.damageDrawer.damageimg.src = "img/damage.png";
    
    window.damageDrawer.damagemaskimg = new Image();
    window.damageDrawer.damagemaskimg.src = "img/damagemask.png";

    
})();
