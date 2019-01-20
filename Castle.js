import {
	SPECS
} from 'battlecode';

import nav from './nav/';

var Castle = {};

Castle.buildDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
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
var prophets_built = 0;
var scouts_built = 0;
var preachers_built = 0;
var crusaders_built = 0;

// constant for signalling.
var KARB_MINER = 1;
var FUEL_MINER = 2;

Castle.turn = function turn(_this){
	let visibleRobotMap = _this.getVisibleRobotMap();
	let visibleRobots = _this.getVisibleRobots();
	
	// First turn stuff.
	if(_this.me.turn === 1){
		mapHeight = _this.map.length;
		mapWidth = _this.map[0].length;
		Castle.starting_pos = [_this.me.x, _this.me.y];
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
		for(let a = 0; a< mapWidth; a++){
			for(let b = 0; b<mapHeight; b++){
				if(_this.karbonite_map[b][a]){
					karbonite_spots += 1;
				}
				if(_this.fuel_map[b][a]){
					fuel_spots += 1;
				}
			}
		}
		// Castle talk out my location.
		let bitMessage = (_this.me.x<<4)+_this.me.y;
		_this.castle_talk(bitMessage);
	}
	// End of first turn stuff.
	// Find friendly castle locations.
	if(_this.me.turn === 1 || _this.me.turn === 2){
		for(let i = 0; i<visibleRobots.length; i++){
			let message = visibleRobots[i].castle_talk;
			if(message !== 0){
				let x = message>>4;
				let y = message%16;
				castle_locations.push([x,y]);
			}
		}
	}
	// End finding castles.
	if(_this.me.turn>2){
		numScouts = 0;
		// Get number of enemies from pilgrims.
		let nPilgrims = 0;
		let nCrusaders = 0;
		let nProphets = 0;
		let nPreachers = 0;
		let friends = visibleRobots.filter(robot => robot.team === _this.me.team);
		for(let i = 0; i<friends.length; i++){
			let message = friends[i].castle_talk;
			if(message>0){
				numScouts+=1;
				nPilgrims+=(message>>6);
				nCrusaders+=(message>>4)%4;
				nProphets+=(message>>2)%4;
				nPreachers+=message%4;
			}
		}
		if(nPilgrims === 0 && nCrusaders === 0 && nProphets === 0 && nPreachers === 0){
			// pass
		}
		else{
			numPilgrims = nPilgrims;
			numCrusaders = nCrusaders;
			numProphets = nProphets;
			numPreachers = nPreachers;
		}
	}
	let bestBuild;
	if(numCrusaders*10 >= numProphets*6 && numCrusaders*2 >= numPreachers ){
		bestBuild = SPECS.PREACHER;
	}
	else if(numPreachers*5>=numProphets*6 && numPreachers>=numCrusaders*2){
		bestBuild = SPECS.PROPHET;
	}
	else{
		bestBuild = SPECS.CRUSADER;
	}
	// Number of pilgrims to build at most: Math.ceil(karbonite_spots/(castle_locations.length + 1)) for karb, similar for fuel.
	if(_this.me.turn<=2){
		//build karbonite miner.
		for(let i = 0; i<Castle.buildDirs.length; i++){
			let x = Castle.buildDirs[i][0]+_this.me.x;
			let y = Castle.buildDirs[i][1]+_this.me.y;
			if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
				karbs_built+=1;
				_this.signal(KARB_MINER, 2);
				return _this.build(SPECS.PILGRIM, buildDirs[i][0], buildDirs[i][1]);
			}
		}
	}
	else if(_this.me.turn === 3){
		// build scout.
		let bitSend = 0;
		for(let i = 0; i<castle_locations.length; i++){
			bitSend = bitSend<<8;
			bitSend+=castle_locations[i][0];
			bitSend = bitSend<<4;
			bitSend+=castle_locations[i][1];
		}
		if(castle_locations.length === 1){
			bitSend = bitSend<<8;
		}
		for(let i = 0; i<Castle.buildDirs.length; i++){
			let x = Castle.buildDirs[i][0]+_this.me.x;
			let y = Castle.buildDirs[i][1]+_this.me.y;
			if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
				scouts_built+=1;
				_this.signal(bitSend, 2);
				return _this.build(SPECS.PILGRIM, buildDirs[i][0], buildDirs[i][1]);
			}
		}
	}
	else{
		if(numCrusaders*20+numProphets*25+numPreachers*30 >=120){
			// build our bestBuild attack unit.
			let bitSend = 0;
			for(let i = 0; i<castle_locations.length; i++){
				bitSend = bitSend<<8;
				bitSend+=castle_locations[i][0];
				bitSend = bitSend<<4;
				bitSend+=castle_locations[i][1];
			}
			if(castle_locations.length === 1){
				bitSend = bitSend<<8;
			}
			for(let i = 0; i<Castle.buildDirs.length; i++){
				let x = Castle.buildDirs[i][0]+_this.me.x;
				let y = Castle.buildDirs[i][1]+_this.me.y;
				if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
					scouts_built+=1;
					_this.signal(bitSend, 2);
					return _this.build(bestBuild, buildDirs[i][0], buildDirs[i][1]);
				}
			}
		}
		else if (fuels_built<karbs_built && _this.karbonite>=60){
			//build a karb guy.
			for(let i = 0; i<Castle.buildDirs.length; i++){
				let x = Castle.buildDirs[i][0]+_this.me.x;
				let y = Castle.buildDirs[i][1]+_this.me.y;
				if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
					karbs_built+=1;
					_this.signal(KARB_MINER, 2);
					return _this.build(SPECS.PILGRIM, buildDirs[i][0], buildDirs[i][1]);
				}
			}
		}
		else if (_this.karbonite>=60){
			// build a fuel miner.
			for(let i = 0; i<Castle.buildDirs.length; i++){
				let x = Castle.buildDirs[i][0]+_this.me.x;
				let y = Castle.buildDirs[i][1]+_this.me.y;
				if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
					karbs_built+=1;
					_this.signal(FUEL_MINER, 2);
					return _this.build(SPECS.PILGRIM, buildDirs[i][0], buildDirs[i][1]);
				}
			}
		}
	}
}

export default Castle