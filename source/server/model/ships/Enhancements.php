<?php

/*class responsible for unit enhancements
*/
class Enhancements{

  /*sets enhancement options for a given ship
  called by setEnhancements if database is empty
  */
  public static function setEnhancementOptions($ship){
    $shid = $ship->id;
	     $ship->enhancementOptions[] = array('TESTX','Test Enhancement Option X',0,2,125,0); //ID,readableName,numberTaken,limit,price,priceStep
	     $ship->enhancementOptions[] = array('TESTV2','Test Enhancement Option Variable Price (central)',0,4,100,50);
   	 $ship->enhancementOptions[] = array('TESSHIPID',"Test ship id: $shid",0,4,100,50);
    
    
  } //endof function setEnhancementOptions

  
  
  /*actually enhances unit (sets enhancement options if enhancements themselves are empty)
  */
  public static function setEnhancements($ship){
    //if($ship->id < 1){
      Enhancements::setEnhancementOptions($ship)
    //}
    
    
  } //endof function setEnhancements

  
} //endof class Enhancements

?>
