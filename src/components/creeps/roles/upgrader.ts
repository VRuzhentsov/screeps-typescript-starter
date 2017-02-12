import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function run(creep: Creep): void {
  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
  let controller = creep.room.controller;
  let energySource = creep.room.find<Source>(FIND_SOURCES_ACTIVE)[0];

  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, spawn);
  } else if (controller.progressTotal === 0) {
    console.log(controller.progressTotal);
    _moveToUpgdadeController(creep);
  } else if (controller.progressTotal > 0 && _.sum(creep.carry) === creep.carryCapacity) {
    console.log(controller.progressTotal);
    console.log(_.sum(creep.carry));
    console.log( creep.carryCapacity);
    _moveToTransfer(creep, controller);
    // creep.moveTo(creep.room.controller);
  } else {
    _moveToHarvest(creep, energySource);
  }
}

function _tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void {
  if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

function _moveToUpgdadeController(creep: Creep): void {
  if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, creep.room.controller);
  }
}

function _moveToTransfer(creep: Creep, target: StructureController): void {
  if (creep.transfer(target, RESOURCE_ENERGY, _.sum(creep.carry)) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target);
  }
}
