const view = document.getElementById("view");
const ctx = view.getContext("2d");

const orbitView = document.getElementById("orbits");
const orbitCtx = orbitView.getContext("2d");
const fractalType = document.getElementById("fractalType");
const acceptButton = document.getElementById("accept");

const WID = view.width;
const HEI = view.height;
const HWID = WID/2.0;
const HHEI = HEI/2.0;
const offsetX = view.getBoundingClientRect().left;
const offsetY = view.getBoundingClientRect().top;

const PI = Math.PI;
const TAU = PI * 2;

var gradWid = 0.07;
var offset = 0;

var imgData = ctx.getImageData(0,0,view.width,view.height);
var orbitData = orbitCtx.getImageData(0,0,orbitView.width, orbitView.height);

var frame = 2;
var focus = [0,0];

var colorScheme = [
    [0, TAU/3.0 + 0.5, 2*TAU/3.0 + 0.5],
    [0.5, TAU/3.0 + 0.5, 2*TAU/3.0],
    [ 2*TAU/3.0 + 0.5, 0.5, TAU/3.0 + 0.5],
    [1, TAU/3.0, 2*TAU/3.0],
    [0, PI/6.0, TAU/3.0],
    [0, -PI/6.0, -PI/3.0],
];
var scheme = 1;
var maxIterations = 2000;

var mouse = [0,0];
var clickX, clickY;

var iterations = arr2d(WID,HEI);
var points = arr2d(WID,HEI);
var orbitIterations = arr2d(WID,HEI);
for(var i = 0; i < WID; ++i) {
    for(var k = 0; k < HEI; ++k) {
        points[i][k] = [0,0];
        iterations[i][k] = 0;
        orbitIterations[i][k] = 0;
    }
}

// set alpha to 255;
for(var x = 0; x < WID; ++x) {
    for(var y = 0; y < HEI; ++y) {
        imgData.data[y*WID*4 + x*4 + 3] = 255;
        orbitData.data[y*WID*4 + x*4 + 3] = 255;
    }
}
function resetValues() {
    var index;
    for(var x = 0; x < WID; ++x) {
        for(var y = 0; y < HEI; ++y) {
            index = y*WID*4 + x*4;
            imgData.data[index] = imgData.data[index+1] = imgData.data[index+2] = 0;
            points[x][y] = [(x-HWID) / HWID * frame + focus[0], (y-HHEI) / HHEI * frame + focus[1]];
            iterations[x][y] = 0;
        }
    }
    maxIterations = 0;
}
resetValues();

var iterate = [function mand(x, y, cx,cy) {
    return [x*x - y*y + cx, 2*x*y + cy];

},
function burningShip(x, y, cx, cy) {
    return [x*x - y*y + cx, Math.abs(2*x*y) + cy];
},
function cubic(x, y, cx, cy) {
    return [x*x*x - x*y*y - 2*x*y*y + cx, 3*x*x*y - y*y*y + cy];
},
function swan(x, y, cx, cy) {
    var yy = Math.abs(y);
    return [x*x - yy*yy + cx, 2*x*yy + cy];
},
function angel(x, y, cx, cy) {
    return [Math.abs(x*x - y*y) - cy, 2*x*y - cx];
},
];
var fractalCounter = 0;


function mandelbrot() {
    var xx, yy, tx, cx, cy;
    var i;
    var r, g, b;
    var index;
    var func = iterate[fractalCounter];
    var colors = colorScheme[scheme];

    for(var x = 0; x < WID; ++x) {
        for(var y = 0; y < HEI; ++y) {
            cx = (x - HWID) / HWID * frame + focus[0];
            cy = (y - HHEI) / HHEI * frame + focus[1];
            if(iterations[x][y] == maxIterations) {
                points[x][y] = func(points[x][y][0], points[x][y][1], cx, cy);
                if(points[x][y][0] * points[x][y][0] + points[x][y][1] * points[x][y][1] > 4) {
                    i = iterations[x][y];
                    r = (Math.cos(i*gradWid + colors[0] + offset)*0.5 + 0.5) * 255;
                    g = (Math.sin(i*gradWid + colors[1] + offset)*0.5 + 0.5) * 255;
                    b = (-Math.cos(i*gradWid + colors[2] + offset)*0.5 + 0.5) * 255;
                    index = y*WID*4 + x*4;
                    imgData.data[index] = r;
                    imgData.data[index + 1] = g;
                    imgData.data[index + 2] = b;
                }
                else {
                    ++iterations[x][y];
                }
            }
        }
    }
}
function updateView() {
    mandelbrot();
    ctx.putImageData(imgData,0,0);
    ++maxIterations;
}
var interval = setInterval(updateView, 0);


