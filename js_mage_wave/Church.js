import {
	SPECS
} from 'battlecode';

import nav from './nav.js';

var Church = {};

Church.buildDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
Church.visionDirs = [[-10, 0], [-9, -4], [-9, -3], [-9, -2], [-9, -1], [-9, 0], [-9, 1], [-9, 2], [-9, 3], [-9, 4], [-8, -6], [-8, -5], [-8, -4], [-8, -3], [-8, -2], [-8, -1], [-8, 0], [-8, 1], [-8, 2], [-8, 3], [-8, 4], [-8, 5], [-8, 6], [-7, -7], [-7, -6], [-7, -5], [-7, -4], [-7, -3], [-7, -2], [-7, -1], [-7, 0], [-7, 1], [-7, 2], [-7, 3], [-7, 4], [-7, 5], [-7, 6], [-7, 7], [-6, -8], [-6, -7], [-6, -6], [-6, -5], [-6, -4], [-6, -3], [-6, -2], [-6, -1], [-6, 0], [-6, 1], [-6, 2], [-6, 3], [-6, 4], [-6, 5], [-6, 6], [-6, 7], [-6, 8], [-5, -8], [-5, -7], [-5, -6], [-5, -5], [-5, -4], [-5, -3], [-5, -2], [-5, -1], [-5, 0], [-5, 1], [-5, 2], [-5, 3], [-5, 4], [-5, 5], [-5, 6], [-5, 7], [-5, 8], [-4, -9], [-4, -8], [-4, -7], [-4, -6], [-4, -5], [-4, -4], [-4, -3], [-4, -2], [-4, -1], [-4, 0], [-4, 1], [-4, 2], [-4, 3], [-4, 4], [-4, 5], [-4, 6], [-4, 7], [-4, 8], [-4, 9], [-3, -9], [-3, -8], [-3, -7], [-3, -6], [-3, -5], [-3, -4], [-3, -3], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-3, 3], [-3, 4], [-3, 5], [-3, 6], [-3, 7], [-3, 8], [-3, 9], [-2, -9], [-2, -8], [-2, -7], [-2, -6], [-2, -5], [-2, -4], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-2, 4], [-2, 5], [-2, 6], [-2, 7], [-2, 8], [-2, 9], [-1, -9], [-1, -8], [-1, -7], [-1, -6], [-1, -5], [-1, -4], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [-1, 4], [-1, 5], [-1, 6], [-1, 7], [-1, 8], [-1, 9], [0, -10], [0, -9], [0, -8], [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [1, -9], [1, -8], [1, -7], [1, -6], [1, -5], [1, -4], [1, -3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [2, -9], [2, -8], [2, -7], [2, -6], [2, -5], [2, -4], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [3, -9], [3, -8], [3, -7], [3, -6], [3, -5], [3, -4], [3, -3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [4, -9], [4, -8], [4, -7], [4, -6], [4, -5], [4, -4], [4, -3], [4, -2], [4, -1], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [5, -8], [5, -7], [5, -6], [5, -5], [5, -4], [5, -3], [5, -2], [5, -1], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [6, -8], [6, -7], [6, -6], [6, -5], [6, -4], [6, -3], [6, -2], [6, -1], [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [7, -7], [7, -6], [7, -5], [7, -4], [7, -3], [7, -2], [7, -1], [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [8, -6], [8, -5], [8, -4], [8, -3], [8, -2], [8, -1], [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [9, -4], [9, -3], [9, -2], [9, -1], [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [10, 0]];
var mapHeight;
var mapWidth;
var horizontal_symmetry = true;


// constant for signalling.
var KARB_MINER = 4;
var FUEL_MINER = 5;
var BOTH_MINER = 3;
var SEND_WAVE = 255;

let resources = 0;
var sentWave = false;
let preachers_built = 0;
var waveCount = 0;

Church.turn = function turn(_this){
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	
	// First turn stuff.
	if(_this.me.turn === 1){
		mapHeight = _this.map.length;
		mapWidth = _this.map[0].length;
		Church.starting_pos = [_this.me.x, _this.me.y];
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
		
		for(let i = 0; i<Church.visionDirs.length; i++) {
			let dir = Church.visionDirs[i];
			let x = dir[0] + _this.me.x;
			let y = dir[1] + _this.me.y;
			if(!nav.isOnMap([x,y], mapWidth, mapHeight)) {
				continue;
			}
			if(_this.fuel_map[y][x] || _this.karbonite_map[y][x]) {
				resources++;
			}
		}
	}
	// End of first turn stuff.
	
	if(preachers_built>=20){
		preachers_built = 0;
		sentWave = true;
		_this.castleTalk(SEND_WAVE);
	}
	if(sentWave){
		waveCount+=1
		if(waveCount>=50){
			sentWave = false;
			waveCount = 0;
		}
	}
	
	let nearby_pilgrims = 0;
	for(let i = 0; i<Church.visionDirs.length; i++) {
		let dir = Church.visionDirs[i];
		let x = dir[0] + _this.me.x;
		let y = dir[1] + _this.me.y;
		if(!nav.isOnMap([x,y], mapWidth, mapHeight)) {
			continue;
		}
		if(visibleRobotMap[y][x]>0) {
			if(_this.getRobot(visibleRobotMap[y][x]).unit === SPECS.PILGRIM) {
				nearby_pilgrims++;
			}
		}
	}
	
	let enemies = visibleRobots.filter(robot => robot.team !== _this.me.team);
	let friendly_prophets = visibleRobots.filter(robot => robot.team === _this.me.team && _this.isVisible(robot) && robot.id === SPECS.PROPHET);
	
	if((enemies.length>0) && friendly_prophets.length<3 && _this.karbonite>=25 && _this.fuel>=50) {
		for(let i = 0; i<Church.buildDirs.length; i++){
			let x = Church.buildDirs[i][0]+_this.me.x;
			let y = Church.buildDirs[i][1]+_this.me.y;
			if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
				preachers_built+=1;
				return _this.buildUnit(SPECS.PREACHER, Church.buildDirs[i][0], Church.buildDirs[i][1]);
			}
		}
	}
	else if(nearby_pilgrims<resources) {
		if(_this.karbonite>=40 && _this.fuel>=100) {
			//build a fuel guy.
			for(let i = 0; i<Church.buildDirs.length; i++){
				let x = Church.buildDirs[i][0]+_this.me.x;
				let y = Church.buildDirs[i][1]+_this.me.y;
				if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
					_this.signal(BOTH_MINER, 2);
					_this.castleTalk(1);
					return _this.buildUnit(SPECS.PILGRIM, Church.buildDirs[i][0], Church.buildDirs[i][1]);
				}
			}
		}
	}
	else{
		if(_this.karbonite>=80 && _this.fuel>=Math.min(400*preachers_built,10000)+500) {
			for(let i = 0; i<Church.buildDirs.length; i++){
				let x = Church.buildDirs[i][0]+_this.me.x;
				let y = Church.buildDirs[i][1]+_this.me.y;
				if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
					preachers_built+=1;
					return _this.buildUnit(SPECS.PREACHER, Church.buildDirs[i][0], Church.buildDirs[i][1]);
				}
			}
		}
	}
}

export default Church