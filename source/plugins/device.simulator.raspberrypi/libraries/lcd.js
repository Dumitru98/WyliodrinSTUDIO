// This is the 'onoff.Gpio' constructor for the JS interpreter
let lcd = 
`libraries['lcd'] = function(rs, e, data, cols, rows) {
	this.rs = rs;
	this.e = e;
	this.data = data;
	this.cols = cols;
	this.rows = rows;

	this.print = function(value) {
		return lcd.print(value, this.rs);
	};

	this.clear = function() {
		return lcd.clear();
	};

	this.home = function() {
		return lcd.home(this.rs);
	};

	this.setCursor = function(col, row) {
		return lcd.setCursor(col, row, this.rs);
	};

	this.cursor = function() {
		return lcd.cursor(this.rs);
	};

	this.noCursor = function() {
		return lcd.noCursor(this.rs);
	};

	this.blink = function() {
		return lcd.blink();
	};

	this.noBlink = function() {
		return lcd.noBlink();
	};

	this.scrollDisplayLeft = function() {
		return lcd.scrollDisplayLeft();
	};

	this.scrollDisplayRight = function() {
		return lcd.scrollDisplayRight();
	};

	this.leftToRight = function() {
		return lcd.leftToRight();
	};

	this.rightToLeft = function() {
		return lcd.rightToLeft();
	};

	this.autoscroll = function() {
		return lcd.autoscroll();
	};

	this.noAutoscroll = function() {
		return lcd.noAutoscroll();
	};

	this.close = function() {
		return lcd.close();
	};
};\n\n`;

export default lcd;