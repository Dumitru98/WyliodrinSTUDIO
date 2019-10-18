import generic_raspberrypi from './../libraries/utils/generic_raspberrypi.js';
import update_components from './../libraries/utils/update_components.js';

let studio_n = null;
let device_n = null;
let simulator_n = null;

let lcd_library = {
	/**
	 * It sets the studio, device and simulator objects
	 * @param  {Object} studio The 'studio' object in the platform
	 * @param  {Object} device The 'device' object in the platform
	 * @param  {Object} simulator The 'simulator' object created for informations
	 */
	assign: function(studio, device, simulator) {
		studio_n = studio;
		device_n = device;
		simulator_n = simulator;
	},

	/**
	 * The 'lcd.create' function for the JS interpreter
	 * It assign the pin and sets it's state in the JSON of the parsed XML
	 * @param  {Integer} rs The register-select number pin from the RaspberryPi
	 * @param  {Integer} e The enable number pin from the RaspberryPi
	 * @param  {Object} data Contains the number pins for the data-bus for the LCD
	 */
	create: function(rs, e, data) {
		let correctPins = true;

		if (rs !== 21 || (e !== 1 && e !== 3) || 
			data.properties[0] !== 15 || 
			data.properties[1] !== 10 || 
			data.properties[2] !== 11 || 
			data.properties[3] !== 14) {
			correctPins = false;
		}

		if (correctPins) {
			let createLcd = true;
			
			if (generic_raspberrypi.dataLoaded.assignedPins.includes(rs)) {
				createLcd = false;
			}

			for (let pin of Object.keys(data.properties)) {
				if (generic_raspberrypi.dataLoaded.assignedPins.includes(data.properties[pin])) {
					createLcd = false;
				}
			}

			if (createLcd) {
				generic_raspberrypi.dataLoaded.assignedPins.push(rs);
				generic_raspberrypi.dataLoaded.assignedPins.push(e);

				for (let pin of Object.keys(data.properties)) {
					generic_raspberrypi.dataLoaded.assignedPins.push(data.properties[pin]);
				}

				for (let component of generic_raspberrypi.dataLoaded.pins[rs].components) {
					if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd') {
						generic_raspberrypi.dataLoaded.components[component].valid = true;
					}
				}
			} else {
				studio_n.console.write(device_n.id, `\r\n----------\r\nERROR: new LCD()\r\nYou can't assign a pin already assigned\r\n----------\r\n`);
				simulator_n.isRunning = false;
				device_n.properties.isRunning = false;
			}
		} else {
			studio_n.console.write(device_n.id, `\r\n----------\r\nERROR: new LCD()\r\nThe pins are not correct\r\n----------\r\n`);
			simulator_n.isRunning = false;
			device_n.properties.isRunning = false;
		}
	},

	/**
	 * The 'lcd.print' function for the JS interpreter
	 * It prints a text on LCD
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} value The text to be written on the LCD
	 */
	print: function(pin, value) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					let curRow = generic_raspberrypi.dataLoaded.components[component].curRow;
					let curCol = generic_raspberrypi.dataLoaded.components[component].curCol;

					for (let i = curCol; i < value.toString().length; i ++) {
						generic_raspberrypi.dataLoaded.components[component].segments[curRow][i] = value.toString()[i];
					}
				}
			}

			update_components();
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.clear' function for the JS interpreter
	 * It clears the LCD and free-up the memory
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	clear: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					for (let i = 0; i < generic_raspberrypi.dataLoaded.components[component].segments[0].length; i ++) {
						generic_raspberrypi.dataLoaded.components[component].segments[0][i] = '';
					}

					for (let i = 0; i < generic_raspberrypi.dataLoaded.components[component].segments[1].length; i ++) {
						generic_raspberrypi.dataLoaded.components[component].segments[1][i] = '';
					}
				}
			}

			update_components();
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
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					generic_raspberrypi.dataLoaded.components[component].curCol = 0;
					generic_raspberrypi.dataLoaded.components[component].curRow = 0;
				}
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.setCursor' function for the JS interpreter
	 * It sets the cursor to a given position
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {Integer} row The number of the row of the cursor on the LCD
	 * @param  {Integer} col The number of the colomn of the cursor on the LCD
	 */
	setCursor: function(pin, row, col) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					generic_raspberrypi.dataLoaded.components[component].curCol = col;
					generic_raspberrypi.dataLoaded.components[component].curRow = row;
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
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					if (generic_raspberrypi.dataLoaded.components[component].cursor === false) {
						generic_raspberrypi.dataLoaded.components[component].cursor = true;
					}
				}
			}

			update_components();
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
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					generic_raspberrypi.dataLoaded.components[component].cursor = false;
				}
			}

			update_components();
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.blink' function for the JS interpreter
	 * It enables the cursor blinking
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	blink: function(pin) {
		try {
			console.log('blink');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'lcd.noBlink' function for the JS interpreter
	 * It disables the cursor blinking
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	noBlink: function(pin) {
		try {
			console.log('noBlink');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.scrollDisplayLeft' function for the JS interpreter
	 * It scrolls the LCD to the left
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	scrollDisplayLeft: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					generic_raspberrypi.dataLoaded.components[component].shift += 1;
				}
			}

			update_components();
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'lcd.scrollDisplayRight' function for the JS interpreter
	 * It scrolls the LCD to the right
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	scrollDisplayRight: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					if (generic_raspberrypi.dataLoaded.components[component].shift > 0) {
						generic_raspberrypi.dataLoaded.components[component].shift -= 1;
					}
				}
			}

			update_components();
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
	 * The 'lcd.close' function for the JS interpreter
	 * It closes the LCD
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	close: function(pin) {
		try {
			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].name === 'lcd' && 
					generic_raspberrypi.dataLoaded.components[component].valid) {
					for (let pin of Object.keys(generic_raspberrypi.dataLoaded.pins)) {
						if (generic_raspberrypi.dataLoaded.components[generic_raspberrypi.dataLoaded.pins[pin].components[0]].name == 'lcd') {
							let index = generic_raspberrypi.dataLoaded.assignedPins.indexOf(pin);
							generic_raspberrypi.dataLoaded.assignedPins.splice(index, 1);
						}
					}

					generic_raspberrypi.dataLoaded.components[component].valid = false;
				}
			}
		} catch(e) {
			console.log(e);
		}
	}
}

export default lcd_library;