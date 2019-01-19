import {
	SPECS
} from 'battlecode';

import nav from './nav/';

var Scout = {};

Scout.moveDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]];
Scout.starting_pos;
var mapHeight;
var mapWidth;
var horizontal_symmetry = true;
//This is enemy castle locations.
var castle_locations = [];

Scout.turn = function turn(_this){
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	// First turn stuff.
	if(_this.me.turn === 1){
		mapHeight = _this.map.length;
		mapWidth = _this.map[0].length;
		Scout.starting_pos = [_this.me.x, _this.me.y];
		for (let a = 0; a < mapWidth; a++) {
			var breaked = false;
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
			if(visibleRobots[i].unit === SPECS.CASTLE && visibleRobots[i].team === _this.me.team){
				// Push the castle location.
				if(horizontal_symmetry){
					castle_locations.push([mapWidth - 1 - visibleRobots[i].x, visibleRobots[i].y]);
				}
				else{
					castle_locations.push([visibleRobots[i].x, mapHeight - 1 - visibleRobots[i].y]);
				}
				// If the castle talk is -1, assume that there is no other castle.
				var message = visibleRobots[i].signal;
				if(message!==-1){
					let message1 = message%256;
					let message2 = message>>8;
					let pos1 = nav.unpack(message1);
					let pos2 = nav.unpack(message2);
					
					if(horizontal_symmetry){
						if(x1!== 0 &&)
						castle_locations.push([mapWidth - 1 - pos1[0],pos1[1]]);
						castle_locations.push([mapWidth - 1 - pos2[0],pos2[1]]);
					}
					else {
						castle_locations.push([pos1[0],mapHeight - 1 - pos1[1]]);
						castle_locations.push([pos2[0],mapHeight - 1 - pos2[1]]);
					}
				}
				
			}
		}
	}
	// End of first turn stuff.
	
	// Now to tell the home base what enemies we see.
	let enemies = visibleRobots.filter(robot => robot.team !== _this.me.team);
	let enemy_pilgrims = enemies.filter(robot => robot.unit === SPECS.PILGRIM);
	let enemy_crusaders = enemies.filter(robot => robot.unit === SPECS.CRUSADER);
	let enemy_prophets = enemies.filter(robot => robot.unit === SPECS.PROPHET);
	let enemy_preachers = enemies.filter(robot => robot.unit === SPECS.PREACHER);
	let enemy_castles = enemies.filter(robot => robot.unit === SPECS.CASTLE);
	let castleSend = (Math.min(enemy_pilgrims.length,4)<<6)+(Math.min(enemy_crusaders.length,4)<<4)+(Math.min(enemy_prophets.length,4)<<2)+Math.min(enemy_preachers.length,4);
	// End messaging to home.
	// Kite in a circle around enemies.
	let enemy_locations = [];
	enemy_crusaders.forEach(robot => enemy_locations.push([robot.x, robot.y]));
	enemy_prophets.forEach(robot => enemy_locations.push([robot.x, robot.y]));
	enemy_preachers.forEach(robot => enemy_locations.push([robot.x, robot.y]));
	enemy_castles.forEach(robot => enemy_locations.push([robot.x, robot.y]));
	if(enemy_locations.length > 0){
		let closest = nav.closestLocation([_this.me.x,_this.me.y], enemy_locations);
		let dist = Math.sqrt(nav.distSquared([_this.me.x,_this.me.y], closest));
		if(dist <= 8){
			let maxDir = [0,0];
			let maxD = nav.distSqured([_this.me.x, _this.me.y], closest);
			for(let i=0; i<Scout.moveDirs.length; i++){
				let x = Scout.moveDirs[i][0]+_this.me.x;
				let y = Scout.moveDirs[i][1]+_this.me.y;
				if(x>=0 && y>=0 && x<mapWidth && y<mapHeight && _this.map[y][x] && visibleRobotMap[y][x]<=0){
					let d = nav.distSquared([x, y], closest);
					if(d>maxD){
						maxD = d;
						maxDir = Scout.moveDirs[i];
					}
				}
			}
			if(maxDir[0]!== 0 || maxDir[1]!== 0){
				return _this.move(maxDir[0], maxDir[1]);
			}
			
		}
		else{
			// Circle around enemy;
			let dx = Math.round(1.49*(closest[1] - _this.me.y)/dist);
			let dy = Math.round(1.49*(_this.me.x - closest[0])/dist);
			let x = _this.me.x + dx;
			let y = _this.me.y + dy;
			if(_this.map[y][x] && visibleRobotMap[y][x]<=0){
				return _this.move(dx, dy);
			}
			let x = _this.me.x - dx;
			let y = _this.me.y - dy;
			if(_this.map[y][x] && visibleRobotMap[y][x]<=0){
				return _this.move(-dx, -dy);
			}
		}
	} else {
		// Now move towards their castle. Stay at least r^2 = 65 away from any enemy unit!

		let map_copy = [];
		for(let i=0; i<_this.map;i++){
			map_copy.push(_this.map[i].slice());
		}
		visibleRobots.forEach(robot => map_copy[robot.y][robot.x] = false);
		castle_locations.forEach(loc => map_copy[loc[1]][loc[0]] = true);
		map_copy[_this.me.y][_this.me.x] = true;
		let pathmap = nav.breadthFirstSearch(castle_locations, map_copy, Scout.moveDirs, _this);
		let dirs = pathmap[_this.me.y][_this.me.x];
		for(let i = 0; i<dirs.length;i++){
			let x = _this.me.x + dirs[0];
			let y = _this.me.y + dirs[1];
			if(nav.isOpen(x,y,_this.map,visibleRobotMap)){
				return _this.move(dirs[0],dirs[1]);
			}
		}
	}
}

export default Scout