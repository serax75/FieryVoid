<?php

/*class responsible for unit enhancements
*/
class Enhancements{

  /*sets enhancement options for a given ship
  called by setEnhancements if database is empty
  */
  public static function setEnhancementOptions($ship){
	  /* ALL ENHANCEMENT OPTIONS ARE DEFINED HERE 
	  	(or rather in appropriate subroutines for fighters and ships)
	  */
	if($ship instanceof FighterFlight){
		Enhancements::setEnhancementOptionsFighter($ship);
	}else{
		Enhancements::setEnhancementOptionsShip($ship);
	}	
  } //endof function setEnhancementOptions

  public static function setEnhancementOptionsShip($ship){ 
	//Improved Engine (official): +1 Thrust, cost: new rating *5, limit: up to +50%
	  $enhID = 'IMPR_ENG';
	  if(!in_array($enhID, $ship->enhancementOptionsDisabled)){ //option is not disabled
		  $enhName = 'Improved Engine';
		  //find strongest engine.. which don't need to be called Engine!
		  $strongestValue = -1;	  
		  foreach ($this->systems as $system){
			if ($system instanceof Engine){
				if($system->output > $strongestValue) {
					$strongestValue = $system->output;
				}
			}
		  }  
		  if($strongestValue > 0){ //Engine actually exists to be enhanced!
			  $enhPrice = max(1,$strongestValue*5);	  
			  $enhPriceStep = ceil($enhPrice*0.1); //shouldn't be linear, but let's simplify
			  $enhLimit = ceil($strongestValue/2);	  
			  $ship->enhancementOptions[] = array($enhID, $enhName,0,$enhLimit, $enhPrice, $enhPriceStep);
		  }
	  }
	  
	  //Improved Sensors (official): +1 Sensors, cost: new rating *5, limit: 1
	  $enhID = 'IMPR_SENS';
	  if(!in_array($enhID, $ship->enhancementOptionsDisabled)){ //option is not disabled
		  $enhName = 'Improved Sensor Array';
		  $enhLimit = 1;	  
		  //find strongest sensors... which don't need to be called Sensors!
		  $strongestValue = -1;	  
		  foreach ($this->systems as $system){
			if ($system instanceof Scanner){
				if($system->output > $strongestValue) {
					$strongestValue = $system->output;
				}
			}
		  }  
		  if($strongestValue > 0){ //Sensors actually exist to be enhanced!
			  $enhPrice = max(1,$strongestValue*5);	  
			  $enhPriceStep = 0;
			  $ship->enhancementOptions[] = array($enhID, $enhName,0,$enhLimit, $enhPrice, $enhPriceStep);
		  }
	  }

	  
	  
  } //endof function setEnhancementOptionsShip

	
  public static function setEnhancementOptionsFighter($flight){
	  //Improved Targeting Computer (official): +1 OB, cost: old rating *5, limit: 1
	  $enhID = 'IMPR_OB';	  
	  if(!in_array($enhID, $ship->enhancementOptionsDisabled)){ //option is not disabled
		  $enhName = 'Improved Targeting Computer';
		  $enhLimit = 1;	
		  $enhPrice = max(1,$flight->offensivebonus*5);	  
		  $enhPriceStep = 0;
		  $ship->enhancementOptions[] = array($enhID, $enhName,0,$enhLimit, $enhPrice, $enhPriceStep);
	  }
	  
	  //Navigator (official): +1 OB, cost: old rating *5, limit: 1
	  $enhID = 'NAVIGATOR';	  
	  if(in_array($enhID, $ship->enhancementOptionsEnabled){ //option needs to be specifically enabled
		  $enhName = 'Navigator (missile guidance, +5 Initiative)';
		  $enhLimit = 1;	
		  $enhPrice = 10;	  
		  $enhPriceStep = 0;
		  $ship->enhancementOptions[] = array($enhID, $enhName,0,$enhLimit, $enhPrice, $enhPriceStep);
	  }
  } //endof function setEnhancementOptionsFighter
	    
    
  
  /*actually enhances unit (sets enhancement options if enhancements themselves are empty)
  */
  public static function setEnhancements($ship){
	if(count( $ship->enhancementOptions == 0){ //no enhancement options - this must mean we're in fleet selection and a full list of options is requested
		Enhancements::setEnhancementOptions($ship);
		return(); //no point implementing enhancements that aren't there yet!
	}

	//actually implement enhancements - it's more convenient to divide fighters and ships here
	if($ship instanceof FighterFlight){
		Enhancements::setEnhancementsFighter($ship);
	}else{
		Enhancements::setEnhancementsShip($ship);
	}	
	   
	//clear array of options - no further point keeping it
	$ship->enhancementOptions = array();
	$ship->enhancementOptionsEnabled = array();
	$ship->enhancementOptionsDisabled = array();
  } //endof function setEnhancements

	   /*enhancements for fighters
	   */
	   private static function setEnhancementsFighter($flight)}
	   	foreach($flight->enhancementOptions as $entry){			
			//ID,readableName,numberTaken,limit,price,priceStep
			$enhID = $entry[0];
			$enhCount = $entry[2];
			if($enhCount > 0) switch ($enhID) { 
				case 'IMPR_OB': //Improved Targeting Computer: +1 OB
					$flight->offensivebonus++;
					break;
					
				case 'NAVIGATOR': //navigator: navigator flag - it activates appropriate segments of code
					$flight->hasNavigator = true;
					break;
			}			
		}
	   }//endof function setEnhancementsFighter
  
	   /*enhancements for ships
	   */
	   private static function setEnhancementsShip($ship)}
	   	foreach($ship->enhancementOptions as $entry){
			//ID,readableName,numberTaken,limit,price,priceStep
			$enhID = $entry[0];
			$enhCount = $entry[2];
			if($enhCount > 0) switch ($enhID) {
				case 'IMPRENG': //Improved Engine: +1 Engine output (strongest Engine), may be taken multiple times
					$strongestSystem = null;
					$strongestValue = -1;	  
					foreach ($this->systems as $system){
						if ($system instanceof Engine){
							if($system->output > $strongestValue) {
								$strongestValue = $system->output;
								$strongestSystem = $system;
							}
						}
					}  
					if($strongestValue > 0){ //Engine actually exists to be enhanced!
						$strongestSystem->output += $enhCount;
					}
					break;
					
				case 'IMPR_SENS': //Improved Scanner: +1 Scanner output (strongest Scanner)
					$strongestSystem = null;
					$strongestValue = -1;	  
					foreach ($this->systems as $system){
						if ($system instanceof Scanner){
							if($system->output > $strongestValue) {
								$strongestValue = $system->output;
								$strongestSystem = $system;
							}
						}
					}  
					if($strongestValue > 0){ //Engine actually exists to be enhanced!
						$strongestSystem->output += $enhCount;
					}
					break;
				
			}
			
		}
	   }//endof function setEnhancementsShip
	   	   
} //endof class Enhancements

?>
