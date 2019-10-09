// This is the 'onoff.Gpio' constructor for the JS interpreter
let lcd = 
`libraries['lcd'] = function(object) {
	this.rs = object.rs;
	this.e = object.e;
	this.data = object.data;
	this.cols = object.cols;
	this.rows = object.rows;

	this.print = function(value) {
		lcd_library.print(this.rs, value);
	};

	this.clear = function() {
		lcd_library.clear(this.rs);
	};

	this.home = function() {
		lcd_library.home(this.rs);
	};

	this.setCursor = function(col, row) {
		lcd_library.setCursor(this.rs, col, row);
	};

	this.cursor = function() {
		lcd_library.cursor(this.rs);
	};

	this.noCursor = function() {
		lcd_library.noCursor(this.rs);
	};

	this.blink = function() {
		lcd_library.blink();
	};

	this.noBlink = function() {
		lcd_library.noBlink();
	};

	this.scrollDisplayLeft = function() {
		return lcd_library.scrollDisplayLeft();
	};

	this.scrollDisplayRight = function() {
		return lcd_library.scrollDisplayRight();
	};

	this.leftToRight = function() {
		return lcd_library.leftToRight();
	};

	this.rightToLeft = function() {
		return lcd_library.rightToLeft();
	};

	this.autoscroll = function() {
		return lcd_library.autoscroll();
	};

	this.noAutoscroll = function() {
		return lcd_library.noAutoscroll();
	};

	this.close = function() {
		return lcd_library.close();
	};
};\n\n`;

export default lcd;