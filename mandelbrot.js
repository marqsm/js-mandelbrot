// variables for managing canvas etc.
var canvasEl = document.getElementById("screen"),
    context = canvasEl.getContext("2d"),
    width = canvasEl.width,
    scale,
    height = canvasEl.height,
    imageData = context.createImageData(width, height);

// Initial parameters for the fractal + variables
var min_re = -2.0,  // left edge
    max_re = 2.0,   // right edge
    min_im = -2.0,
    offsetX, offsetY;  // height


var setPixel = function(x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index    ] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

var getPixel = function(x, y) {
    var index = (x + y * imageData.width) * 4,
        pixel = {};
    pixel.r = imageData.data[index    ];
    pixel.g = imageData.data[index + 1];
    pixel.b = imageData.data[index + 2];
    pixel.a = imageData.data[index + 3];

}

var clearImageData = function() {
    var size = imageData.width * imageData.height * 4;
    for (var i = 0; i < size; i++) {
        imageData.data[i] = 0;
    }
}
var redraw = function() {
    context.putImageData(imageData, 0, 0);
}

var renderMandelbrot = function(min_re, max_re, min_im, maxIterations) {
    var max_im = min_im + (max_re - min_re) * imageData.height / imageData.width,
        re_factor = (max_re - min_re) / (imageData.width),
        im_factor = (max_im - min_im) / (imageData.height),
        c_im, c_re,
        z_re, z_im, z_re2, z_im2,
        isInside, n;

    for (var y = 0; y < imageData.height; y++) {
        c_im = max_im - y * im_factor;      // just linear interpolation

        for (var x = 0; x < imageData.width; x++) {
            c_re = min_re + x * re_factor   // Just linear interpolation

            // temp variables to check for the interations, is point in set?
            z_re = c_re;
            z_im = c_im;
            isInside = true;
            for (n = 0; n < maxIterations; ++n) {
                z_re2 = z_re * z_re;
                z_im2 = z_im * z_im;
                if (z_re2 + z_im2 > 4) {
                    isInside = false;
                    break;
                }
                z_im = 2 * z_re * z_im + c_im;
                z_re = z_re2  - z_im2  + c_re;
            }
            if (!isInside) {
                setPixel(x, y, n * (256 / maxIterations), n * (256 / maxIterations), n * (64 / maxIterations), 255)
            }
        }
    }
}

var drawMandelbrot = function(min_re, max_re, min_im, maxIterations) {
    clearImageData();
    renderMandelbrot(min_re, max_re, min_im, maxIterations);
    redraw();
}


var drawJulia = function(xs, ys) {
    var z = {},
        x, y,
        scaling = 100,
        offset = 0.5;

    for (var i = 0; i < ys; i++) {
        for (var j = 0; j < xs; j++) {

        }
    }
}

var iter = 1;
var animate = function() {
    var regAnimFrame = window.requestAnimationFrame;

    regAnimFrame(animate);

    if (iter < 50) {
        iter += 1;
        drawMandelbrot(min_re, max_re, min_im, iter);

    }
}

console.log(min_re, max_re, min_im);
drawMandelbrot(min_re, max_re, min_im, 30);

// get n:th value from steps-length iterated series between a and b.
var getIteratedValue = function(a, b, steps, n) {
    var max = Math.max(a, b),
        min = Math.min(a, b),
        delta = (max - min) / steps,
        targetStepValue = min + delta * targetStep;

    return targetStepValue;
}

//animate();
canvasEl.addEventListener('click', function(event) {
    var d_re, d_im,
        offsetX, offsetY,
        zoomRate = 2;

        // var max_im = min_im + (max_re - min_re) * imageData.height / imageData.width,
        // re_factor = (max_re - min_re) / (imageData.width),
        // im_factor = (max_im - min_im) / (imageData.height),


    offsetX = event.offsetX - imageData.width / 2;
    offsetY = event.offsetY - imageData.height / 2;
    // _max_im = min_im + (max_re - min_re) * imageData.height / imageData.width;
    // offset_re = getIteratedValue(min_re, max_re, imageData.width, offsetX);
    // offset_im = getIteratedValue(min_im, _max_im, imageData.width, offsetY);

    console.log(offsetX, offsetY);

    d_re = (max_re - min_re) ;
    d_im = d_re;

    min_re += Math.abs(d_re / imageData.width * offsetX / zoomRate);
    max_re -= Math.abs(d_re / imageData.width * (imageData.width / 2 - offsetX) / zoomRate);
    min_im += Math.abs(d_re / imageData.height * offsetY / zoomRate);
    // min_re = min_re + Math.abs((offsetX - imageData.width / 2) / imageData.width) ;
    // max_re = max_re - Math.abs((offsetX + 200 - imageData.width / 2) / imageData.width) * d_re;
    // min_im = min_im + Math.abs((offsetY - imageData.height/ 2) / imageData.height) * d_re;
    console.log(min_re, max_re, min_im);
    drawMandelbrot(min_re, max_re, min_im, 85);

});