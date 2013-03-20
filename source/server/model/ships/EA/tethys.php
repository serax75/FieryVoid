<?php
class Tethys extends MediumShip{
    
    function __construct($id, $userid, $name,  $slot){
        parent::__construct($id, $userid, $name,  $slot);
        
	$this->pointCost = 375;
	$this->faction = "EA";
        $this->phpclass = "Tethys";
        $this->imagePath = "img/ships/tethys.png";
        $this->shipClass = "Tethys";
        $this->canvasSize = 100;
        
        $this->forwardDefense = 13;
        $this->sideDefense = 13;
        
        $this->turncost = 0.33;
        $this->turndelaycost = 0.5;
        $this->accelcost = 2;
        $this->rollcost = 1;
        $this->pivotcost = 1;
	$this->iniativebonus = 60;
         
        $this->addPrimarySystem(new Reactor(4, 13, 0, 0));
        $this->addPrimarySystem(new CnC(4, 9, 0, 0));
        $this->addPrimarySystem(new Scanner(4, 12, 3, 6));
        $this->addPrimarySystem(new Engine(4, 11, 0, 8, 2));
	$this->addPrimarySystem(new Hangar(4, 2));
	$this->addPrimarySystem(new Thruster(3, 13, 0, 4, 3));
	$this->addPrimarySystem(new Thruster(3, 13, 0, 4, 4));
		
        $this->addFrontSystem(new Thruster(3, 7, 0, 3, 1));
        $this->addFrontSystem(new Thruster(3, 7, 0, 3, 1));
        $this->addFrontSystem(new MediumPulse(3, 6, 3, 240, 360));
        $this->addFrontSystem(new LightPulse(2, 4, 2, 270, 90));
        $this->addFrontSystem(new InterceptorMkI(2, 4, 1, 270, 90));
        $this->addFrontSystem(new LightPulse(2, 4, 2, 270, 90));
        $this->addFrontSystem(new MediumPulse(3, 6, 3, 0, 120));
		
        $this->addAftSystem(new Thruster(4, 8, 0, 4, 2));
        $this->addAftSystem(new Thruster(4, 8, 0, 4, 2));
        $this->addAftSystem(new LightPulse(2, 4, 2, 180, 0));
        $this->addAftSystem(new InterceptorMkI(2, 4, 1, 90, 270));
        $this->addAftSystem(new LightPulse(2, 4, 2, 0, 180));
	
        $this->addPrimarySystem(new Structure( 4, 38));
    }

}



?>
