<?php

class WeaponLoading
{
    public $systemid, $subsystem, $gameid, $shipid, $loading, $extrashots, $loadedammo, $overloading;
    
    public function __construct($systemid, $subsystem, $gameid, $shipid, $loading, $extrashots, $loadedammo, $overloading)
    {
        $this->systemid = $systemid;
        $this->subsystem = $subsystem;
        $this->gameid = $gameid;
        $this->shipid = $shipid;
        $this->loading = $loading;
        $this->extrashots = $extrashots;
        $this->loadedammo = $loadedammo;
        $this->overloading = $overloading;
    }
}

class TacticalPlayer{
    public $id, $slot, $team, $lastturn, $lastphase, $name;
    
    function __construct($id, $slot, $team, $lastturn, $lastphase, $name){
        $this->id = $id;
        $this->team = $team;
        $this->lastturn = $lastturn;
        $this->lastphase = $lastphase;
        $this->name = $name;
        $this->slot = $slot;
    }
}

class MovementOrder{

    public $id, $type, $x, $y, $xOffset, $yOffset, $facing, $heading, $speed, $value;
    public $animating = false;
    public $animated = true;
    public $animationtics = 0;
    public $preturn;
    public $requiredThrust = array(0, 0, 0, 0, 0); //0:any, 1:front, 2:rear, 3:left, 4:right;
    public $assignedThrust = array();
    public $commit = true;
    public $turn;
    public $forced = false;
    
    
    function __construct($id, $type, $x, $y, $xOffset, $yOffset, $speed, $heading, $facing, $pre, $turn, $value){
        $this->id = (int)$id;
        $this->x = (int)$x;
        $this->y = (int)$y;
        $this->type = $type;
        $this->facing = (int)$facing;
        $this->heading = (int)$heading;
        $this->speed = (int)$speed;
        $this->preturn = $pre;
        $this->turn = (int)$turn;
        $this->xOffset = $xOffset;
        $this->yOffset = $yOffset;
        $this->value = $value;
        

    }
    
    public function getReqThrustJSON(){
        return json_encode($this->requiredThrust);
        
    }
    
    public function getAssThrustJSON(){
        return json_encode($this->assignedThrust);
        
    }
    
    public function setReqThrustJSON($json){
        $this->requiredThrust = json_decode($json, true);
    }
    
    public function setAssThrustJSON($json){
        $this->assignedThrust = json_decode($json, true);
    }
    
    public function getCoPos(){
        return mathlib::hexCoToPixel($this->x, $this->y);
    }
    
    public function getFacingAngle(){
    
        $d = $this->facing;
        if ($d == 0){
            return 0;
        }
        if ($d == 1){
            return 60;
        }
        if ($d == 2){
            return 120;
        }
        if ($d == 3){
            return 180;
        }
        if ($d == 4){
            return 240;
        }
        if ($d == 5){
            return 300;
        }
        
        return 0;
    }

}


class DamageEntry{

    public $id, $shipid, $gameid, $turn, $systemid, $damage, $armour, $shields, $fireorderid, $destroyed;
    public $pubnotes = "";
    public $updated = false;
    
    function __construct($id, $shipid, $gameid, $turn, $systemid, $damage, $armour, $shields, $fireorderid, $destroyed, $pubnotes){
        $this->id = $id;
        $this->shipid = $shipid;
        $this->gameid = $gameid;
        $this->turn = $turn;
        $this->systemid = $systemid;
        $this->damage = $damage;
        $this->armour = $armour;
        $this->shields = $shields;
        $this->fireorderid = $fireorderid;
        $this->destroyed = $destroyed;
        $this->pubnotes = $pubnotes;
    }

}

class EWentry{
    
    public $id, $shipid, $turn, $type, $amount, $targetid;
    
    function __construct($id, $shipid, $turn, $type, $amount, $targetid){
         $this->id = $id;
         $this->shipid = $shipid;
         $this->turn = $turn;
         $this->type = $type;
         $this->amount = $amount;
         $this->targetid = $targetid;
    }
}

class FireOrder{
    
    public $id, $type, $shooterid, $targetid, $calledid, $weaponid, $turn, $firingMode, $needed, $rolled, $shots, $shotshit, $intercepted, $x, $y;
    public $notes = "";
    public $pubnotes = "";
    public $updated = false;
    public $addToDB = false;
    
    function __construct($id,  $type, $shooterid, $targetid, $weaponid, $calledid, $turn, $firingmode, $needed = 0, $rolled = 0, $shots = 1, $shotshit = 0, $intercepted = 0, $x, $y){
         $this->id = $id;
         $this->type = $type;
         $this->shooterid = $shooterid;
         $this->targetid = $targetid;
         $this->weaponid = $weaponid;
         $this->calledid = $calledid;
         $this->turn = $turn;
         $this->firingMode = $firingmode;
         $this->needed = $needed;
         $this->rolled = $rolled;
         $this->shots = $shots;
         $this->shotshit = $shotshit;
         $this->intercepted = $intercepted;
         $this->x = $x;
         $this->y = $y;
    }

}



class PowerManagementEntry{
    
    public $id, $shipid, $systemid, $type, $turn, $amount;
    public $updated = false;
    
    //types: 1:offline 2:boost, 3:overload
    
    function __construct($id, $shipid, $systemid, $type, $turn, $amount){
        $this->id = (int)$id;
        $this->shipid = (int)$shipid;
        $this->systemid = (int)$systemid;
        $this->type = (int)$type;
        $this->turn = (int)$turn;
        $this->amount = (int)$amount;

    }

}


class Ballistic{
    public $fireOrderId, $position, $id, $facing, $targetpos, $targetid, $shooterid, $weaponid, $shots;
        
    function __construct($id, $fireid, $position, $facing, $targetpos, $targetid, $shooterid, $weaponid, $shots){
        $this->id = (int)$id;
        $this->fireOrderId = (int)$fireid;
        $this->facing = (int)$facing;
        $this->targetid = (int)$targetid;
        $this->shooterid = (int)$shooterid;
        $this->weaponid = (int)$weaponid;
        $this->position = $position;
        $this->targetposition = $targetpos;
        $this->shots = $shots;
        
   }

}



?>
