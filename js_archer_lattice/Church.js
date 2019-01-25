import {
	SPECS
} from 'battlecode';

import nav from './nav.js';

var Church = {};

Church.buildDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
var mapHeight;
var mapWidth;
var horizontal_symmetry = true;

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
	}
	// End of first turn stuff.
	let enemies = visibleRobots.filter(robot => robot.team !== _this.me.team);
	if((enemies.length>0 && _this.karbonite>=25 && _this.fuel>=50) || (_this.karbonite>=70 && _this.fuel >= 100)) {
		for(let i = 0; i<Church.buildDirs.length; i++){
			let x = Church.buildDirs[i][0]+_this.me.x;
			let y = Church.buildDirs[i][1]+_this.me.y;
			if(nav.isOpen([x,y], _this.map, visibleRobotMap)){
				return _this.buildUnit(SPECS.PROPHET, Church.buildDirs[i][0], Church.buildDirs[i][1]);
			}
		}
	}
}

export default Church