import {
    BCAbstractRobot,
    SPECS
} from 'battlecode';

function distSquared(loc1, loc2) {
    return Math.pow(loc1[0] - loc2[0], 2) + Math.pow(loc1[1] - loc2[1], 2);
}

function breadthFirstSearch(goals, passable_map, directions, _this) {
    let going_to_check = new Queue(goals);
    let already_checked_map = [];
    let best_directions_list = [];
    let moves_it_takes = [];
    for (let i = 0; i < passable_map.length; i++) {
        let row = [];
        let row2 = [];
        let row3 = [];
        for (let j = 0; j < passable_map[0].length; j++) {
            row.push([]);
            row2.push(0);
            row3.push(false);
        }
        best_directions_list.push(row);
        moves_it_takes.push(row2);
        already_checked_map.push(row3);
    }

    while (going_to_check.length > 0) {
        let next_place = going_to_check.dequeue();
        for (let i = 0; i < directions.length; i++) {
            let direction_ = directions[i];
            let x = next_place[0] + direction_[0];
            let y = next_place[1] + direction_[1];

            if (x < 0 || y < 0 || x >= passable_map[0].length || y >= passable_map.length) {
                continue;
            }

            if (!passable_map[y][x]) {
                continue;
            }

            if (!already_checked_map[y][x]) {
                going_to_check.enqueue([x, y]);
                already_checked_map[y][x] = true;
                moves_it_takes[y][x] = moves_it_takes[next_place[1]][next_place[0]] + 1;

            }
            if (moves_it_takes[y][x] > moves_it_takes[next_place[1]][next_place[0]]) {
                best_directions_list[y][x].push(next_place.slice());
            }
        }
    }

    return best_directions_list;
}

class Queue {
    constructor(list) {
        this.list = list.slice();
        this.enqueue_index = this.list.length;
        this.dequeue_index = -1;
        this.length = this.list.length;
    }

    enqueue(item) {
        this.list[this.enqueue_index] = item;
        this.enqueue_index++;
        this.length++;
    }
    dequeue() {
        this.dequeue_index++;
        this.length--;
        return this.list[this.dequeue_index];
    }
    toList() {
        return this.list.slice(dequeue_index + 1, enqueue_index);
    }
    indexOf(item) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i][0] === item[0] && this.list[i][1] === item[1]) {
                return i;
            }
        }
        return -1;
    }
    getList() {
        return this.list;
    }
}

function closestPassableLocation(starting_location, passable_map, _this) {
	let bestLocation = [-1, -1];
	let distToBestLocation = -1;
	for(let y = 0; i<passable_map.length; i++) {
		for(let x = 0; j<passable_map[0].length; j++) {
			if(passable_map[i][j]) {
				let distToLocation = distSquared([x,y], starting_location);
				if(distToBestLocation === -1 || distToLocation<distToBestLocation) {
					bestLocation = [x,y]
				}
			}
		}
	}
	return bestLocation;
}

function isOpen(x,y, passable_map, robot_map){
	if(passable_map[y][x] && robot_map[y][x]<=0){
		return true;
	}
	return false;
}

function closestLocation(myLoc, location_list){
	let minD = -1;
	let minLoc;
	for(let i=0; i<location_list.length; i++){
		let d = distSquared(myLoc,location_list[i]);
		if(minD === -1 || d<minD){
			minD = d;
			minLoc = location_list[i];
		}
	}
	return minLoc;
}

function unpack(message, passable_map){
	let x = (message>>4)*4;
	let y = (message%16)*4;
	if(x!== 0 || y !== 0){
		let minD = -1;
		let minDir = [0,0];
		for(let a = 0; a<4; a++){
			for(let b = 0; b<4; b++){
				if(passable_map[x+a][y+b]){
					let diff = Math.abs(a-2)+Math.abs(b-2);
					if(minD===-1){
						minD = diff;
						minDir = [a,b];
					}
					else if(diff<minD){
						minD = diff;
						minDir = [a,b];
					}
				}
			}
		}
		x += minDir[0];
		y += minDir[1];
	}
	return [x,y];
}


var nav = {};
nav.distSquared = distSquared;
nav.breadthFirstSearch = breadthFirstSearch;
nav.closestPassableLocation = closestPassableLocation;
nav.unpack = unpack;
nav.isOpen = isOpen;
nav.closestLocation = closestLocation;
export default nav;