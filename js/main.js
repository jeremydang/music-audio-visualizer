  
var ctx = new AudioContext();

if (!ctx) console.error('Web Audio API not supported :(');

var audio = document.getElementById('audioFile');  
var analyzer = ctx.createAnalyser(); 
analyzer.fftSize = 2048;
var bufferLength = analyzer.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

var visualizer = document.getElementById("visualizer");

var initialClick = false;

var canvas1 = document.getElementById("canvas-1");
var canvas2 = document.getElementById("canvas-2");
var canvas3 = document.getElementById("canvas-3");
var canvas4 = document.getElementById("canvas-4");
var canvas5 = document.getElementById("canvas-5");
var canvas6 = document.getElementById("canvas-6");

var canvasCtx1 = canvas1.getContext("2d");
var canvasCtx2 = canvas2.getContext("2d");
var canvasCtx3 = canvas3.getContext("2d");
var canvasCtx4 = canvas4.getContext("2d");
var canvasCtx5 = canvas5.getContext("2d");
var canvasCtx6 = canvas6.getContext("2d");

var canvasCtx = [canvasCtx1, canvasCtx2, canvasCtx3, canvasCtx4, canvasCtx5, canvasCtx6];

const canvasW = canvas1.width;

const canvasH = canvas1.height;



function update() {
    analyzer.getByteFrequencyData(dataArray);

    canvasCtx.forEach(canvas => { canvas.clearRect(0, 0, canvasW, canvasH) });

    var barWidth = (canvasW / bufferLength) * 30;
    var barHeight;
    var x = 0;

    var scaleFig = 1;
    for (var i = 0; i < bufferLength; i++) {
        var audioVar = dataArray[i] / 255;
        if (audioVar > 0.9) {
            scaleFig = audioVar;
        }

        barHeight = dataArray[i] / 1;

        canvasCtx.forEach(canvas => {
            canvas.fillStyle = 'white';
            canvas.fillRect(x, canvasH - barHeight / 2, barWidth, barHeight);
        });
        x += barWidth + 1;
    }
    visualizer.style.transform = "scale(" + (scaleFig) + ")";

}

function init() {
    var source = ctx.createMediaElementSource(audio);
    source.connect(analyzer);
    analyzer.connect(ctx.destination);
    audio.volume = 0.8;
}

function loop() {
    requestAnimationFrame(loop);
    update();
}

window.addEventListener('load', init);

var playBtn = document.getElementById("playBtn");

var volumeBtn = document.getElementById("volumeBtn")

function playBtnOnclick() {
    if (!initialClick){
        ctx.resume();
        initialClick = true;
        audio.play();
        loop();
    }
    
    if (audio.paused) {
        audio.play();
        playBtn.className = "fa fa-play icon";

    } else {
        audio.pause()
        playBtn.className = "fa fa-pause icon";
    }
}

function stopBtnOnclick() {
    audio.pause();
    audio.currentTime = 0;
    playBtn.className = "fa fa-play icon";

}

function volumeBtnOnclick() {
    if (audio.muted) {
        audio.muted = false;
        volumeBtn.className = "fa fa-volume-up icon";
    } else {
        audio.muted = true;
        volumeBtn.className = "fa fa-volume-off icon";

    }
}

var slider = document.getElementById("slider");

slider.oninput = function() {
    setVolume(slider.value / 100);
}


function setVolume(volume) {
    audio.volume = volume;
}
