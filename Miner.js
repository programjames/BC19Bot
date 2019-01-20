import {
	SPECS
} from 'battlecode';

import nav from './nav/';

var Miner = {};

Miner.moveDirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]];
Miner.starting_pos;
var mapHeight;
var mapWidth;
var horizontal_symmetry = true;
//This is enemy castle locations.
var castle_locations = [];

Miner.turn = function turn(_this){
// Find initial values, and places to go to.
mapWidth = this.karbonite_map[0].length;
mapHeight = this.karbonite_map.length;
for (var a = 0; a < mapHeight; a++) {
for (var b = 0; b < mapWidth; b++) {
if (goForKarb && this.karbonite_map[a][b]) {
resource_goals.push([b, a]);
} else if (!goForKarb && this.fuel_map[a][b]) {
resource_goals.push([b, a]);
}
if (visibleRobotMap[a][b] > 0) {
var r = this.getRobot(visibleRobotMap[a][b]);
if (r.unit <= 1) {
for (var i = 0; i < giveDirs.length; i++) {
var x = b + giveDirs[i][0];
var y = a + giveDirs[i][1];
depot_goals.push([x, y]);
}
}
}
}
}
}
var friends = [];
var enemies = [];
var myTeam = this.me.team;
visibleRobots.forEach(function(robot) {
if (robot.team === myTeam) {
friends.push(robot);
} else if (robot.unit > 2) {
enemies.push(robot);
}
});
/*for(var i = 0; i < visibleRobots.length; i++){
if(visibleRobots[i].team !== this.me.team){
enemies.push(visibleRobots[i]);
}
}*/
// Uh oh! Enemy spotted.
if (enemies.length > 0) {
var center = [0, 0];

for (var i = 0; i < enemies.length; i++) {
center[0] += enemies[i].x;
center[1] += enemies[i].y;
}
var bitCenter = [Math.floor(center[0] / enemies.length / 4), Math.floor(center[1] / enemies.length / 4)]; // IMPORTANT: this is the 8-bit center (so from [0,15] to [0,15])
var bitMessage = bitCenter[0] * 16 + bitCenter[1];
this.castleTalk(bitMessage);

//Actual center now:
center = [center[0] / enemies.length, center[1] / enemies.length];

// Okay, find the best way to retreat away from their center of mass.
var maxDir = [0, 0];
var maxD = Math.pow(this.me.x - center[0], 2) + Math.pow(this.me.y - center[1], 2);
for (var i = moveDirs.length - 1; i >= 0; i--) {
var x = this.me.x + moveDirs[i][0];
var y = this.me.y + moveDirs[i][1];
if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight || !this.map[y][x]) {
continue;
}
var d = Math.pow(x - center[0], 2) + Math.pow(y - center[1], 2);
if (d > maxD) {
maxD = d;
maxDir = moveDirs[i];
}
}

// If we would actually move (because maybe staying put is the furthest we can get from them):
if (maxDir[0] !== 0 || maxDir[1] !== 0) {
return this.move(maxDir[0], maxDir[1])
}
}

