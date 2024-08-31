const view = document.getElementById("view");
const ctx = view.getContext("2d");

const acceptButton = document.getElementById("accept");
const goTo = document.getElementById("goTo");

const WID = view.width;
const HEI = view.height;
const HWID = WID/2.0;
const HHEI = HEI/2.0;

const PI = Math.PI;
const TAU = PI * 2;



var gradWid = 0.07;
var offset = 0;

var imgData = ctx.getImageData(0,0,view.width,view.height);

// var frame = 1.7763568394002505e-10;
// var focus = [-0.2660503338339083,-0.6512455825148415];
var frame = 2;
var focus = [0,0];
var jframe = 2;
var jfocus = [0, 0];
var mode = true;

var colorScheme = [
    [0, TAU/3.0 + 0.5, 2*TAU/3.0 + 0.5],
    [0.5, TAU/3.0 + 0.5, 2*TAU/3.0],
    [ 2*TAU/3.0 + 0.5, 0.5, TAU/3.0 + 0.5],
    [1, TAU/3.0, 2*TAU/3.0],
    [0, PI/6.0, TAU/3.0],
    [0, -PI/6.0, -PI/3.0],
];
var scheme = 1;

var interest = [
    [-0.2660503338339083, -0.6512455825148415, 1.7763568394002505e-10, 2000, 0.008000000000000007, 12, 3],
    [-1.748625930629306, -0.0005440506728764318, 1.1368683772161603e-13, 2000, 0.04000000000000001, 53, 0],
    [0.3057918056579574, -0.02318924590146965, 4.440892098500626e-10, 2000, 0.01200000000000001, 76, 1],
    [-0.7573697199140275, -0.06977540697370262, 5.960464477539062e-7, 5000, 0.010000000000000009, 76, 4],
    [-0.1534930824574048, -1.0301857114913373, 9.313225746154785e-12, 2000, 0.066, 43, 2],
    [-0.16263715948295948, -1.0348103294352595, 0.0000076704585395277, 2000, 0.010000000000000009, 44, 0],
    [-0.16264311979200777, -1.0348063764230386, 1.8726705418768801e-10, 3000, 0.010000000000000009, 13, 4],
    [0.3146898906275587, -0.029527007639503285, 2.37389193643995e-12, 5000, 0.010000000000000009, 16, 2],
    [-0.17299394977944232, -0.6585550816037826, 9.5367431640625e-10, 2000, 0.008000000000000007, 0, 1],
    [-1.1843817752498047, -0.303608148286255, 1.1161986242990971e-13, 2000, 0.006000000000000005, 1, 3],
    [-1.1843816668266454, -0.30360730253488, 5.1529190156777083e-14, 5000, 0.0040000000000000036, 38, 1],
    [-0.10582470688436711, -0.921547672493117, 2.9103830456733704e-9, 2000, 0.014000000000000012, 0, 2],
    [-0.10582481912547122, -0.9215474543035115, 4.59177480789956e-12, 2000, 0.006000000000000005, 78, 0],
    [0.25085666884698743, -0.00003990053810981519, 0.0000013611294676837543, 5000, 0.0020000000000000018, 0, 1],
    [-0.7070106229372323, -0.3523227594194135, 5.820766091346741e-11, 5000, 0.0020000000000000018, 75, 0],
    [0.3512796084287401, -0.07440132727769604, 3.637978807091713e-12, 5000, 0.006000000000000005, 0, 3],
    [-0.1778303748042839, -0.6609004729918736, 1.1368683772161603e-12, 20000, 0.0020000000000000018, 42, 4],
    [-1.758250796999249, -0.012054476056779936, 3.725290298461914e-7, 4000, 0.001, 89, 4],
    [-1.7644226485958736, 0, 0.028823037615171177, 2000, 0.01, 89, 2],
    [-0.7161989526171237, -0.2845619239125935, 1.4551915228366852e-7, 5000, 0.002, 10, 3]
];

var mouse = [0,0];

var maxIterations = 2000;

// set alpha to 255;
for(var x = 0; x < WID; ++x) {
    for(var y = 0; y < HEI; ++y) {
        imgData.data[y*WID*4 + x*4 + 3] = 255;
    }
}


