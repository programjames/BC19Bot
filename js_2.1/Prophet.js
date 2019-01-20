import {SPECS} from 'battlecode';
import nav from './nav.js';

var Prophet = {};
Prophet.attackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Prophet.moveDirs = [[-3, 0], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [3, 0]];

let castle_locations = [];
let temp_goals = [];
let mapWidth;
let mapHeight;
let horizontal_symmetry = true;
Prophet.turn = function turn(_this) {
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	if(_this.me.turn === 1) {
		mapWidth = _this.map[0].length;
		mapHeight = _this.map.length;
		
		//determine map symmetry direction
		for (let a = 0; a < mapWidth; a++) {
			let breaked = false;
			for (let b = 0; b < mapHeight; b++) {
				if (_this.map[b][a] !== _this.map[b][mapWidth - 1 - a]) {
					horizontal_symmetry = false;
					breaked = true;
					break;
				}
			}
			if(breaked){
				break;
			}
		}
		
		//determine enemy castle locations
		for(let i = 0; i<visibleRobots.length;i++){
			if(visibleRobots[i].unit === SPECS.CASTLE && nav.distSquared([visibleRobots[i].x, visibleRobots[i].y], [_this.me.x, _this.me.y])<=2 && visibleRobots[i].team === _this.me.team){
				// Push the castle location.
				if(horizontal_symmetry){
					castle_locations.push([mapWidth - 1 - visibleRobots[i].x, visibleRobots[i].y]);
				}
				else{
					castle_locations.push([visibleRobots[i].x, mapHeight - 1 - visibleRobots[i].y]);
				}
				// If the signal is -1, assume that there is no other castle.
				let message = visibleRobots[i].signal;
				if(message!==-1){
					let message1 = message%256;
					let message2 = message>>8;
					
					if(message1!==0){
						let pos1 = nav.unpack(message1, _this.map);
						if(horizontal_symmetry){
							castle_locations.push([mapWidth - 1 - pos1[0],pos1[1]]);
						}
						else {
							castle_locations.push([pos1[0],mapHeight - 1 - pos1[1]]);
						}
					}
					if(message2!==0){
						let pos2 = nav.unpack(message2, _this.map);
						if(horizontal_symmetry){
							castle_locations.push([mapWidth - 1 - pos2[0],pos2[1]]);
						}
						else {
							castle_locations.push([pos2[0],mapHeight - 1 - pos2[1]]);
						}
					}
				}
			}
		}
	}
	
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
	} else {
		//get rid of goals we can see have no enemies
		for(let i = temp_goals.length - 1; i>=0; i--) {
			let loc = temp_goals[i];
			if (nav.distSquared(loc, [_this.me.x, _this.me.y])<=16) {
				temp_goals.splice(i, 1);
			}
		}
		//get rid of castle locations if we can see they are destroyed
		for(let i = castle_locations.length - 1; i>=0; i--) {
			let loc = castle_locations[i];
			if (nav.distSquared(loc, [_this.me.x, _this.me.y])<=16) {
				castle_locations.splice(i, 1);
			}
		}
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
	
	//attack closest enemy in range
	if(attackableEnemies.length>0) {
		let closest = attackableEnemies[0];
		let closestDist = -1;
		for(let i = 0; i<attackableEnemies.length; i++) {
			let d2 = nav.distSquared([_this.me.x, _this.me.y], [attackableEnemies[i].x, attackableEnemies[i].y]);
			if(closestDist === -1 || d2 < closestDist) {
				closest = attackableEnemies[i];
				closestDist = d2;
			}
		}
		return _this.attack(closest.x - _this.me.x, closest.y - _this.me.y);
	}
	
	//Copy map to be able to edit it.
	let map_copy = [];
	for(let i = 0; i<mapHeight; i++) {
		map_copy.push(_this.map[i].slice());
	}
	//make friends impassable
	friends.forEach(friend => map_copy[friend.y][friend.x] = false);
	map_copy[_this.me.y][_this.me.x] = true;
	
	if(temp_goals.length>0) {
		let bfsMap = nav.breadthFirstSearch(temp_goals, map_copy, Prophet.moveDirs);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
		}
	} else if(castle_locations.length>0) {
		let bfsMap = nav.breadthFirstSearch(castle_locations, map_copy, Prophet.moveDirs);
		if(bfsMap[_this.me.y][_this.me.x].length > 0) {
			let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
			return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
		}
	}
	
}
export default Prophet;