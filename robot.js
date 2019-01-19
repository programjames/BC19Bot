import {
    BCAbstractRobot,
    SPECS
} from 'battlecode';


import Preacher from './Preacher.js';
import Crusader from './Crusader.js';
import Prophet from './Prophet.js';
import Castle from './Castle.js';

class MyRobot extends BCAbstractRobot {
    turn() {
		this.log(""+this.me.turn);
		if(this.me.unit === SPECS.PILGRIM) {
			
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