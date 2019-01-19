import {SPECS} from 'battlecode';
import nav from './nav.js';

var Crusader = {};
Crusader.attackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Crusader.moveDirs = [[-3, 0], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [3, 0]];

let end_goals = [];
let temp_goals = [];
let counter = 5;
let mapWidth;
let mapHeight;
Crusader.turn = function turn(_this) {
	if(_this.me.turn === 1) {
		mapWidth = _this.map[0].length;
		mapHeight = _this.map.length;
	}
	let visibleRobotMap = _this.getVisibleRobotMap();
	let friends = visibleRobots.reduce(robot => robot.team === _this.me.team);
	let enemies = visibleRobots.reduce(robot => robot.team !== _this.me.team);
	let attackableEnemies = enemies.reduce(enemy => nav.distSquared([enemy.x, enemy.y], [_this.me.x, _this.me.y]) <= 16);
	
	//make crusaders chase enemies they see
	if(enemies.length>0) {
		temp_goals = enemies.map(enemy => [enemy.x, enemy.y]);
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
		let bfsMap = nav.breadthFirstSearch(temp_goals, map_copy, Crusader.moveDirs, _this);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation - _this.me.x, newLocation - _this.me.y);
		}
	} else if(end_goals.length>0) {
		let bfsMap = nav.breadthFirstSearch(end_goals, map_copy, Crusader.moveDirs, _this);
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
export default Crusader;