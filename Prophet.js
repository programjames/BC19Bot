import {SPECS} from 'battlecode';
import nav from './nav.js';

var Prophet = {};
Prophet.attackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Prophet.moveDirs = [[-3, 0], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [3, 0]];

let end_goals = [];
let temp_goals = [];
let mapWidth;
let mapHeight;
Prophet.turn = function turn(_this) {
	if(_this.me.turn === 1) {
		mapWidth = _this.map[0].length;
		mapHeight = _this.map.length;
	}
	let visibleRobotMap = _this.getVisibleRobotMap();
	let friends = visibleRobots.filter(robot => robot.team === _this.me.team);
	let enemies = visibleRobots.filter(robot => robot.team !== _this.me.team);
	//enemies it can attack
	let attackableEnemies = enemies.filter(function _(enemy) {
		let d2 = nav.distSquared([enemy.x, enemy.y], [_this.me.x, _this.me.y]);
		return (d2 <= 64 && d2 >= 16);
	});
	let closeEnemies = enemies.filter(enemy => nav.distSquared([enemy.x, enemy.y], [_this.me.x, _this.me.y]) <= 26);
	
	//make Prophets chase enemies they see
	if(enemies.length>0) {
		temp_goals = enemies.map(enemy => [enemy.x, enemy.y]);
	}
	//run away from close enemies
	if(closeEnemies.length > 0) {
		let closeEnemyLocations = closeEnemies.map(enemy => [enemy.x, enemy.y]);
		let bestMoves = nav.runAwayDirs([_this.me.x, _this.me.y], closeEnemyLocations, Prophet.moveDirs, _this.map, visibleRobotMap);
		if(bestMoves.length>0) {
			let dir = bestMoves[Math.floor(Math.random()*bestMoves.length)];
			return _this.move(dir[0], dir[1]);
		}
	}
	
	//attack weakest enemy in range
	if(attackableEnemies.length>0) {
		let weakest = attackableEnemies[0];
		for(let i = 0; i<attackableEnemies.length; i++) {
			if(attackableEnemies[i].health < weakest.health) {
				weakest = attackableEnemies[i];
			}
		}
		return _this.attack(weakest.x - _this.me.x, weakest.y - _this.me.y);
	}
	
	//Copy map to be able to edit it.
	let map_copy = [];
	for(let i = 0; i<mapHeight; i++) {
		map_copy.push(_this.map[i].slice());
	}
	//make friends impassable
	friends.forEach(friend => map_copy[friend.y][friend.x] = false);
	
	if(temp_goals.length>0) {
		let bfsMap = nav.breadthFirstSearch(temp_goals, map_copy, Prophet.moveDirs, _this);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation - _this.me.x, newLocation - _this.me.y);
		}
	} else if(end_goals.length>0) {
		let bfsMap = nav.breadthFirstSearch(end_goals, map_copy, Prophet.moveDirs, _this);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation - _this.me.x, newLocation - _this.me.y);
		}
	}
	
}
export default Prophet;