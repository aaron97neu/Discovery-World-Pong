console.log("depth feed viewer:")

//import {morph, opponent as op} from "/js/opponent.js";
// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected to MQTT broker");
    client.subscribe("depth/feed");
}


// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}


var last_depth = "";
var last_rendered_depth = ""

const frame_width = 160
const frame_height = 192


// canvas for our depth camera image
d_canvas = document.getElementById("depth");
const d_ctx = d_canvas.getContext("2d");

// Positioning the depth image canvas
// d_canvas.width = canvas.width;
// d_canvas.height = canvas.height;
// d_canvas.style.left = canvas.style.left;
// d_canvas.style.top = canvas.style.top;
// d_canvas.style.position = 'absolute';

// d_canvas_width = d_canvas.width
// d_canvas_height = d_canvas.height

function myMethod(message) {
    if (message.destinationName === "depth/feed") {
        // console.log('received depth image')
        last_depth = (JSON.parse(message.payloadString)["feed"])
        requestAnimationFrame(render_loop)
        //console.log(depthFeedStr)
        //decoded = atob(rawfeed)
    }
}


function render_depth_feed(ctx, image_upscale = 3.6) {
    var image = new Image();
    image.src = 'data:image/jpg;base64,' + last_depth
    // We received the image from the depth camera via MQTT

    // You have to use image.onload so that you dont try to use the image before it exists
    image.onload = function () {
        // scale image_upscale to fit to the left of the pong screen
        // the left edge of yellow box / this image width
        image_upscale = (img_x - (0.1 * img_w)) / image.width;
        ctx.drawImage(image, 0,0, image.width * image_upscale, image.height * image_upscale)
    }


}


function init() {
    /*
    Basic housekeeping initialization. Makes sure the canvases we need
    exist, and do any precomputing or sizing that aren't model dependent.
    */
    // Create a client instance
    client = new Paho.MQTT.Client("localhost", 9001, "depthfeedviewer_module");
    // client = new Paho.MQTT.Client("192.168.2.214", 9001, "depthfeedviewer_module");
    // client = new Paho.MQTT.Client("mqtt-broker", 9001, "depthfeedviewer_module");

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = myMethod; // onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect});

    // canvas for our depth camera image
    d_canvas = document.getElementById("depth");
    const d_ctx = d_canvas.getContext("2d");

    // Positioning the canvases
    d_canvas.width = document.body.clientWidth*(.6) -(document.body.clientWidth/60); 
    d_canvas.height = document.body.clientHeight - 2*(document.body.clientHeight/60);
    
    d_canvas.style.left = (document.body.clientWidth/60)+'px';
    d_canvas.style.top = (document.body.clientWidth/120) + 'px';
    d_canvas.style.position = 'absolute';
    console.log("canvas.left is ")
    console.log(d_canvas.left)

    image_upscale = d_canvas.width / 225
    img_w = frame_width * image_upscale;
    img_h = frame_height * image_upscale;
    console.log("image_upscale:")
    console.log(image_upscale);

    // Save canvas dimensions
    d_canvas_width = d_canvas.width;
    d_canvas_height = d_canvas.height;

    img_x = d_canvas_width
    console.log(img_x)
    img_y = d_canvas_height - (img_h) - (img_h/10);
    console.log(img_y)

    // A listener to appropriately resize our canvases when the window size changes
    // window.addEventListener('resize', onWindowResizeV, false);

    initialized = true;
}
 

function render_loop() {
    if(last_depth && last_depth != last_rendered_depth) {
        const depth_ctx = d_canvas.getContext('2d')
        render_depth_feed(depth_ctx)
        last_rendered_depth = last_depth
    }

    requestAnimationFrame(render_loop)
}


render_depth_feed(d_ctx)


window.onload = init