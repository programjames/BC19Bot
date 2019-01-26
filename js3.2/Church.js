import {
	SPECS
} from 'battlecode';

import nav from './nav.js';

var Church = {};

Church.buildDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
Church.visibleDirs = [[-10, 0], [-9, -4], [-9, -3], [-9, -2], [-9, -1], [-9, 0],
	[-9, 1], [-9, 2], [-9, 3], [-9, 4], [-8, -6], [-8, -5], [-8, -4], [-8, -3],
	[-8, -2], [-8, -1], [-8, 0], [-8, 1], [-8, 2], [-8, 3], [-8, 4], [-8, 5],
	[-8, 6], [-7, -7], [-7, -6], [-7, -5], [-7, -4], [-7, -3], [-7, -2], [-7, -1],
	[-7, 0], [-7, 1], [-7, 2], [-7, 3], [-7, 4], [-7, 5], [-7, 6], [-7, 7], [-6, -8],
	[-6, -7], [-6, -6], [-6, -5], [-6, -4], [-6, -3], [-6, -2], [-6, -1], [-6, 0],
	[-6, 1], [-6, 2], [-6, 3], [-6, 4], [-6, 5], [-6, 6], [-6, 7], [-6, 8], [-5, -8],
	[-5, -7], [-5, -6], [-5, -5], [-5, -4], [-5, -3], [-5, -2], [-5, -1], [-5, 0], [-5, 1],
	[-5, 2], [-5, 3], [-5, 4], [-5, 5], [-5, 6], [-5, 7], [-5, 8], [-4, -9], [-4, -8], [-4, -7],
	[-4, -6], [-4, -5], [-4, -4], [-4, -3], [-4, -2], [-4, -1], [-4, 0], [-4, 1], [-4, 2],
	[-4, 3], [-4, 4], [-4, 5], [-4, 6], [-4, 7], [-4, 8], [-4, 9], [-3, -9], [-3, -8], [-3, -7],
	[-3, -6], [-3, -5], [-3, -4], [-3, -3], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-3, 3],
	[-3, 4], [-3, 5], [-3, 6], [-3, 7], [-3, 8], [-3, 9], [-2, -9], [-2, -8], [-2, -7], [-2, -6],
	[-2, -5], [-2, -4], [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3], [-2, 4],
	[-2, 5], [-2, 6], [-2, 7], [-2, 8], [-2, 9], [-1, -9], [-1, -8], [-1, -7], [-1, -6], [-1, -5],
	[-1, -4], [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [-1, 4], [-1, 5],
	[-1, 6], [-1, 7], [-1, 8], [-1, 9], [0, -10], [0, -9], [0, -8], [0, -7], [0, -6], [0, -5],
	[0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
	[0, 7], [0, 8], [0, 9], [0, 10], [1, -9], [1, -8], [1, -7], [1, -6], [1, -5], [1, -4], [1, -3],
	[1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
	[2, -9], [2, -8], [2, -7], [2, -6], [2, -5], [2, -4], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1],
	[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [3, -9], [3, -8], [3, -7], [3, -6],
	[3, -5], [3, -4], [3, -3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
	[3, 8], [3, 9], [4, -9], [4, -8], [4, -7], [4, -6], [4, -5], [4, -4], [4, -3], [4, -2], [4, -1], [4, 0],
	[4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [5, -8], [5, -7], [5, -6],
	[5, -5], [5, -4], [5, -3], [5, -2], [5, -1], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
	[5, 6], [5, 7], [5, 8], [6, -8], [6, -7], [6, -6], [6, -5], [6, -4], [6, -3], [6, -2], [6, -1],
	[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [7, -7], [7, -6], [7, -5],
	[7, -4], [7, -3], [7, -2], [7, -1], [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7],
	[8, -6], [8, -5], [8, -4], [8, -3], [8, -2], [8, -1], [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
	[8, 6], [9, -4], [9, -3], [9, -2], [9, -1], [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [10, 0]];
var mapHeight;
var mapWidth;
var horizontal_symmetry = true;

//This is friendly castle location. Does not include its own.
var castle_locations = [];
// number of enemies.
var numPilgrims = 0;
var numCrusaders = 0;
var numProphets = 0;
var numPreachers = 0;
// The number of our scouts.
var numScouts = 0;

// num of karb and fuel.
var fuel_spots = 0;
var karbonite_spots = 0;

// num of built stuff;
var karbs_built = 0;
var fuels_built = 0;
var pilgrims_built = 0;
var prophets_built = 0;
var scouts_built = 0;
var preachers_built = 0;
var crusaders_built = 0;

// constant for signalling.
var KARB_MINER = 3;
var FUEL_MINER = 4;
var BOTH_MINER = 5;
var ARCHER_LATTICE = 2;
var SEND_WAVE = 255;

var mining_spots = 0;

var sentWave = false;
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
		for(let i = 0; i<Church.visibleDirs.length; i++){
			let x = _this.me.x + Church.visibleDirs[i][0];
			let y = _this.me.y + Church.visibleDirs[i][1];
			if(nav.isOnMap([x,y], mapWidth, mapHeight) && (_this.karbonite_map[y][x] || _this.fuel_map[y][x])){
				mining_spots+=1;
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
	
	let enemies = visibleRobots.filter(robot => robot.team !== _this.me.team);
	let friends = visibleRobots.filter(robot => robot.team === _this.me.team);
	if(enemies.length > 0){
		// bulid preacher
		for(let i = 0; i<Church.buildDirs.length; i++){
			let x = Church.buildDirs[i][0]+_this.me.x;
			let y = Church.buildDirs[i][1]+_this.me.y;
			if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
				prophets_built+=1;
				return _this.buildUnit(SPECS.PROPHET, Church.buildDirs[i][0], Church.buildDirs[i][1]);
			}
		}
	}
	else{
		//loop over visible fuel/karbonite, see how many friendly pilgrims are nearby (this is done in turn 1), and if it is greater or equal to the number of pilgrims.
		// If there are less pilgrims than mining spots, build a pilgrim (that chooses which type to be).
		// Otherwise build prophets (to make a lattice).
		
		let friendly_pilgrims = friends.filter(robot => robot.unit === SPECS.PILGRIM);
		if(friendly_pilgrims.length < mining_spots && _this.fuel>=8000 && _this.karbonit>=60){
			// build pilgrim
			for(let i = 0; i<Church.buildDirs.length; i++){
				let x = Church.buildDirs[i][0]+_this.me.x;
				let y = Church.buildDirs[i][1]+_this.me.y;
				if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
					pilgrims_built+=1;
					_this.signal(BOTH_MINER, 2);
					return _this.buildUnit(SPECS.PILGRIM, Church.buildDirs[i][0], Church.buildDirs[i][1]);
				}
			}
		}
		else if(_this.fuel >=8000 && _this.karbonite>=80){
			//build prophet
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