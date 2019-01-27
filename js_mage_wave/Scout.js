import {
	SPECS
} from 'battlecode';

import nav from './nav.js';

var Scout = {};

Scout.moveDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]];
Scout.starting_pos;
var mapHeight;
var mapWidth;
var horizontal_symmetry = true;
//This is enemy castle locations.
var castle_locations = [];
// kiting in a circle
var kiting_dir = 1;

Scout.turn = function turn(_this){
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	// First turn stuff.
	if(_this.me.turn === 1){
		mapHeight = _this.map.length;
		mapWidth = _this.map[0].length;
		Scout.starting_pos = [_this.me.x, _this.me.y];
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
		for(let i = 0; i<visibleRobots.length;i++){
			if(visibleRobots[i].unit === SPECS.CASTLE && visibleRobots[i].team === _this.me.team && nav.distSquared([_this.me.x, _this.me.y], [visibleRobots[i].x, visibleRobots[i].y])<=2){
				// Push the castle location.
				if(horizontal_symmetry){
					castle_locations.push([mapWidth - 1 - visibleRobots[i].x, visibleRobots[i].y]);
				}
				else{
					castle_locations.push([visibleRobots[i].x, mapHeight - 1 - visibleRobots[i].y]);
				}
				// If the castle talk is -1, assume that there is no other castle.
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
	// End of first turn stuff.
	
		// Now to tell the home base what enemies we see.
	let enemies = visibleRobots.filter(robot => robot.team !== _this.me.team);
	let dangerous_enemies = enemies.filter(enemy => enemy.unit >= 3 || enemy.unit === 0);
	if(dangerous_enemies.length>0){
		let dangerous_enemy_locations = dangerous_enemies.map(enemy => [enemy.x, enemy.y]);
		let bitMessage = nav.pack(nav.closestLocation([_this.me.x, _this.me.y], dangerous_enemy_locations));
		_this.castleTalk(bitMessage);
		// End messaging to home.
	}
	// Move around any enemies (or run away if they are too close).
	let enemy_locations = [];
	enemies.forEach(robot => enemy_locations.push([robot.x, robot.y]));
	if(enemy_locations.length > 0){
		let closest = nav.closestLocation([_this.me.x,_this.me.y], enemy_locations);
		let dist = Math.sqrt(nav.distSquared([_this.me.x,_this.me.y], closest));
		if(dist <= 8){
			// Run away! This is a bugnav runaway:
			let moves = nav.runAwayDirs([_this.me.x, _this.me.y], enemy_locations, Scout.moveDirs, _this.map, visibleRobotMap);
			if(moves.length > 0){
				let r = Math.floor(Math.random()*moves.length);
				return _this.move(moves[r][0], moves[r][1]);
			}
		}
		else{
			// Circle around enemy;
			let dx = Math.round(1.49*(closest[1] - _this.me.y)/dist);
			let dy = Math.round(1.49*(_this.me.x - closest[0])/dist);
			let x = _this.me.x + kiting_dir*dx;
			let y = _this.me.y + kiting_dir*dy;
			if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
				return _this.move(kiting_dir*dx, kiting_dir*dy);
			}
			else{
				kiting_dir*=-1;
				x = _this.me.x +kiting_dir*dx;
				y = _this.me.y + kiting_dir*dy;
				if(nav.isOpen([x,y],_this.map, visibleRobotMap)){
					return _this.move(kiting_dir*dx, kiting_dir*dy);
				}
			}
		}
	} else {
		// Now move towards their castle. Stay at least r^2 = 65 away from any enemy unit!

		let map_copy = [];
		for(let i=0; i<mapHeight;i++){
			map_copy.push(_this.map[i].slice());
		}
		visibleRobots.forEach(robot => map_copy[robot.y][robot.x] = false);
		castle_locations.forEach(loc => map_copy[loc[1]][loc[0]] = true);
		map_copy[_this.me.y][_this.me.x] = true;
		let pathmap = nav.breadthFirstSearch(castle_locations, map_copy, Scout.moveDirs);
		let dirs = pathmap[_this.me.y][_this.me.x];
		for(let i = 0; i<dirs.length;i++){
			let x = dirs[i][0];
			let y = dirs[i][1];
			if(nav.isOpen([x, y],_this.map,visibleRobotMap)){
				return _this.move(x - _this.me.x, y - _this.me.y);
			}
		}
	}
}

export default Scout