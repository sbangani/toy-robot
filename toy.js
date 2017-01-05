var commandInitiated = false;
var errorMsg = document.getElementById("error");
var reportMsg = document.getElementById("report");

var facing = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
var maxX = 4;
var maxY = 4;

var robot = null;
var currentPos = {};

var canvas = document.getElementById("c");
var context = canvas.getContext("2d");

function writeError(msg) {
    errorMsg.innerHTML = msg;
}



function Robot(x, y, f) {
    this.x = x;
    this.y = y;
    this.f = f;
}

// x coordinate
function existX(axis) {
    if (isNaN(axis)) {
        writeError("Please enter a numeric X coordinates");
        return false;
    } else if (axis < 0 || axis > maxX) {
        writeError("X coordinates not in range");
        return false;
    } else {
        return true;
    }
}
// y coordinate
function existY(axis) {
    if (isNaN(axis)) {
        writeError("Please enter a numeric Y coordinates");
        return false;
    } else if (axis < 0 || axis > maxY) {
        writeError("Y coordinates not in range");
        return false;
    } else {
        return true;
    }
}

// face direction
function existF(face) {
    if (facing.indexOf(face) === -1) {
        writeError("Robot is facing Wrong direction");
        return false;
    } else {
        return true;
    }
}


function place(posCmd) {
	// get x y f from the command
    var newPos = posCmd.split(","); 
    var newX = parseInt(newPos[0].trim());
    var newY = parseInt(newPos[1].trim());
    var newF = newPos[2].trim().toUpperCase();
    if (existX(newX) && existY(newY) && existF(newF)) {
        robot.x = newX;
        robot.y = newY;
        robot.f = newF;
        drawRobot(robot);
    }
}

// move by places
function move() {
    switch (currentPos.f) {
        case "NORTH":
            var newY = currentPos.y + 1;
            if (existY(newY)) {
                robot.y = newY;
                drawRobot(robot);
            }
            break;
        case "SOUTH":
            var newY = currentPos.y - 1;
            if (existY(newY)) {
                robot.y = newY;
                drawRobot(robot);
            }
            break;
        case "EAST":
            var newX = currentPos.x + 1;
            if (existX(newX)) {
                robot.x = newX;
                drawRobot(robot);
            }
            break;
        case "WEST":
            var newX = currentPos.x - 1;
            if (existX(newX)) {
                robot.x = newX;
                drawRobot(robot);
            }
            break;
        default:
            break;
    }
}

function rotate(direction) {
    if (direction === "left") {
        switch (currentPos.f) {
            case "NORTH":
                robot.f = "WEST";
                break;
            case "SOUTH":
                robot.f = "EAST";
                break;
            case "EAST":
                robot.f = "NORTH";
                break;
            case "WEST":
                robot.f = "SOUTH";
                break;
            default:
                break;
        }
    } else if (direction === "right") {
        switch (currentPos.f) {
            case "NORTH":
                robot.f = "EAST";
                break;
            case "SOUTH":
                robot.f = "WEST";
                break;
            case "EAST":
                robot.f = "SOUTH";
                break;
            case "WEST":
                robot.f = "NORTH";
                break;
            default:
                break;
        }
    }
}

function report() {
    reportMsg.innerHTML = robot.x + "," + robot.y + "," + robot.f;
}

function keyProcessCommand(command) {
    console.log(command);
    writeError(""); // clear error message

    currentPos = {
        x: robot.x,
        y: robot.y,
        f: robot.f
    };
    var completeCmd = command.split(" ");
    var Cmd = completeCmd[0].toUpperCase();

    if (commandInitiated) {
        switchCommand(Cmd, completeCmd);
    } else if ((!commandInitiated && Cmd === 'PLACE')) {
        commandInitiated = true;
        var posCmd = completeCmd.slice(1).join(""); //validating the command if it containing the spaces
        place(posCmd);
    } else {
        writeError("first valid command must be a PLACE command!");
    }
}


function switchCommand(Cmd, completeCmd) {
    switch (Cmd) {
        case "PLACE":
            var posCmd = completeCmd.slice(1).join(""); //validating the command if it containing the spaces
            place(posCmd);
            break;
        case "MOVE":
            move();
            break;
        case "LEFT":
            rotate("left");
            break;
        case "RIGHT":
            rotate("right");
            break;
        case "REPORT":
            report();
            break;
        default:
            writeError("Invalid command!");
            break;
    }

}

// clear current robot position
function clearCurrentRobotPosition(currentX, currentY) {
    var axisX = currentX * 100 + 51;
    var axisY = (5 - currentY) * 100 - 49;
    context.clearRect(axisX, axisY, 98, 98);
}

// clear current and drawing robot position
function drawRobot(newRobot) {
    clearCurrentRobotPosition(currentPos.x, currentPos.y); 
    context.beginPath();
    var axisX = (newRobot.x + 1) * 100;
    var axisY = (5 - newRobot.y) * 100;
    context.arc(axisX, axisY, 35, 0, 2 * Math.PI);
    context.stroke();
}

// start a move
function init() {
    for (var x = 50; x < 650; x += 100) {
        context.moveTo(x, 50);
        context.lineTo(x, 550);
    }

    for (var y = 50; y < 650; y += 100) {
        context.moveTo(50, y);
        context.lineTo(550, y);
    }

    context.strokeStyle = "#000";
    context.stroke();

    robot = new Robot(0, 0, "NORTH");
    drawRobot(robot);
}

init();