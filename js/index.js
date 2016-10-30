var canvas;
var image_ori = null;
var image = null;
var blur_range = 10;

function upload(){
	canvas = document.getElementById("pic");
	var fileinput = document.getElementById("img");
	image = new SimpleImage(fileinput);
	image_ori = new SimpleImage(fileinput);
	image.drawTo(canvas);
}

function imageIsLoaded(image_ori) {
	if (image == null) {
		alert("Please upload your pic.");
		return false;
	}
	else if (!image.complete()) {
		return false;
	}
	else {
		return true;
	}
} 

function makeGray() {
	if (imageIsLoaded(image) ) { 
		doGray();
		image.drawTo(canvas);
	}
}

function makeRed() {
	if (imageIsLoaded(image) ) {
		doRed(); 
		image.drawTo(canvas);
	}
}

function makeRGB() {
	if (imageIsLoaded(image) ) {
		doRGB(); 
		image.drawTo(canvas);
	}
}

function makeRainbow() {
	if (imageIsLoaded(image) ) {
		doRainbow(); 
		image.drawTo(canvas);
	}
}

function makeBlur() {
	if (imageIsLoaded(image) ) {
		doBlur();
		image.drawTo(canvas);
	}
}

function doGray() {
	for (var pixel of image.values()) {
		var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
		pixel.setRed(avg);
		pixel.setGreen(avg);
		pixel.setBlue(avg);
	}
	image.drawTo(canvas);
}

function doRed() {
	for (var pixel of image.values()) {
		var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
		if (avg < 128) {
			pixel.setRed(2 * avg);
			pixel.setGreen(0);
			pixel.setBlue(0);
		}
		else {
			pixel.setRed(255);
			pixel.setGreen(2 * avg - 255);
			pixel.setBlue(2 * avg - 255);
		}
	}
	image.drawTo(canvas);
}

function doRGB() {
	var height = image.height;
	for (var pixel of image.values()) {
		var y = pixel.getY();
		var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
		if (avg < 128) {
			if (y < height / 3) {
				pixel.setRed(2 * avg);
				pixel.setGreen(0);
				pixel.setBlue(0);
			}
			else if (y < height / 3 * 2) {
				pixel.setRed(0);
				pixel.setGreen(2 * avg);
				pixel.setBlue(0);
			}
			else {
				pixel.setRed(0);
				pixel.setGreen(0);
				pixel.setBlue(2 * avg);
			}
		}
		else {
			if (y < height / 3) {
				pixel.setRed(255);
				pixel.setGreen(2 * avg - 255);
				pixel.setBlue(2 * avg - 255);
			}
			else if (y < height / 3 * 2) {
				pixel.setRed(2 * avg - 255);
				pixel.setGreen(255);
				pixel.setBlue(2 * avg - 255);
			}
			else {
				pixel.setRed(2 * avg - 255);
				pixel.setGreen(2 * avg - 255);
				pixel.setBlue(255);
			}
		}
	}
	image.drawTo(canvas);
}

// more generalized way to a color filter
function doRainbow() {
	var width = image.width;
	for (var pixel of image.values()) {
		var x = pixel.getX();
		var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
		if (x < width / 7) {
			doColor(pixel, 255, 0, 0, avg);
		}
		else if (x < width / 7 * 2) {
			doColor(pixel, 255, 165, 0, avg);
		}
		else if (x < width / 7 * 3) {
			doColor(pixel, 255, 255, 0, avg);
		}
		else if (x < width / 7 * 4) {
			doColor(pixel, 0, 255, 0, avg);
		}
		else if (x < width / 7 * 5) {
			doColor(pixel, 0, 0, 255, avg);
		}
		else if (x < width / 7 * 6) {
			doColor(pixel, 75, 0, 130, avg);
		}
		else {
			doColor(pixel, 128, 0, 128, avg);
		}
	}
	image.drawTo(canvas);
}

function doColor(pixel, r, g, b, avg) {
	if (avg < 128) {
		pixel.setRed(r / 127.5 * avg);
		pixel.setGreen(g / 127.5 * avg);
		pixel.setBlue(b / 127.5 * avg);
	}
	else {
		pixel.setRed((2 - r / 127.5) * avg + 2 * r - 255);
		pixel.setGreen((2 - g / 127.5) * avg + 2 * g - 255);
		pixel.setBlue((2 - b / 127.5) * avg + 2 * b - 255);
	}
}

function doBlur() {
	var copy = new SimpleImage(image);
	for (var pixel of copy.values()) {
		var x = pixel.getX();
		var y = pixel.getY();
		if (Math.random() > 0.5) {
			var new_x, new_y;
			if (Math.random() < 0.5) {
				new_x = x - blur_range * Math.random();
				if (new_x < 0) {
					new_x = 0;
				}
			}
			else {
				new_x = x + blur_range * Math.random();
				if (new_x > image.width - 1) {
					new_x = image.width - 1;
				}
			}
			if (Math.random() < 0.5) {
				new_y = y - blur_range * Math.random();
				if (new_y < 0) {
					new_y = 0;
				}
			}
			else {
				new_y = y + blur_range * Math.random();
				if (new_y > image.height - 1) {
					new_y = image.height - 1;
				}
			}
			image.setPixel(x, y, copy.getPixel(new_x, new_y));
		}
	}
	image.drawTo(canvas);
}

function doReset() {
	image_ori.drawTo(canvas);
	image = new SimpleImage(image_ori);
}

function doclear() {
	clear_helper(canvas);
}

function clear_helper(canvas) {
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}