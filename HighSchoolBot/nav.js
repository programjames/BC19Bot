import {
    BCAbstractRobot,
    SPECS
} from 'battlecode';

function distSquared(loc1, loc2) {
    return Math.pow(loc1[0] - loc2[0], 2) + Math.pow(loc1[1] - loc2[1], 2);
}

function breadthFirstSearch(goals, passable_map, directions) {
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

function closestPassableLocation(starting_location, passable_map) {
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

function isOpen(your_location, passable_map, robot_map){
	if(your_location[0]>=0 && your_location[1]>=0 && your_location[0]<passable_map.length && your_location[1]<passable_map[0].length && passable_map[your_location[1]][your_location[0]] && robot_map[your_location[1]][your_location[0]]<=0){
		return true;
	}
	return false;
}

function isOnMap(loc, width, height) {
	return (loc[0]>=0 && loc[1]>=0 && loc[0]<width && loc[1]<height);
}

function isOnPassableMap(loc, passable_map) {
	return (loc[0]>=0 && loc[1]>=0 && loc[0]<passable_map[0].length && loc[1]<passable_map.length && passable_map[loc[1]][loc[0]]); 
}

function closestLocation(your_location, location_list){
	let minD = -1;
	let minLoc;
	for(let i=0; i<location_list.length; i++){
		let d = distSquared(your_location,location_list[i]);
		if(minD === -1 || d<minD){
			minD = d;
			minLoc = location_list[i];
		}
	}
	return minLoc;
}

function leastDistance(your_location, location_list) {
	let leastDist = -1;
	for(let i = 0; i<location_list.length; i++) {
		let d2 = distSquared(location_list[i], your_location);
		if(leastDist === -1 || d2 < leastDist) {
			leastDist = d2;
		}
	}
	return leastDist;
}

function runAwayDirs(your_location, location_list, moveDirs, passable_map, robot_map) {
	let mostDistAway = leastDistance(your_location, location_list);
	let bestMoves = [];
	for(let i = 0; i<moveDirs.length; i++) {
		let newLoc = [your_location[0] + moveDirs[i][0], your_location[1] + moveDirs[i][1]];
		if(!isOpen(newLoc, passable_map, robot_map)) {
			continue;
		}
		let distAway = leastDistance(newLoc, location_list);
		if (distAway>mostDistAway) {
			mostDistAway = distAway;
			bestMoves = [moveDirs[i]];
		} else if (distAway === mostDistAway) {
			bestMoves.push(moveDirs[i]);
		}
	}
	return bestMoves;
}

function unpack(message, passable_map){
	let x = (message>>4)*4;
	let y = (message%16)*4;
	if(x!== 0 || y !== 0){
		let minD = -1;
		let minDir = [0,0];
		for(let a = 0; a<4; a++){
			for(let b = 0; b<4; b++){
				let c = x+a;
				let d = y+b
				if(c>=0 && d>=0 && c<passable_map[0].length && d<passable_map.length && passable_map[d][c]){
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

function pack(loc) {
	return (Math.floor(loc[0]/4)<<4) + Math.floor(loc[1]/4);
}

function nearestLatticeLocation(lattice_map, pos) {
	let best = [];
	let bestDist = -1;
	for (let y = 0; y<lattice_map.length; y++) {
		for (let x = 0; x<lattice_map[0].length; x++) {
			if(!lattice_map[y][x]) {
				continue;
			}
			let dist = nav.distSquared([x,y], pos);
			if(bestDist === -1 || dist<bestDist) {
				best = [x,y];
				bestDist = dist;
			}
		}
	}
	return best;
}

var nav = {};
nav.distSquared = distSquared;
nav.breadthFirstSearch = breadthFirstSearch;
nav.closestPassableLocation = closestPassableLocation;
nav.unpack = unpack;
nav.pack = pack;
nav.isOpen = isOpen;
nav.isOnMap = isOnMap;
nav.isOnPassableMap = isOnPassableMap;
nav.closestLocation = closestLocation;
nav.leastDistance = leastDistance;
nav.runAwayDirs = runAwayDirs;
nav.nearestLatticeLocation = nearestLatticeLocation;
export default nav;