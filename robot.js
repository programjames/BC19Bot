import {
    BCAbstractRobot,
    SPECS
} from 'battlecode';


import Scout from './Scout.js';
import Miner from './Miner.js';
import Preacher from './Preacher.js';
import Crusader from './Crusader.js';
import Prophet from './Prophet.js';
import Castle from './Castle.js';

const buildDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
var amScout = false;
var amKarb = true;
var amFuel = false;

var KARB_MINER = 3;
var FUEL_MINER = 4;

class MyRobot extends BCAbstractRobot {
    turn() {
		//this.log(""+this.me.turn);
		//this.log("pos:  " + this.me.x + ", " + this.me.y);
		//this.log("karbonite:  "+this.karbonite + "  fuel:  " + this.fuel);
		if(this.me.unit === SPECS.PILGRIM) {
			if(this.me.turn === 1){
				let visibleRobotMap = this.getVisibleRobotMap();
				for(let i = 0; i<buildDirs.length; i++){
					let x = buildDirs[i][0]+this.me.x;
					let y = buildDirs[i][1]+this.me.y;
					if(x>=0 && y>=0 && x<this.map[0].length && y<this.map.length && visibleRobotMap[y][x]>0){
						let robot = this.getRobot(visibleRobotMap[y][x]);
						if(robot.team === this.me.team && robot.unit === SPECS.CASTLE && robot.signal!==-1){
							let message = robot.signal;
							//this.log("message:  "+message);
							if(message === FUEL_MINER){
								amKarb = false;
								amFuel = true;
							}
							else if(message === KARB_MINER){
								// pass
							}
							else{
								amKarb = false;
								amScout = true;
							}
						}
					}
				}
			}
			if(amKarb || amFuel){
				return Miner.turn(this, amKarb);
			}
			else{
				return Scout.turn(this);
			}
		} else if(this.me.unit === SPECS.PREACHER) {
			return Preacher.turn(this);
		} else if (this.me.unit === SPECS.PROPHET) {
			return Prophet.turn(this);
		} else if (this.me.unit === SPECS.CRUSADER) {
			return Crusader.turn(this);
		} else if(this.me.unit === SPECS.CASTLE) {
			return Castle.turn(this);
		}
	}
}

var robot = new MyRobot();