import {
	SPECS
} from 'battlecode';

import nav from './nav/';

var Miner = {};

Miner.moveDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]];
Miner.giveDirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
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

Miner.turn = function turn(_this, goForKarb) {
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	if (_this.turn === 1) {
		// Find initial values, and places to go to.
		mapWidth = _this.karbonite_map[0].length;
		mapHeight = _this.karbonite_map.length;
		
		//add resource and depot locations
		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				if (goForKarb && _this.karbonite_map[y][x]) {
					resource_goals.push([x, y]);
				} else if (!goForKarb && _this.fuel_map[y][x]) {
					resource_goals.push([x, y]);
				}
				if (visibleRobotMap[y][x] > 0) {
					let r = _this.getRobot(visibleRobotMap[y][x]);
					if (r.unit <= 1) {
						for (let i = 0; i < Miner.giveDirs.length; i++) {
							let new_x = x + Miner.giveDirs[i][0];
							let new_y = y + Miner.giveDirs[i][1];
							depot_goals.push([new_x, new_y]);
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
		if (robot.team === myTeam) {
			friends.push(robot);
		} else if (robot.unit > 2) {
			enemies.push(robot);
		}
	});
	
	// Uh oh! Enemy spotted.
	if (enemies.length > 0) {
		//Run away from enemies
		let enemyLocations = enemies.map(enemy => [enemy.x, enemy.y]);
		let bestMoves = nav.runAwayDirs([_this.me.x, _this.me.y], enemyLocations, Miner.moveDirs, _this.map, visibleRobotMap);
		if(bestMoves.length>0) {
			let dir = bestMoves[Math.floor(Math.random()*bestMoves.length)];
			return _this.move(dir[0], dir[1]);
		}
	}

	// _this is basically if we can mine.
	if ((goForKarb && _this.karbonite_map[_this.me.y][_this.me.x] && _this.me.karbonite < 20) || (!goForKarb && _this.fuel_map[_this.me.y][_this.me.x] && _this.me.fuel < 100)) {
		// First check if there are nearby pilgrims, and tell them that _this is OUR mine.
		for (let i = 0; i < visibleRobots.length; i++) {
			if (visibleRobots[i].unit == SPECS.PILGRIM && visibleRobots[i].team === _this.me.team && visibleRobots[i].signal == Miner.areYouUsingResources) {
				let d = Math.pow(Math.ceil(Math.sqrt(distSquared([_this.me.x, _this.me.y], [visibleRobots[i].x, visibleRobots[i].y]))),2);
				if (d <= 16) { // If it is relatively cheap to signal.
					_this.signal(Miner.myResources, d);
				}
			}
		}
		// Now can we (and should we) build a church right by?
		// Is there already a nearby church?
		if (!closeChurch) {
			for (let i = 0; i < aroundDirs.length; i++) {
				x = _this.me.x + aroundDirs[i][0];
				y = _this.me.y + aroundDirs[i][1];
				if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight && visibleRobotMap[y][x] > 0) {
					if (_this.getRobot(visibleRobotMap[y][x]).unit <= 1) {
						closeChurch = true; // Yep found. Now append _this church to our depot goals.
						depot_goals.push([x, y]);
						break;
					}
				}
			}
			// Okay, we didn't find any nearby close churches. Let's build one then.
			if (_this.karbonite >= 50 && !closeChurch) {
				for (let i = 0; i < Miner.giveDirs.length; i++) {
					let x = _this.me.x + Miner.giveDirs[i][0];
					let y = _this.me.y + Miner.giveDirs[i][1];
					if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight && _this.map[y][x] && visibleRobotMap[y][x] <= 0 && !_this.karbonite_map[y][x] && !_this.fuel_map[y][x]) {
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
		visibleRobots.forEach(function(friend) {
			if (friend.unit >= 2) {
				map_copy[friend.y][friend.x] = false;
			}
		});
		map_copy[_this.me.y][_this.me.x] = true;
		// Is it in search of resources?
		if ((goForKarb && _this.me.karbonite < 20) || (!goForKarb && _this.me.fuel < 100)) {
			// First take out any mines that other pilgrims have taken:
			for (let i = resource_goals.length - 1; i >= 0; i--) {
				if (visibleRobotMap[resource_goals[i][1]][resource_goals[i][0]] > 0 && (resource_goals[i][1] !== _this.me.y || resource_goals[i][0] !== _this.me.x)) {
					let r = _this.getRobot(visibleRobotMap[resource_goals[i][1]][resource_goals[i][0]]);
					if (r.unit == SPECS.PILGRIM && r.signal === Miner.myResources) {
						askedIDs.push(r.id);
						resource_goals.splice(i, 1);
						continue;
					}
					let alreadyAsked = false;
					for (let j = 0; j < askedIDs.length; j++) {
						if (askedIDs[j] === r.id) {
							alreadyAsked = true;
							break;
						}
					}
					if (!alreadyAsked && r.unit == SPECS.PILGRIM) {
						let d = Math.pow(Math.ceil(Math.sqrt(distSquared([r.x, r.y], [_this.me.x, _this.me.y]))), 2);
						if (d <= 16) {
							_this.signal(Miner.areYouUsingResources, d);
						}
					}
				}
			}
			// Let's get our best path now.
			//resource_goals.forEach(g => map_copy[g[1]][g[0]] = true);
			//map_copy[_this.me.y][_this.me.x] = true;
			path = breadthFirstSearch(resource_goals, map_copy, moveDirs, _this);
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
			path = breadthFirstSearch(depot_goals, map_copy, moveDirs, _this);
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