import { movementTypes } from ".";

class MovementOrder {
  constructor(
    id,
    type,
    position,
    target,
    facing,
    turn,
    value = 0,
    requiredThrust = null,
    assignedThrust = null
  ) {
    if (!(position instanceof window.hexagon.Offset)) {
      throw new Error("MovementOrder requires position as offset hexagon");
    }

    this.id = id;
    this.type = type;
    this.position = position;
    this.target = target;
    this.facing = facing;
    this.turn = turn;
    this.value = value;
    this.requiredThrust = requiredThrust;
    this.assignedThrust = assignedThrust;
  }

  isDeploy() {
    return this.type === movementTypes.DEPLOY;
  }

  isStart() {
    return this.type === movementTypes.START;
  }

  isEvade() {
    return this.type === movementTypes.EVADE;
  }

  isEnd() {
    return this.type === movementTypes.END;
  }

  clone() {
    return new MovementOrder(
      this.id,
      this.type,
      this.position,
      this.target,
      this.facing,
      this.turn,
      this.value,
      this.requiredThrust,
      this.assignedThrust
    );
  }
}

window.MovementOrder = MovementOrder;
export default MovementOrder;
