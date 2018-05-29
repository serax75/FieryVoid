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
	  //Improved Sensors (official): +1 Sensors, cost: new rating *5, limit: 1
	  $enhID = 'IMPR_SENS';
	  $enhName = 'Improved Sensor Array';
	  $enhLimit = 1;	
	  
	  //find strongest sensors... which don't need to be called Sensors!
	  
	  $enhPrice = max(1,$flight->offensivebonus*5);	  
	  $enhPriceStep = 0;
	  $ship->enhancementOptions[] = array($enhID, $enhName,0,$enhLimit, $enhPrice, $enhPriceStep);
	  


	  
	  
  } //endof function setEnhancementOptionsShip

  public static function setEnhancementOptionsFighter($flight){
	  //Improved Targeting Computer (official): +1 OB, cost: old rating *5, limit: 1
	  $enhID = 'IMPR_OB';
	  $enhName = 'Improved Targeting Computer';
	  $enhLimit = 1;	
	  $enhPrice = max(1,$flight->offensivebonus*5);	  
	  $enhPriceStep = 0;
	  $ship->enhancementOptions[] = array($enhID, $enhName,0,$enhLimit, $enhPrice, $enhPriceStep);
	  
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
  } //endof function setEnhancements

	   /*enhancements for fighters
	   */
	   private static function setEnhancementsFighter($flight)}
	   	foreach($flight->enhancementOptions as $entry){			
			//ID,readableName,numberTaken,limit,price,priceStep
			$enhID = $entry[0];
			$enhCount = $entry[2];
			if($enhCount > 0) switch ($enhID) { 
			    case 0:
				break;
			    case 1:
				break;
			    case 2:
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
			    case 0:
				break;
			    case 1:
				break;
			    case 2:
				break;
			}
			
		}
	   }//endof function setEnhancementsShip
	   	   
} //endof class Enhancements

?>
