import {SPECS} from 'battlecode';
import nav from './nav.js';

var Preacher = {};
Preacher.attackDirs = [[-4, 0], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [0, -4], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [4, 0]];
Preacher.moveDirs = [[-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]];
Preacher.splashDirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]];
Preacher.buildDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];

let castle_locations = [];
let temp_goals = [];
let mapWidth;
let mapHeight;
let horizontal_symmetry = true;
let inWave = false;

let lattice_map = [];
let lattice_goals = [];
let SEND_WAVE = 255;

Preacher.turn = function turn(_this) {
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	if(_this.me.turn === 1) {
		mapWidth = _this.map[0].length;
		mapHeight = _this.map.length;
		//add impassable/passable to lattice map
		_this.map.forEach(row => lattice_map.push(row.slice()));
		
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
			if(visibleRobots[i].unit === SPECS.CASTLE && visibleRobots[i].team === _this.me.team){
				//take out nearby castle
				for(let j = 0; j<Preacher.buildDirs.length; j++) {
					let loc = Preacher.buildDirs[j];
					let x = visibleRobots[i].x + loc[0];
					let y = visibleRobots[i].y + loc[1];
					lattice_map[y][x] = false;
				}
				// Push the castle location.
				if(horizontal_symmetry){
					castle_locations.push([mapWidth - 1 - visibleRobots[i].x, visibleRobots[i].y]);
				}
				else{
					castle_locations.push([visibleRobots[i].x, mapHeight - 1 - visibleRobots[i].y]);
				}
			}
		}
		// see if we need to attack something.
		for(let i = 0; i< Preacher.buildDirs.length; i++){
			let x = _this.me.x + Preacher.buildDirs[i][0];
			let y = _this.me.y + Preacher.buildDirs[i][1];
			if(!nav.isOnMap([x,y], mapWidth, mapHeight)){
				continue;
			}
			if(visibleRobotMap[y][x]>0){
				let r = _this.getRobot(visibleRobotMap[y][x]);
				if(r.unit <= 1){
					let message = r.signal;
					if(message>=0){
						let pos = [(message>>6)%64, message%64];
						temp_goals.push(pos);
					}
				}
			}
		}
		
		//take out some values from lattice map
		for(let x = 0; x<mapWidth; x++) {
			for(let y = 0; y<mapHeight; y++) {
				if (((x%2)+(y%2)) === 0 || _this.fuel_map[y][x] || _this.karbonite_map[y][x]) {
					lattice_map[y][x] = false;
				}
			}
		}
		
	}
	//end first turn stuff
	
	// Check if we are getting a signal to rush at the enemy!
	if(_this.me.turn>1){
		for(let i = 0; i<visibleRobots.length; i++){
			if(visibleRobots[i].id === _this.me.id){
				continue
			}
			let v = _this.isVisible(visibleRobots[i])
			if(((v && visibleRobots[i].unit === SPECS.CASTLE) || !v) && visibleRobots[i].signal !==-1){
				if(horizontal_symmetry){
					castle_locations.push([mapWidth - 1 - visibleRobots[i].x, visibleRobots[i].y]);
				}
				else{
					castle_locations.push([visibleRobots[i].x, mapHeight - 1 - visibleRobots[i].y]);
				}
				let message = visibleRobots[i].signal;
				if(message!==-1){
					inWave = true;
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
	if(enemies.length>0) {
		let bestAttackDir = -1;
		let enemiesHarmed = -10000000;
		for(let i = 0; i<Preacher.attackDirs.length; i++) {
			let dir = Preacher.attackDirs[i];
			let new_x = dir[0] + _this.me.x;
			let new_y = dir[1] + _this.me.y;
			if(!nav.isOnMap([new_x,new_y], mapWidth, mapHeight)) {
				continue;
			}
			if (!_this.map[new_y][new_x]) {
				continue;
			}
			let tempEnemiesHarmed = 0;
			for(let j = 0; j<Preacher.splashDirs.length; j++) {
				let np_x = new_x + Preacher.splashDirs[j][0];
				let np_y = new_y + Preacher.splashDirs[j][1];
				if(np_x<0 || np_y<0 || np_x>=mapWidth || np_y>=mapHeight){
					continue;
				}
				let id = visibleRobotMap[np_y][np_x];
				if(id>0) {
					let robot = _this.getRobot(id);
					if(robot.team === _this.me.team) {
						tempEnemiesHarmed -= 1;
					} else {
						tempEnemiesHarmed += 2;
					}
				}
			}
			if(tempEnemiesHarmed>enemiesHarmed) {
				bestAttackDir = dir;
				enemiesHarmed = tempEnemiesHarmed;
			}
		}
		
		return _this.attack(bestAttackDir[0], bestAttackDir[1]);
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
	if(inWave){
		//Copy map to be able to edit it.
		let map_copy = [];
		for(let i = 0; i<mapHeight; i++) {
			map_copy.push(_this.map[i].slice());
		}
		//make friends impassable
		friends.forEach(friend => map_copy[friend.y][friend.x] = false);
		map_copy[_this.me.y][_this.me.x] = true;
		
		if(temp_goals.length>0) {
			let bfsMap = nav.breadthFirstSearch(temp_goals, map_copy, Preacher.moveDirs);
			if(bfsMap[_this.me.y][_this.me.x].length > 0) {
				let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
				return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
			}
		} else if(castle_locations.length>0) {
			let bfsMap = nav.breadthFirstSearch(castle_locations, map_copy, Preacher.moveDirs);
			if(bfsMap[_this.me.y][_this.me.x].length > 0) {
				let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
				return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
			}
		}
	}
	else{
		//Copy map to be able to edit it.
		if(_this.me.health<60){
			_this.castleTalk(SEND_WAVE);
		}
		let map_copy = [];
		for(let i = 0; i<mapHeight; i++) {
			map_copy.push(_this.map[i].slice());
		}
		//make friends impassable
		friends.forEach(friend => map_copy[friend.y][friend.x] = false);
		map_copy[_this.me.y][_this.me.x] = true;
		
		if(temp_goals.length>0) {
			let bfsMap = nav.breadthFirstSearch(temp_goals, map_copy, Preacher.moveDirs);
			if(bfsMap[_this.me.y][_this.me.x].length > 0) {
				let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
				return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
			}
		}
		
		//lattice code
		friends.forEach(function(friend){if(friend.id!==_this.me.id){lattice_map[friend.y][friend.x] = false}});
		lattice_goals = lattice_goals.filter(goal => lattice_map[goal[1]][goal[0]]);
		if(lattice_goals.length === 0 && !lattice_map[_this.me.y][_this.me.x]) {
			let new_loc = nav.nearestLatticeLocation(lattice_map, [_this.me.x, _this.me.y]);
			if(nav.distSquared(new_loc, [_this.me.x, _this.me.y])<=64) {
				lattice_goals.push(new_loc);
			} else {
				//move towards enemy castles if you don't see an open spot
				let bfsMap = nav.breadthFirstSearch(castle_locations, map_copy, Preacher.moveDirs);
				if(bfsMap[_this.me.y][_this.me.x].length > 0) {
					let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
					return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
				}
			}
		}
		
		if(lattice_goals.length > 0 && !lattice_map[_this.me.y][_this.me.x]) {
			let bfsMap = nav.breadthFirstSearch(lattice_goals, map_copy, Preacher.moveDirs);
			if(bfsMap[_this.me.y][_this.me.x].length > 0) {
				let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
				return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
			}
		}
		/* else if(castle_locations.length>0) {
			let bfsMap = nav.breadthFirstSearch(castle_locations, map_copy, Preacher.moveDirs);
			if(bfsMap[_this.me.y][_this.me.x].length > 0) {
				let newLocation = bfsMap[_this.me.y][_this.me.x][Math.floor(Math.random()*bfsMap[_this.me.y][_this.me.x].length)];
				return _this.move(newLocation[0] - _this.me.x, newLocation[1] - _this.me.y);
			}
		}*/
		
	}
	
}
export default Preacher;