import {SPECS} from 'battlecode';
import nav from './nav.js';

var Preacher = {};
Preacher.attackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Preacher.moveDirs = [[-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]];
Preacher.splashDirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]];

let end_goals = [];
let temp_goals = [];
let counter = 5;
let mapWidth;
let mapHeight;
Preacher.turn = function turn(_this) {
	if(_this.me.turn === 1) {
		mapWidth = _this.map[0].length;
		mapHeight = _this.map.length;
	}
	let visibleRobotMap = _this.getVisibleRobotMap();
	let friends = visibleRobots.reduce(robot => robot.team === _this.me.team);
	let enemies = visibleRobots.reduce(robot => robot.team !== _this.me.team);
	if(enemies.length>0) {
		let bestAttackDir = -1;
		let enemiesHarmed = -10000000;
		for(let i = 0; i<Preacher.attackDirs.length; i++) {
			let dir = Preacher.attackDirs[i];
			let new_x = dir[0] + _this.me.x;
			let new_y = dir[1] + _this.me.y;
			if (!_this.map[new_y][new_x]) {
				continue;
			}
			let tempEnemiesHarmed = 0;
			for(let j = 0; j<Preacher.splashDirs; j++) {
				let id = visibleRobotMap[new_y + Preacher.splashDirs[j][1]][new_x + Preacher.splashDirs[j][0]];
				if(id>0) {
					let robot = _this.getRobot(id);
					if(robot.team === _this.me.team) {
						tempEnemiesHarmed -= 2;
					} else {
						tempEnemiesHarmed += 1;
					}
				}
			}
			if(tempEnemiesHarmed>enemiesHarmed) {
				bestAttackDir = dir;
				enemiesHarmed = tempEnemiesHarmed;
			}
		}
		
		return _this.attack(bestAttackDir[0], bestAttackDir[1]);
	}
	//Copy map to be able to edit it.
	let map_copy = [];
	for(let i = 0; i<mapHeight; i++) {
		map_copy.push(_this.map[i].slice());
	}
	//make friends impassable
	friends.forEach(friend => map_copy[friend.y][friend.x] = false);
	
	
	if(temp_goals.length>0) {
		let bfsMap = nav.breadthFirstSearch(temp_goals, map_copy, Preacher.moveDirs, _this);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation - _this.me.x, newLocation - _this.me.y);
		}
	} else if(end_goals.length>0) {
		let bfsMap = nav.breadthFirstSearch(end_goals, map_copy, Preacher.moveDirs, _this);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation - _this.me.x, newLocation - _this.me.y);
		}
	} else {
		counter--;
		if(counter<0) {
			temp_goals.push(nav.closestPassableLocation([Math.floor(Math.random()*mapWidth), Math.floor(Math.random()*mapHeight)], passable_map, _this));
		}
	}
	
}
export default Preacher;