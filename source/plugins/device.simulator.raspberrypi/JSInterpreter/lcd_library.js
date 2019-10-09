import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

let lcd_library = {
	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.print' function for the JS interpreter
	 * It prints a text on LCD
	 */
	print: function(value) {
		try {
			console.log('print');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.clear' function for the JS interpreter
	 * It clears the LCD
	 */
	clear: function() {
		try {
			console.log('clear');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.home' function for the JS interpreter
	 * It sets the cursor to position (0, 0)
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	home: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.components[component].name === 'lcd') {
					generic_raspberrypi.components[component].curCol = 0;
					generic_raspberrypi.components[component].curRow = 0;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.setCursor' function for the JS interpreter
	 * It sets the cursor to a given position
	 * @param  {Integer} row The number of the row of the cursor
	 * @param  {Integer} col The number of the colomn of the cursor
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	setCursor: function(row, col, pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.components[component].name === 'lcd') {
					generic_raspberrypi.components[component].curCol = col;
					generic_raspberrypi.components[component].curRow = row;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.cursor' function for the JS interpreter
	 * It enables the cursor
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	cursor: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.components[component].name === 'lcd') {
					generic_raspberrypi.components[component].cursor = true;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.noCursor' function for the JS interpreter
	 * It disables the cursor
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	noCursor: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.components[component].name === 'lcd') {
					generic_raspberrypi.components[component].cursor = false;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.blink' function for the JS interpreter
	 * It enables the cursor blinking
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	blink: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.components[component].name === 'lcd') {
					generic_raspberrypi.components[component].blink = true;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.noBlink' function for the JS interpreter
	 * It disables the cursor blinking
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	noBlink: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.components[component].name === 'lcd') {
					generic_raspberrypi.components[component].blink = false;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.scrollDisplayLeft' function for the JS interpreter
	 * It scrolls the LCD to the left
	 */
	scrollDisplayLeft: function() {
		try {
			console.log('scrollDisplayLeft');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.scrollDisplayRight' function for the JS interpreter
	 * It scrolls the LCD to the right
	 */
	scrollDisplayRight: function() {
		try {
			console.log('scrollDisplayRight');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.leftToRight' function for the JS interpreter
	 * ---------------------------
	 */
	leftToRight: function() {
		try {
			console.log('leftToRight');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.rightToLeft' function for the JS interpreter
	 * ---------------------------
	 */
	rightToLeft: function() {
		try {
			console.log('rightToLeft');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.autoscroll' function for the JS interpreter
	 * It lets the LCD to autoscroll
	 */
	autoscroll: function() {
		try {
			console.log('autoscroll');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.noAutoscroll' function for the JS interpreter
	 * It stops the autoscroll
	 */
	noAutoscroll: function() {
		try {
			console.log('noAutoscroll');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.close' function for the JS interpreter
	 * It closes the LCD
	 */
	close: function() {
		try {
			console.log('close');
		} catch(e) {
			console.log(e);
		}
	}
}

export default lcd_library;