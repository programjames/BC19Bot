import {
	SPECS
} from 'battlecode';

import nav from './nav.js';

var Miner = {};

Miner.moveDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]];
Miner.giveDirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
Miner.aroundDirs = [[-5, 0], [-4, -1], [-4, 0], [-4, 1], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -4], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [-1, 4], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, -4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, -1], [4, 0], [4, 1], [5, 0]];
Miner.preacherAttackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Miner.crusaderAttackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Miner.prophetAttackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];


Miner.myResources = 1;
Miner.areYouUsingResources = 2;

let starting_pos;
let mapHeight;
let mapWidth;
let horizontal_symmetry = true;
//_this is enemy castle locations.
let castle_locations = [];
let depot_goals = [];
let resource_goals = [];
let closeChurch = false;
let askedIDs = [];

let enemy_locations = [];


Miner.turn = function turn(_this, goForKarb, goForFuel) {
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	if (_this.me.turn === 1) {
		// Find initial values, and places to go to.
		mapWidth = _this.karbonite_map[0].length;
		mapHeight = _this.karbonite_map.length;
		
		//add resource and depot locations
		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				if (_this.karbonite_map[y][x]) {
					if(goForKarb){
						resource_goals.push([x, y]);
					}
				} else if (_this.fuel_map[y][x]) {
					if(goForFuel){
						resource_goals.push([x, y]);
					}
				}
				if (visibleRobotMap[y][x] > 0) {
					let r = _this.getRobot(visibleRobotMap[y][x]);
					if (r.unit <= 1) {
						for (let i = 0; i < Miner.giveDirs.length; i++) {
							let new_x = x + Miner.giveDirs[i][0];
							let new_y = y + Miner.giveDirs[i][1];
							if(nav.isOnPassableMap([new_x, new_y], _this.map)) {
								depot_goals.push([new_x, new_y]);
							}
						}
					}
				}
			}
		}
	}
	
	//make a copy of the map to edit it
	let map_copy = [];
	for (let i = 0; i < mapHeight; i++) {
		map_copy.push(_this.map[i].slice());
	}
	let friends = [];
	let enemies = [];
	let myTeam = _this.me.team;
	visibleRobots.forEach(function(robot) {
		if (robot.team === _this.me.team) {
			friends.push(robot);
		} else if (robot.unit > 2 || robot.unit === 0) {
			enemies.push(robot);
		}
	});
	
	// Uh oh! Enemy spotted.
	if (enemies.length > 0) {
		//Run away from enemies
		let enemyLocations = enemies.map(enemy => [enemy.x, enemy.y]);
		enemy_locations.push(...enemyLocations);
		/*for(var i = 0; i<resource_goals.length; i++){
			if(nav.leastDistance(resource_goals[i], enemyLocations)<=89){
				resource_goals.splice(i,1);
				i-=1;
			}
		}*/
		let closestLocation = nav.closestLocation([_this.me.x, _this.me.y], enemyLocations);
		if(nav.distSquared(closestLocation, [_this.me.x, _this.me.y]) <= 89) {
			let bestMoves = nav.runAwayDirs([_this.me.x, _this.me.y], enemyLocations, Miner.moveDirs, _this.map, visibleRobotMap);
			if(bestMoves.length>0) {
				let dir = bestMoves[Math.floor(Math.random()*bestMoves.length)];
				return _this.move(dir[0], dir[1]);
			}
		}
	}
	for(let i = enemy_locations.length - 1; i>=0; i--) {
		if(visibleRobotMap[enemy_locations[i][1]][enemy_locations[i][0]] === 0) {
			enemy_locations.splice(i,1);
		} else {
			for (let j = 0; j<Miner.prophetAttackDirs; j++) {
				let new_x = enemy_locations[i][0] + Miner.prophetAttackDirs[j][0];
				let new_y = enemy_locations[i][1] + Miner.prophetAttackDirs[j][1];
				if(nav.isOnMap([new_x, new_y], mapWidth, mapHeight)) {
					map_copy[new_y][new_x] = false;
					
				}
			}
		}
	}

	// _this is basically if we can mine.
	if ((goForKarb && _this.karbonite_map[_this.me.y][_this.me.x] && _this.me.karbonite < 20) || (goForFuel && _this.fuel_map[_this.me.y][_this.me.x] && _this.me.fuel < 100)) {
		// Now can we (and should we) build a church right by?
		// Is there already a nearby church?
		if (!closeChurch) {
			for (let i = 0; i < Miner.aroundDirs.length; i++) {
				let x = _this.me.x + Miner.aroundDirs[i][0];
				let y = _this.me.y + Miner.aroundDirs[i][1];
				if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight && visibleRobotMap[y][x] > 0) {
					let r = _this.getRobot(visibleRobotMap[y][x])
					if (r.unit <= 1 && r.team === _this.me.team) {
						for (let j = 0; j < Miner.giveDirs.length; j++) {
							let new_x = x + Miner.giveDirs[j][0];
							let new_y = y + Miner.giveDirs[j][1];
							if(nav.isOnPassableMap([new_x, new_y], _this.map)) {
								depot_goals.push([new_x, new_y]);
							}
						}
						closeChurch = true; // Yep found. Now append _this church to our depot goals.
					}
				}
			}
			// Okay, we didn't find any nearby close churches. Let's build one then.
			if (_this.karbonite >= 50 && !closeChurch) {
				for (let i = 0; i < Miner.giveDirs.length; i++) {
					let x = _this.me.x + Miner.giveDirs[i][0];
					let y = _this.me.y + Miner.giveDirs[i][1];
					if (_this.fuel>=200 && _this.karbonite>=50 && x >= 0 && x < mapWidth && y >= 0 && y < mapHeight && _this.map[y][x] && visibleRobotMap[y][x] <= 0 && !_this.karbonite_map[y][x] && !_this.fuel_map[y][x]) {
						return _this.buildUnit(1, Miner.giveDirs[i][0], Miner.giveDirs[i][1]);
					}
				}
			}
		}

		// Well, let's mine.
		return _this.mine();
	} else {
		// We aren't on a mine square.
		let map_copy = [];
		for (let i = 0; i < _this.map.length; i++) {
			map_copy.push(_this.map[i].slice());
		}
		visibleRobots.forEach(friend => map_copy[friend.y][friend.x] = false);
		map_copy[_this.me.y][_this.me.x] = true;
		// Is it in search of resources?
		let path;
		if (!(goForKarb && _this.me.karbonite >= 20) && !(goForFuel && _this.me.fuel >= 100)) {
			// First take out any mines that other pilgrims have taken:
			for (let i = resource_goals.length - 1; i >= 0; i--) {
				if (visibleRobotMap[resource_goals[i][1]][resource_goals[i][0]] > 0 && (resource_goals[i][1] !== _this.me.y || resource_goals[i][0] !== _this.me.x)) {
					let r = _this.getRobot(visibleRobotMap[resource_goals[i][1]][resource_goals[i][0]]);
					if (r.unit == SPECS.PILGRIM && r.team === _this.me.team){
						resource_goals.splice(i, 1);
						continue;
					}
				}
			}
			// Let's get our best path now.
			path = nav.breadthFirstSearch(resource_goals, map_copy, Miner.moveDirs);
		} else { // We want to return our resources to a church/chapel.
			// Let's first see if it is possible to give our stuff, then try to move if it isn't possible.
			for (let i = 0; i < Miner.giveDirs.length; i++) {
				let x = _this.me.x + Miner.giveDirs[i][0];
				let y = _this.me.y + Miner.giveDirs[i][1];
				if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight && visibleRobotMap[y][x] > 0) {
					if (_this.getRobot(visibleRobotMap[y][x]).unit <= 1) {
						if (goForKarb) {
							return _this.give(Miner.giveDirs[i][0], Miner.giveDirs[i][1], _this.me.karbonite, _this.me.fuel);
						} else {
							return _this.give(Miner.giveDirs[i][0], Miner.giveDirs[i][1], _this.me.karbonite, _this.me.fuel);
						}
					}
				}
			}

			// Well that didn't work, so let's just move towards a church/chapel.
			let temp_depot = [];
			for(let i = 0; i<depot_goals.length;i++){
				if(map_copy[depot_goals[i][1]][depot_goals[i][0]]){
					temp_depot.push(depot_goals[i].slice())
				}
			}
			path = nav.breadthFirstSearch(temp_depot, map_copy, Miner.moveDirs);
		}
		let dirs = path[_this.me.y][_this.me.x];
		for (let i = 0; i < dirs.length; i++) {
			if (map_copy[dirs[i][1]][dirs[i][0]]) {
				let dx = dirs[i][0] - _this.me.x;
				let dy = dirs[i][1] - _this.me.y;
				return _this.move(dx, dy);
			}
		}
	}
}
export default Miner