window.shipManager = {

	

	initShips: function(){
	
		for (var i in gamedata.ships){
			shipManager.createHexShipDiv(gamedata.ships[i]);
		}
	
	},
	
    createHexShipDiv: function(ship){
    
        if (ship.htmlContainer)
            return;
        
        var e = $("#pagecontainer #hexship_"+ship.id+".hexship");

        if (!e.length){
            

            e = $("#templatecontainer .hexship");
            e.attr("id", "hexship_" + ship.id);
            var s = shipManager.getShipCanvasSize(ship);
            var w = s;
            var h = s;
            $("canvas.hexshipcanvas", e).attr("id", "shipcanvas_"+ship.id).attr("width", w).attr("height", h);
            var n = e.clone(true).appendTo("#pagecontainer");
            n.data("ship", ship.id);
            ship.htmlContainer = $("#pagecontainer #hexship_"+ship.id);
            ship.shipclickableContainer = $('<div oncontextmenu="shipManager.onShipContextMenu(this);return false;" class="shipclickable ship_'+ship.id+'"></div>').appendTo("#pagecontainer");
            ship.shipclickableContainer.data("id", ship.id);
			ship.shipStatusWindow = shipWindowManager.createShipWindow(ship);
			shipWindowManager.setData(ship);
            $("canvas.hexshipcanvas", e).attr("id", "shipcanvas_");
            e.attr("id", "hexship_");
        }else{
            ship.htmlContainer = e;
            ship.shipclickableContainer = $(".shipclickable.ship_"+ship.id);
			ship.shipStatusWindow = $(".shipwindow.ship_"+ship.id);
			shipWindowManager.setData(ship);
        }
		
		if (shipManager.isDestroyed(ship))
			ship.dontDraw = true;
    },
    
    drawShips: function(){
        for (var i in gamedata.ships){
            shipManager.drawShip(gamedata.ships[i]);
        }
    },
    
    drawShip: function(ship){
    
        if (!ship.htmlContainer)
            shipManager.createHexShipDiv(ship);
        
		if (ship.dontDraw){
			ship.shipclickableContainer.css("z-index", "1");
			ship.htmlContainer.hide();
			return;
		}
        //graphics.clearCanvas("shipcanvas_" + ship.id);         
        var canvas = window.graphics.getCanvas("shipcanvas_" + ship.id);
        
        canvas.fillStyle    = hexgrid.hexlinecolor;;
        canvas.font         = 'italic 12px sans-serif';
        canvas.textBaseline = 'top';
        
        var pos = shipManager.getShipPositionForDrawing(ship);
        
        
        
        var s = shipManager.getShipCanvasSize(ship);
        var h = Math.round(s/2)
        var hexShipZ = 1000+ship.id;
        var scZ = 3000+ship.id;
        if (gamedata.mouseOverShipId == ship.id){
            hexShipZ+=500;
            scZ+=500;
        }
        
        if (gamedata.activeship == ship.id || gamedata.isSelected(ship)){
            hexShipZ+=250;
            scZ+=250;
        }
        ship.htmlContainer.css("top", pos.y -h + "px").css("left", pos.x -h + "px").css("z-index", hexShipZ);
        
        
        var img = new Image();
        img.src = ship.imagePath; 
        var sc = ship.shipclickableContainer;
        scSize = s*0.15*gamedata.zoom;
        sc.css("width", scSize+"px");
        sc.css("height", scSize+"px");
        sc.css("left", ((pos.x) - (scSize*0.5))+"px");
        sc.css("top", ((pos.y) - (scSize*0.5))+"px");
        sc.css("z-index", scZ);
        
        
        
        //console.log("gamedata.gamephase: " + gamedata.gamephase + " gamedata.activeship: " + gamedata.activeship + " ship.id: " + ship.id);
        if (gamedata.gamephase == 2 && gamedata.activeship == ship.id && gamedata.animating == false && gamedata.waiting == false && gamedata.isMyShip(ship))
            UI.shipMovement.drawShipMovementUI(ship);
        
        $(img).bind("load", function(){
            canvas.clearRect(0, 0, s, s);
            
            if (gamedata.mouseOverShipId == ship.id && gamedata.gamephase > 1){
                if (gamedata.zoom > 0){
                    
                    var dew = ew.getDefensiveEW(ship);
                    if (dew > 0){
                        dew = Math.ceil(( dew )*gamedata.zoom*0.5);
                        canvas.strokeStyle = "rgba(144,185,208,0.40)";
                        graphics.drawCircle(canvas, s/2, s/2, s*0.18*gamedata.zoom, dew);
                    }
                    var ccew = ew.getCCEW(ship);
                    if (ccew > 0){
                        ccew = Math.ceil(( ccew )*gamedata.zoom*0.5);
                        canvas.strokeStyle = "rgba(20,80,128,0.50)";
                        graphics.drawCircle(canvas, s/2, s/2, ((s*0.18*gamedata.zoom)+(dew*0.5) + (ccew*0.5) + 2), ccew);
                    }
                }
                
            }
			if (gamedata.isSelected(ship) && gamedata.mouseOverShipId != ship.id && !(gamedata.gamephase == 2 && ship.id == gamedata.activeship)) {
				canvas.strokeStyle = "rgba(144,185,208,0.40)";
                canvas.fillStyle = "rgba(255,255,255,0.18)";
                
                graphics.drawCircleAndFill(canvas, s/2, s/2, s*0.15*gamedata.zoom+1, 1);
			}else if ( gamedata.mouseOverShipId == ship.id ){
			
				if (ship.userid == gamedata.thisplayer){
					canvas.strokeStyle = "rgba(86,200,45,0.60)";
					canvas.fillStyle = "rgba(50,122,24,0.50)";
                }else{
					canvas.strokeStyle = "rgba(229,87,38,0.60)";
					canvas.fillStyle = "rgba(179,65,25,0.50)";
				
				}
				
				graphics.drawCircleAndFill(canvas, s/2, s/2, s*0.15*gamedata.zoom+1, 1);
			
			
			}
            
			if (gamedata.isTargeted(ship)) {
				canvas.strokeStyle = "rgba(144,185,208,0.40)";
                canvas.fillStyle = "rgba(255,255,255,0.18)";
                
                graphics.drawCircleAndFill(canvas, s/2, s/2, s*0.15*gamedata.zoom+1, 1);
			}
			
            graphics.drawAndRotate(canvas, s, s, s*gamedata.zoom, s*gamedata.zoom, shipManager.getShipHeadingAngleForDrawing(ship), img);
            
        });
        
    },
    

    getShipCanvasSize: function(ship){
        if (ship.shipSizeClass == 4){
            return 400;
        }
        
        if (ship.shipSizeClass >= 2){
            return 200;
        }
        
        if (ship.shipSizeClass < 2){
            return 100;
        }
        
        
        
    },  
    
    hasAnimationsDone: function(ship){
    
        for (var i in ship.movement){
            movement = ship.movement[i];
            if (movement.animated == false || movement.commit == false){
                return false
            }
            
        }
        
        return true;
    },
    
        
    getShipDoMAngle: function(ship){
        var d = shipManager.movement.getLastCommitedMove(ship).heading;
        if (d == 0){
            return 0;
        }
        if (d == 1){
            return 60;
        }
        if (d == 2){
            return 120;
        }
        if (d == 3){
            return 180;
        }
        if (d == 4){
            return 240;
        }
        if (d == 5){
            return 300;
        }
        
    
    },
    
    getShipHeadingAngle: function(ship){
        
        var d = shipManager.movement.getLastCommitedMove(ship).facing;
        if (d == 0){
            return 0;
        }
        if (d == 1){
            return 60;
        }
        if (d == 2){
            return 120;
        }
        if (d == 3){
            return 180;
        }
        if (d == 4){
            return 240;
        }
        if (d == 5){
            return 300;
        }
        
    
    },
    
    hexFacingToAngle: function(d){
        
        if (d == 0){
            return 0;
        }
        if (d == 1){
            return 60;
        }
        if (d == 2){
            return 120;
        }
        if (d == 3){
            return 180;
        }
        if (d == 4){
            return 240;
        }
        if (d == 5){
            return 300;
        }
        
    
    },
    
    getShipHeadingAngleForDrawing: function(ship){
        
        var movement = null;    
        for (var i in ship.movement){
            movement = ship.movement[i];
            if (movement.animated == true)
                continue;
                
            if (movement.type=="turnleft" || movement.type=="turnright"){
                var last = ship.movement[i-1];
                var lastheading = shipManager.hexFacingToAngle(last.facing);
                var destination = shipManager.hexFacingToAngle(movement.facing);
                var perc = movement.animationtics / animation.turningspeed;
                
                var right = (movement.type=="turnright");
                
                return mathlib.getFacingBetween(lastheading, destination, perc, right);
                
            }
            
            if (movement.type=="pivotleft" || movement.type=="pivotright"){
                var last = ship.movement[i-1];
                var lastheading = shipManager.hexFacingToAngle(last.facing);
                var destination = shipManager.hexFacingToAngle(movement.facing);
                var perc = movement.animationtics / animation.turningspeed;
                
                var right = (movement.type=="pivotright");
                
                return mathlib.getFacingBetween(lastheading, destination, perc, right);
                
            }
            
            break;
        
        }
            
        
        return shipManager.getShipHeadingAngle(ship);
            
    },
    
    getShipPosition: function(ship){
        var movement = shipManager.movement.getLastCommitedMove(ship);
		var x = movement.x;
        var y = movement.y;
        var xO = movement.xOffset;
        var yO = movement.yOffset;
        return {x:x, y:y, xO:xO, yO:yO};
    },
    
    
    getShipPositionInWindowCo: function(ship){
        var hexpos = shipManager.getShipPosition(ship);
        var pos = hexgrid.hexCoToPixel(hexpos.x, hexpos.y);
        
        pos.x = pos.x + (hexpos.xO*gamedata.zoom);
        pos.y = pos.y + (hexpos.yO*gamedata.zoom);
        
        return pos;
    
    },
    
    getShipPositionForDrawing: function(ship){
        var movement = null;    
		
        for (var i in ship.movement){
            if (ship.movement[i].commit == false)
				break;
				
            movement = ship.movement[i];
			
            if (movement.animated == true)
                continue;
			
			
                                
            if (movement.type=="move" || movement.type=="slipright" || movement.type=="slipleft"){
                var last = ship.movement[i-1];
                var lastpos = hexgrid.hexCoToPixel(last.x, last.y);
                lastpos.x = lastpos.x + (last.xOffset*gamedata.zoom);
                lastpos.y = lastpos.y + (last.yOffset*gamedata.zoom);
                var destination = hexgrid.hexCoToPixel(movement.x, movement.y);
                destination.x = destination.x + (movement.xOffset*gamedata.zoom);
                destination.y = destination.y + (movement.yOffset*gamedata.zoom);
                var perc = movement.animationtics / animation.movementspeed;
                
                return mathlib.getPointBetween(lastpos, destination, perc);
                
            }
            
            break;
            
        
        }
        
    
        var x = movement.x;
        var y = movement.y;
        
        var lastpos = hexgrid.hexCoToPixel(x, y);
        lastpos.x = lastpos.x + (movement.xOffset*gamedata.zoom);
        lastpos.y = lastpos.y + (movement.yOffset*gamedata.zoom);
        return lastpos;
    },
    
    onShipContextMenu: function(e){
        var id = $(e).data("id");
        var ship = gamedata.getShip(id);
		
		if (shipSelectList.haveToShowList(ship)){
			shipSelectList.showList(ship);
		}else{
			shipManager.doShipContextMenu(ship);
		}
		
    },
	
	doShipContextMenu: function(ship){
	
		shipSelectList.remove();
	
		if (shipManager.isDestroyed(ship))
			return;
		
		if (ship.userid == gamedata.thisplayer && (gamedata.gamephase == 1 || gamedata.gamephase >2)){
			shipWindowManager.open(ship);
			gamedata.selectShip(ship, false);
			gamedata.shipStatusChanged(ship);
			drawEntities();
		}else{
			shipWindowManager.open(ship);
		}
        return false;
	
	},
    
    onShipDblClick: function(e){
        
        
    },
    
    onShipClick: function(e){

        var id = $(this).data("id");
        var ship = gamedata.getShip(id);
		
		if (shipSelectList.haveToShowList(ship)){
			shipSelectList.showList(ship);
		}else{
			shipManager.doShipClick(ship);
		}
		
    },
	
	doShipClick: function(ship){
		
		shipSelectList.remove();
	
		if (gamedata.thisplayer == -1)
			return;
		
		if (shipManager.isDestroyed(ship))
			return;
		
        if (gamedata.gamephase == 2)
            return;
        
        if (ship.userid == gamedata.thisplayer){
            gamedata.selectShip(ship, false);
        }
		
		if (ship.userid != gamedata.thisplayer && gamedata.gamephase == 3){
           weaponManager.targetShip(ship);
        }
        
        if (gamedata.gamephase == 1 && ship.userid != gamedata.thisplayer){
			if (gamedata.selectedSystems.length > 0){
				weaponManager.targetShip(ship);
			}else{
				ew.AssignOEW(ship);
			}
        }
        gamedata.shipStatusChanged(ship);
        drawEntities();
		//scrolling.scrollToShip(ship);
	
	},
	
	isDestroyed: function(ship){
		
		var stru = shipManager.systems.getStructureSystem(ship, 0);
		if (shipManager.systems.isDestroyed(ship, stru))
			return true;
			
		return false;
		
	},
	
	isAdrift: function(ship){
		
		
		if (shipManager.systems.isDestroyed(ship, shipManager.systems.getSystemByName(ship, "CnC"))
			|| shipManager.systems.isDestroyed(ship, shipManager.systems.getSystemByName(ship, "reactor"))){
			return true;
		}
		
		if (shipManager.power.isPowerless(ship))
			return true;
		
		return false;
	},
	
	getTurnDestroyed: function(ship){
		var stru = shipManager.systems.getStructureSystem(ship, 0);
		var turn = damageManager.getTurnDestroyed(ship, stru);
		
		return turn;
		
	},
	
	getIniativeOrder: function(ship){
		var order = 1;
		
		for (var i in gamedata.ships){
			if (shipManager.isDestroyed(gamedata.ships[i]))
				continue;
			
			if (gamedata.ships[i] == ship)
				return order;
			
			order++;
		}
		
		return 0;
	},
	
	hasBetterInitive: function(a, b){
		console.log(a.name);
		if (a.iniative > b.iniative)
			return true;
		
		if (a.iniative < b.iniative)
			return false;
			
		if (a.iniative == b.iniative){
			if (a.iniativebonus > b.iniativebonus)
				return true;
				
			if (b.iniativebonus > a.iniativebonus)
				return false;
				
			for (var i in gamedata.ships){
				if (gamedata.ships[i] == a)
					return false;
				
				if (gamedata.ships[i] == b)
					return true;				
					
			}
		}
		
		return false;
		
	},
	
	getShipsInSameHex: function(ship){
		var shipsInHex = Array();
		for (var i in gamedata.ships){
			var ship2 = gamedata.ships[i];
			
			//if (ship.id = ship2.d)
			//	continue;
				
			var pos1 = shipManager.getShipPosition(ship);
			var pos2 = shipManager.getShipPosition(ship2);
			
			
			if (pos1.x == pos2.x && pos1.y == pos2.y){
				shipsInHex.push(ship2);
			}
		}
		
		return shipsInHex;
	
	}
	
    
    

}