// This is basically if we can mine.
if ((goForKarb && this.karbonite_map[this.me.y][this.me.x] && this.me.karbonite < 20) || (!goForKarb && this.fuel_map[this.me.y][this.me.x] && this.me.fuel < 100)) {
// First check if there are nearby pilgrims, and tell them that this is OUR mine.
for (var i = 0; i < visibleRobots.length; i++) {
if (visibleRobots[i].unit == SPECS.PILGRIM && visibleRobots[i].signal == areYouUsingResources) {
var d = distSquared([this.me.x, this.me.y], [visibleRobots[i].x, visibleRobots[i].y]);
if (d < 9) { // If it is relatively cheap to signal.
this.signal(myResouces, d);
}
}
}
// Now can we (and should we) build a church right by?
// Is there already a nearby church?
if (!closeChurch) {
for (var i = 0; i < aroundDirs.length; i++) {
x = this.me.x + aroundDirs[i][0];
y = this.me.y + aroundDirs[i][1];
if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight && visibleRobotMap[y][x] > 0) {
if (this.getRobot(visibleRobotMap[y][x]).unit <= 1) {
closeChurch = true; // Yep found. Now append this church to our depot goals.
depot_goals.push([x, y]);
break;
}
}
}
// Okay, we didn't find any nearby close churches. Let's build one then.
if (this.karbonite >= 50 && !closeChurch) {
for (var i = 0; i < giveDirs.length; i++) {
var x = this.me.x + giveDirs[i][0];
var y = this.me.y + giveDirs[i][1];
if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight && this.map[y][x] && visibleRobotMap[y][x] <= 0 && !this.karbonite_map[y][x] && !this.fuel_map[y][x]) {
return this.buildUnit(1, giveDirs[i][0], giveDirs[i][1]);
}
}
}
}

// Well, let's mine.
return this.mine();
} else {
// We aren't on a mine square.
var map_copy = [];
for (var i = 0; i < mapHeight; i++) {
map_copy.push(this.map[i].slice());
}
//this.log("Map copy: "+map_copy)
visibleRobots.forEach(function(friend) {
if (friend.unit >= 2) {
map_copy[friend.y][friend.x] = false;
}
});
map_copy[this.me.y][this.me.x] = true;
// Is it in search of resources?
if ((goForKarb && this.me.karbonite < 20) || (!goForKarb && this.me.fuel < 100)) {
// First take out any mines that other pilgrims have taken:
for (var i = resource_goals.length - 1; i >= 0; i--) {
if (visibleRobotMap[resource_goals[i][1]][resource_goals[i][0]] > 0 && (resource_goals[i][1] !== this.me.y || resource_goals[i][0] !== this.me.x)) {
r = this.getRobot(visibleRobotMap[resource_goals[i][1]][resource_goals[i][0]]);
if (r.unit == SPECS.PILGRIM && r.signal === myResouces) {
askedIDs.push(r.id);
resource_goals.splice(i, 1);
continue;
}
var alreadyAsked = false;
for (var j = 0; j < askedIDs.length; j++) {
if (askedIDs[j] === r.id) {
alreadyAsked = true;
break;
}
}
if (!alreadyAsked && r.unit == SPECS.PILGRIM) {
var d = distSquared([r.x, r.y], [this.me.x, this.me.y]);
if (d < 9) {
this.signal(areYouUsingResources, d);
}
}
}
}
// Let's get our best path now.
//resource_goals.forEach(g => map_copy[g[1]][g[0]] = true);
//map_copy[this.me.y][this.me.x] = true;
path = breadthFirstSearch(resource_goals, map_copy, moveDirs, this);
} else { // We want to return our resources to a church/chapel.
// Let's first see if it is possible to give our stuff, then try to move if it isn't possible.
for (var i = 0; i < giveDirs.length; i++) {
var x = this.me.x + giveDirs[i][0];
var y = this.me.y + giveDirs[i][1];
if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight && visibleRobotMap[y][x] > 0) {
if (this.getRobot(visibleRobotMap[y][x]).unit <= 1) {
if (goForKarb) {
return this.give(giveDirs[i][0], giveDirs[i][1], this.me.karbonite, this.me.fuel);
} else {
return this.give(giveDirs[i][0], giveDirs[i][1], this.me.karbonite, this.me.fuel);
}
}
}
}

// Well that didn't work, so let's just move towards a church/chapel.
path = breadthFirstSearch(depot_goals, map_copy, moveDirs, this);
}
var dirs = path[this.me.y][this.me.x];
for (var i = 0; i < dirs.length; i++) {
if (map_copy[dirs[i][1]][dirs[i][0]]) {
var dx = dirs[i][0] - this.me.x;
var dy = dirs[i][1] - this.me.y;
return this.move(dx, dy);
}
}
}
}

export default Miner