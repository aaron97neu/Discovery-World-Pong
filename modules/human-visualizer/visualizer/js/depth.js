const DEBUG = 0;

// https://stackoverflow.com/a/23105310
// Draw image scaled to the screen and centered
function drawImageScaled(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

const d_canvas = document.getElementById("depth");
const d_ctx = d_canvas.getContext("2d");
let msg = document.getElementById("msg");
var img = new Image();

// Use image.onload so that we don't try to use the image before it exists
img.onload = function () {
    drawImageScaled(img, d_ctx);
}

let frameCounter = 0n;

const topic = "depth/feed";
const broker = "localhost";
const options = {
    clean: true,
    connectTimeout: 4000,
    port: 9001,
    clientId: "human-visualizer-" + Math.random().toString(16).slice(2)
};
const client = mqtt.connect("mqtt://" + broker, options);

client.on('connect', function () {
    msg.textContent = "Connected; Waiting for images...";
    client.subscribe(topic);
});

client.on("message", (topic, message) => {
    img.src = 'data:image/jpg;base64,' + (JSON.parse(message.toString())["feed"])
    frameCounter += 1n;
    if(DEBUG){
        msg.textContent = `Frames: ${frameCounter}`;
    }else{
        msg.textContent = ``;
    }
    
});