document.addEventListener("keydown", function(event) {
    if(mouse[0] > 0 && mouse[0] < WID && mouse[1] > 0 && mouse[1] < HEI) {
        switch(event.key) {
            case 'ArrowUp': case 'w':
                focus[1] -= frame*0.25;
                resetValues();
                break;
            case 'ArrowDown': case 's':
                focus[1] += frame*0.25;
                resetValues();
                break;
            case 'ArrowLeft': case 'a':
                focus[0] -= frame*0.25;
                resetValues();
                break;
            case 'ArrowRight': case 'd':
                focus[0] += frame*0.25;
                resetValues();
                break;
            case '=': case '+':
                frame -= frame/5.0;
                resetValues();
                break;
            case '-': case '_':
                frame += frame/4.0;
                resetValues();
                break;
            case 'Tab':
                frame = 2;
                focus[0] = focus[1] = 0;
                resetValues();
                break;
            case '?':
                console.log(focus[0] + ", " + focus[1] + ", " + frame + ", " + document.getElementById("maxIterations").value + ", " + gradWid + ", " + document.getElementById("offset").value + ", " + document.getElementById("colorScheme").value);
                break;
            case 'p':
                document.getElementById("coords").textContent = "./a.out " + ((mouse[0] / HWID - 1.0) * frame + focus[0]) + "  " + ((mouse[1] / HWID - 1.0) * frame + focus[1]);
                break;
        }
    }
});

view.addEventListener("click", function(event) {
    clickX = mouse[0];
    clickY = mouse[1];
    clickX = ((clickX) / HWID) - 1.0;
    clickY = ((clickY) / HHEI) - 1.0;
    focus[0] += clickX * frame;
    focus[1] += clickY * frame;
    frame *= 0.5;
    resetValues();
});

document.addEventListener("mousemove", function(event) {
    clickX = mouse[0] = event.clientX - offsetX;
    clickY = mouse[1] = event.clientY - offsetY;
    if(clickX > 0 && clickX < WID && clickY > 0 && clickY < HEI) {
        var cx = (clickX / HWID - 1.0)*frame + focus[0];
        var cy = (clickY / HHEI - 1.0)*frame + focus[1];
        var arr = [cx, cy];
        var func = iterate[fractalCounter];
        var x = 0;
        var y = 0;
        orbitCtx.putImageData(orbitData,0,0);
        orbitCtx.strokeStyle = "red";
        orbitCtx.beginPath();
        for(var i = 0; i < 2000; ++i) {
            // orbitCtx.beginPath();
            // orbitCtx.arc((arr[0] / 4.0 + 0.5) * WID, (arr[1] / 4.0 + 0.5) * HEI, 2, 0, TAU, false);
            // orbitCtx.fill();
            orbitCtx.lineTo((arr[0] / 4.0 + 0.5) * WID, (arr[1] / 4.0 + 0.5) * HEI);
            x += arr[0];
            y += arr[1];
            arr = func(arr[0], arr[1], cx, cy);
        }
        orbitCtx.stroke();
        x /= 2000;
        y /= 2000;
        orbitCtx.fillStyle = "yellow";
        orbitCtx.beginPath();
        orbitCtx.arc((x / 4.0 + 0.5) * WID, (y / 4.0 + 0.5) * HEI, 2, 0, TAU, false);
        orbitCtx.fill();

    }
});

document.getElementById("gradient").addEventListener("change", function() {
    gradWid = eval(document.getElementById("gradient").value);
    generateImage();
});

document.getElementById("offset").addEventListener("change", function() {
    offset = (document.getElementById("offset").value / 100.0) * TAU;
    generateImage();
});

document.getElementById("colorScheme").addEventListener("change", function() {
    scheme = eval(document.getElementById("colorScheme").value);
    generateImage();
});

fractalType.addEventListener("change", function() {
    fractalCounter = fractalType.value;
    focus[0] = focus[1] = 0;
    frame = 2;
    resetValues();
    generateReference();
});

function arr2d(x,y) {
    var tmp = new Array(x);
    for(var i = 0; i < x; ++i) {
        tmp[i] = new Array(y);
    }
    return tmp;
}

function generateImage() {
    var index, i;
    var colors = colorScheme[scheme];
    for(var x = 0; x < WID; ++x) {
        for(var y = 0; y < HEI; ++y) {
            if(iterations[x][y] != maxIterations) {
                i = iterations[x][y];
                r = (Math.cos(i*gradWid + colors[0] + offset)*0.5 + 0.5) * 255;
                g = (Math.sin(i*gradWid + colors[1] + offset)*0.5 + 0.5) * 255;
                b = (-Math.cos(i*gradWid + colors[2] + offset)*0.5 + 0.5) * 255;
                index = y*WID*4 + x*4;
                imgData.data[index] = r;
                imgData.data[index + 1] = g;
                imgData.data[index + 2] = b;
            }
        }
    }
}

function generateReference() {
    var arr = [0,0];
    var i;
    var index;
    var func = iterate[fractalCounter];
    var color;

    for(var x = 0; x < WID; ++x) {
        for(var y = 0; y < HEI; ++y) {
            // cx = (x - HWID) / HWID * frame + focus[0];
            // cy = (y - HHEI) / HHEI * frame + focus[1];
            cx = (x - HWID) / HWID * 2;
            cy = (y - HHEI) / HHEI * 2;
            arr[0] = cx;
            arr[1] = cy;
            i = 0;
            while(arr[0] * arr[0] + arr[1] * arr[1] < 4 && i < 1000) {
                arr = func(arr[0],arr[1], cx,cy);
                ++i;
            }
            color = (i == 1000) ? 0 : 255;
            index = y*WID*4 + x*4;
            orbitData.data[index] = color;
            orbitData.data[index + 1] = color;
            orbitData.data[index + 2] = color;
        }
    }
    orbitCtx.putImageData(orbitData,0,0);
}
generateReference();