function mandelbrot() {
    var xx, yy, tx, cx, cy;
    var i;
    var r, g, b;
    var index;
    var colors = colorScheme[scheme];
    for(var x = 0; x < WID; ++x) {
        for(var y = 0; y < HEI; ++y) {
            xx = cx = (x - HWID) / HWID * frame + focus[0];
            yy = cy = (y - HHEI) / HHEI * frame + focus[1];
            for(i = 0; i < maxIterations && xx*xx + yy*yy < 4; ++i) {
                tx = xx;
                xx = xx*xx - yy*yy + cx;
                yy = 2*tx*yy + cy;
            }
            if(i == maxIterations) {
                r = g = b = 0;
            } else {
                r = (Math.cos(i*gradWid + colors[0] + offset)*0.5 + 0.5) * 255;
                g = (Math.sin(i*gradWid + colors[1] + offset)*0.5 + 0.5) * 255;
                b = (-Math.cos(i*gradWid + colors[2] + offset)*0.5 + 0.5) * 255;
            }
            index = y*WID*4 + x*4;
            imgData.data[index] = r;
            imgData.data[index + 1] = g;
            imgData.data[index + 2] = b;
        }
    }
}
function julia() {
    var xx, yy, tx, cx, cy;
    var i;
    var r, g, b;
    var index;
    colors = colorScheme[scheme];
    for(var x = 0; x < WID; ++x) {
        for(var y = 0; y < HEI; ++y) {
            xx = cx = (x - HWID) / HWID * jframe + jfocus[0];
            yy = cy = (y - HHEI) / HHEI * jframe + jfocus[1];
            for(i = 0; i < maxIterations && xx*xx + yy*yy < 4; ++i) {
                tx = xx;
                xx = xx*xx - yy*yy + focus[0];
                yy = 2*tx*yy + focus[1];
            }
            if(i == maxIterations) {
                r = g = b = 0;
            } else {
                r = (Math.cos(i*gradWid + colors[0] + offset)*0.5 + 0.5) * 255;
                g = (Math.sin(i*gradWid + colors[1] + offset)*0.5 + 0.5) * 255;
                b = (-Math.cos(i*gradWid + colors[2] + offset)*0.5 + 0.5) * 255;
            }
            index = y*WID*4 + x*4;
            imgData.data[index] = r;
            imgData.data[index + 1] = g;
            imgData.data[index + 2] = b;
        }
    }
}

function updateView() {
    if(mode)
        mandelbrot();
    else
        julia();
    ctx.putImageData(imgData,0,0);
}
updateView();


document.addEventListener("keydown", function(event) {
    if(mouse[0] > 400 && mouse[0] < 1100 && mouse[1] > 75 && mouse[1] < 775) {
        switch(event.key) {
            case 'ArrowUp': case 'w':
                if(mode || event.key == 'w')
                    focus[1] -= frame*0.25;
                else
                    jfocus[1] -= jframe*0.25;
                updateView();
                break;
            case 'ArrowDown': case 's':
                if(mode || event.key == 's')
                    focus[1] += frame*0.25;
                else
                    jfocus[1] += jframe*0.25;
                updateView();
                break;
            case 'ArrowLeft': case 'a':
                if(mode || event.key == 'a')
                    focus[0] -= frame*0.25;
                else
                    jfocus[0] -= jframe*0.25;
                updateView();
                break;
            case 'ArrowRight': case 'd':
                if(mode || event.key == 'd')
                    focus[0] += frame*0.25;
                else
                    jfocus[0] += jframe*0.25;
                updateView();
                break;
            case '=': case '+':
                if(mode || event.key == '+')
                    frame -= frame/5.0;
                else
                    jframe -= jframe/5.0;
                if(event.key != '+')
                    updateView();
                break;
            case '-': case '_':
                if(mode || event.key == '_')
                    frame += frame/4.0;
                else
                    jframe += jframe/4.0;
                if(event.key != '_')
                    updateView();
                break;
            case 'Tab':
                if(mode) {
                    frame = 2;
                    focus[0] = focus[1] = 0;
                } else {
                    jframe = 2;
                    jfocus[0] = jfocus[1] = 0;
                }
                updateView();
                break;
            case '?':
                console.log(focus[0] + ", " + focus[1] + ", " + frame + ", " + document.getElementById("maxIterations").value + ", " + gradWid + ", " + document.getElementById("offset").value + ", " + document.getElementById("colorScheme").value);
                break;
            case 'j':
                mode = !mode;
                console.log("Swapped");
                updateView();
                break;

        }
    }
});

document.addEventListener("click", function(event) {
    var clickX = mouse[0];
    var clickY = mouse[1];
    if(mouse[0] > 360 && mouse[0] < 960 && mouse[1] > 75 && mouse[1] < 675) {
        clickX = ((clickX - 360) / 300.0) - 1.0;
        clickY = ((clickY - 75) / 300.0) - 1.0;
        if(mode) {
            focus[0] += clickX * frame;
            focus[1] += clickY * frame;
            frame *= 0.5;
        }
        else {
            jfocus[0] += clickX * jframe;
            jfocus[1] += clickY * jframe;
            jframe *= 0.5;
        }
        updateView();
    }
});

document.addEventListener("mousemove", function(event) {
    mouse[0] = event.clientX;
    mouse[1] = event.clientY;
});

acceptButton.addEventListener("click", function() {
    maxIterations = eval(document.getElementById("maxIterations").value);
    gradWid = eval(document.getElementById("gradient").value);
    offset = (document.getElementById("offset").value / 100.0) * TAU;
    scheme = eval(document.getElementById("colorScheme").value);
    console.log(scheme);
    updateView();
});

goTo.addEventListener("change", function() {
    if(goTo.value == -1)
        return;
    var tmp = interest[goTo.value];
    mode = true;
    focus[0] = tmp[0];
    focus[1] = tmp[1];
    frame = tmp[2];
    maxIterations = tmp[3];
    gradWid = tmp[4];
    offset = (tmp[5] / 100.0) * TAU;
    scheme = tmp[6];

    document.getElementById("maxIterations").value = maxIterations;
    document.getElementById("gradient").value = tmp[4];
    document.getElementById("offset").value = tmp[5];
    document.getElementById("colorScheme").value = tmp[6];

    updateView();
});
