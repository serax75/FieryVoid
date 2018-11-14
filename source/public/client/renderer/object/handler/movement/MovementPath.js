class MovementPath {
  constructor(ship, movementService, scene) {
    this.ship = ship;
    this.movementService = movementService;
    this.scene = scene;

    this.objects = [];

    this.create();
  }

  remove() {
    this.objects.forEach(object3d => {
      this.scene.remove(object3d.mesh);
      object3d.destroy();
    });
  }

  create() {
    const firstMovement = this.movementService.getPreviousTurnLastMove(
      this.ship
    );

    const lastMovement =
      this.moved && this.movementService.getMostRecentMove(this.ship);

    const line = createMovementLine(firstMovement);
    this.scene.add(line.mesh);
    this.objects.push(line);
  }
}

const createMovementLine = move =>
  new window.LineSprite(
    window.coordinateConverter.fromHexToGame(move.position),
    window.coordinateConverter.fromHexToGame(move.position.add(move.target)),
    10,
    new THREE.Color(0, 0, 1),
    0.5
  );

export { createMovementLine };

export default MovementPath;
