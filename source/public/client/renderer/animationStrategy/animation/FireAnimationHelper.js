window.FireAnimationHelper = {

    getShipPositionForFiring: function(icon, time, movementAnimations, weapon, turn) {
        if (weapon.ballistic) {
            console.log("get ballistic firing position");
            console.log(turn, icon.getFirstMovementOnTurn(turn));
            return window.coordinateConverter.fromHexToGame(icon.getFirstMovementOnTurn(turn).position);
        }

        return FireAnimationHelper.getShipPositionAtTime(icon, time, movementAnimations);
    },

    getShipPositionAtTime: function(icon, time, movementAnimations) {

        var animation = movementAnimations[icon.shipId];

        var data = animation.getPositionAndFacingAtTime(time);
        return data.position;
    }

};