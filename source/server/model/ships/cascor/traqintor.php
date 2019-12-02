<?php
class Traqintor extends SmallStarBaseFourSections{

	function __construct($id, $userid, $name,  $slot){
		parent::__construct($id, $userid, $name,  $slot);

		$this->pointCost = 2500;
		$this->base = true;
		$this->smallBase = true;
		$this->faction = "Cascor";
		$this->phpclass = "Traqintor";
		$this->shipClass = "Traqintor Waystation";
		$this->imagePath = "img/ships/orion.png";
		$this->fighters = array("normal"=>48); 
		$this->isd = 2219;

		$this->shipSizeClass = 3; 
		$this->iniativebonus = -200; //no voluntary movement anyway
		$this->turncost = 0;
		$this->turndelaycost = 0;

		$this->forwardDefense = 20;
		$this->sideDefense = 20;


		$this->canvasSize = 280; 

		$this->addFrontSystem(new Structure( 4, 120));
		$this->addAftSystem(new Structure( 4, 120));
		$this->addLeftSystem(new Structure( 4, 120));
		$this->addRightSystem(new Structure( 4, 120));
		$this->addPrimarySystem(new Structure( 5, 120));
		
		$this->hitChart = array(			
			0=> array(
				11 => "Structure",
				13 => "Ion Torpedo",
				14 => "Hangar",
				16 => "Scanner",
				18 => "Reactor",
				20 => "C&C",
			),
			1=> array(
				2 => "Ion Torpedo",
				4 => "Ion Cannon",
				6 => "Dual Ion Bolter",
				8 => "Cargo Bay",
			    9 => "Reactor",
			    10 => "Hangar",
				18 => "Structure",
				20 => "Primary",
			),
			2=> array(
			    2 => "Ion Torpedo",
			    4 => "Ion Cannon",
			    6 => "Dual Ion Bolter",
			    8 => "Cargo Bay",
			    9 => "Reactor",
			    10 => "Hangar",
			    18 => "Structure",
			    20 => "Primary",
			),	
			3=> array(
			    2 => "Ion Torpedo",
			    4 => "Ion Cannon",
			    6 => "Dual Ion Bolter",
			    8 => "Cargo Bay",
			    9 => "Reactor",
			    10 => "Hangar",
			    18 => "Structure",
			    20 => "Primary",
			),
			4=> array(
			    2 => "Ion Torpedo",
			    4 => "Ion Cannon",
			    6 => "Dual Ion Bolter",
			    8 => "Cargo Bay",
			    9 => "Reactor",
			    10 => "Hangar",
			    18 => "Structure",
			    20 => "Primary",
			),
		);


		$this->addPrimarySystem(new Reactor(5, 26, 0, 0));
		$this->addPrimarySystem(new CnC(6, 40, 0, 0)); //originally 2 systems with sructure 20, armor 5 each
		$this->addPrimarySystem(new Scanner(5, 18, 5, 7));
		$this->addPrimarySystem(new Scanner(5, 18, 5, 7));
		$this->addPrimarySystem(new Hangar(5, 4));
		$this->addPrimarySystem(new IonTorpedo(5, 5, 4, 0, 360));
		$this->addPrimarySystem(new IonTorpedo(5, 5, 4, 0, 360));
		
		$this->addFrontSystem(new Hangar(4, 6));
		$this->addFrontSystem(new Hangar(4, 6));
		$this->addFrontSystem(new CargoBay(4, 25));
		$this->addFrontSystem(new Reactor(4, 20, 0, 0));
		$this->addFrontSystem(new Reactor(5, 11, 0, 0));
		$this->addFrontSystem(new DualIonBolter(5, 4, 4, 270, 360));
		$this->addFrontSystem(new DualIonBolter(5, 4, 4, 270, 360));
		$this->addFrontSystem(new IonTorpedo(4, 5, 4, 300, 60));
		$this->addFrontSystem(new DualIonBolter(4, 4, 4, 300, 60));
		$this->addFrontSystem(new IonTorpedo(4, 5, 4, 300, 60));
		$this->addFrontSystem(new IonCannon(4, 6, 4, 300, 60));
		$this->addFrontSystem(new IonCannon(4, 6, 4, 300, 60));
		
		$this->addAftSystem(new Hangar(4, 6));
		$this->addAftSystem(new Hangar(4, 6));
		$this->addAftSystem(new CargoBay(4, 25));
		$this->addAftSystem(new Reactor(4, 20, 0, 0));
		$this->addAftSystem(new Reactor(5, 11, 0, 0));
		$this->addAftSystem(new DualIonBolter(5, 4, 4, 90, 180));
		$this->addAftSystem(new DualIonBolter(5, 4, 4, 90, 180));
		$this->addAftSystem(new IonTorpedo(4, 5, 4, 120, 240));
		$this->addAftSystem(new DualIonBolter(4, 4, 4, 120, 240));
		$this->addAftSystem(new IonTorpedo(4, 5, 4, 120, 240));
		$this->addAftSystem(new IonCannon(4, 6, 4, 120, 240));
		$this->addAftSystem(new IonCannon(4, 6, 4, 120, 240));
		
		$this->addRightSystem(new Hangar(4, 6));
		$this->addRightSystem(new Hangar(4, 6));
		$this->addRightSystem(new CargoBay(4, 25));
		$this->addRightSystem(new Reactor(4, 20, 0, 0));
		$this->addRightSystem(new Reactor(5, 11, 0, 0));
		$this->addRightSystem(new DualIonBolter(5, 4, 4, 0, 90));
		$this->addRightSystem(new DualIonBolter(5, 4, 4, 0, 90));
		$this->addRightSystem(new IonTorpedo(4, 5, 4, 60, 120));
		$this->addRightSystem(new DualIonBolter(4, 4, 4, 60, 120));
		$this->addRightSystem(new IonTorpedo(4, 5, 4, 60, 120));
		$this->addRightSystem(new IonCannon(4, 6, 4, 60, 120));
		$this->addRightSystem(new IonCannon(4, 6, 4, 60, 120));
		
		$this->addLeftSystem(new Hangar(4, 6));
		$this->addLeftSystem(new Hangar(4, 6));
		$this->addLeftSystem(new CargoBay(4, 25));
		$this->addLeftSystem(new Reactor(4, 20, 0, 0));
		$this->addLeftSystem(new Reactor(5, 11, 0, 0));
		$this->addLeftSystem(new DualIonBolter(5, 4, 4, 180, 270));
		$this->addLeftSystem(new DualIonBolter(5, 4, 4, 180, 270));
		$this->addLeftSystem(new IonTorpedo(4, 5, 4, 240, 300));
		$this->addLeftSystem(new DualIonBolter(4, 4, 4, 240, 300));
		$this->addLeftSystem(new IonTorpedo(4, 5, 4, 240, 300));
		$this->addLeftSystem(new IonCannon(4, 6, 4, 240, 300));
		$this->addLeftSystem(new IonCannon(4, 6, 4, 240, 300));	
		}
    }
?>