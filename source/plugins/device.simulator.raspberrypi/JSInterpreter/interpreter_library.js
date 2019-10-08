import $ from 'jquery';
import _ from 'lodash';
import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

/**
 * The function structure needed for the JS interpreter
 * @param  {Object} studio The 'studio' object in the platform
 * @param  {Object} device The 'device' object in the platform
 */
export default function interpreterLibrary (studio, device) {
	
	/**
	 * Set the functions for the JS interpreter
	 * @param  {Object} interpreter The interpreter created in 'index.js'
	 * @param  {Object} scope The name of the root object used by the interpreter
	 */
	return function simulator (interpreter, scope) {

		/**
		 * The 'console.log' function for the JS interpreter
		 * It shows the text given in the console of the platform
		 * @param  {String/Object} text The text received to be showed in the STUDIO console
		 */
		let consoleLog = function (text) {
			try {
				if (_.isObject(text)) {
					text = JSON.stringify (text);
				}

				studio.console.write(device.id, text + '\r\n');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * The 'sleep' function for the JS interpreter
		 * It makes the program to stop for a number of milliseconds
		 * @param  {Integer} delay The number of milliseconds to be waited
		 */
		let sleep = function(delay, callback) {
			setTimeout(function() {
				callback(true);
			}, delay);
		};

		/**
		 * The 'onoff.Gpio.create' function for the JS interpreter
		 * It sets the state of the a pin in the JSON of the parsed XML
		 * @param  {Integer} pin The number of the pin from the RaspberryPi
		 * @param  {String} state The state of the pin, 'in' or 'out'
		 */
		let onoffGpioCreate = function(pin, state) {
			if (state && generic_raspberrypi.dataLoaded.pins[pin]) {
				generic_raspberrypi.dataLoaded.pins[pin].state = state;
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.read' function for the JS interpreter
		 * It returns the value received by the pin (ASYNCHRONOUS)
		 * @param  {Integer} pin The number of the pin from the RaspberryPi
		 * @param  {String} state The state of the pin, 'in' or 'out'
		 */
		let onoffGpioRead = function(pin, state) {
			try {
				console.log('read');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * The 'onoff.Gpio.readSync' function for the JS interpreter
		 * It returns the value received by the pin (SYNCHRONOUS)
		 * @param  {Integer} pin The number of the pin from the RaspberryPi
		 * @param  {String} state The state of the pin, 'in' or 'out'
		 */
		let onoffGpioReadSync = function(pin, state) {
			try {
				let activeCircuit = true;

				for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
					if (generic_raspberrypi.dataLoaded.components[component].active === false) {
						activeCircuit = false;
						break;
					}
				}

				if (activeCircuit) {
					return 1;
				} else {
					return 0;
				}
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.write' function for the JS interpreter
		 * It sets the pin and the other components associated to the value given (ASYNCHRONOUS)
		 * @param  {Integer} pin The number of the pin from the RaspberryPi
		 * @param  {String} state The state of the pin, 'in' or 'out'
		 * @param  {Integer} value The value to be written, '0' or '1'
		 */
		let onoffGpioWrite = function(pin, state, value) {
			try {
				console.log('write ' + value.toString());
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * The 'onoff.Gpio.write' function for the JS interpreter
		 * It sets the pin and the other components associated to the value given (SYNCHRONOUS)
		 * @param  {Integer} pin The number of the pin from the RaspberryPi
		 * @param  {String} state The state of the pin, 'in' or 'out'
		 * @param  {Integer} value The value to be written, '0' or '1'
		 */
		let onoffGpioWriteSync = function(pin, state, value) {
			try {
				generic_raspberrypi.dataLoaded.pins[pin].value = value;

				console.log(generic_raspberrypi.dataLoaded.pins[pin].components);

				// Check if the circuit associated to the given pin is valid
				let validCircuit = true;
				for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
					if (generic_raspberrypi.dataLoaded.components[component].valid === false) {
						validCircuit = false;
						break;
					}
				}

				// Set the components associated to te pin
				if (validCircuit && value) {
					let activeCircuit = true;

					// Check if there is any switch in the circuit, and if so, check if it is pressed
					if (generic_raspberrypi.dataLoaded.pins[pin].circuitInterruption === true) {
						for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
							if (generic_raspberrypi.dataLoaded.components[component].active === false) {
								activeCircuit = false;
							}
						}
					}

					// If the circuit is complete, set the vhigh value for every LED
					if (activeCircuit) {
						for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
							if (generic_raspberrypi.dataLoaded.components[component].name === 'led') {
								generic_raspberrypi.setLed(component, 1);
							}
						}
					} 
				} else if (validCircuit && value === false) {
					// Set the low value for every LED
					for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
						if (generic_raspberrypi.dataLoaded.components[component].name === 'led') {
							generic_raspberrypi.setLed(component, 0);
						}
					}
				}
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.watch' function for the JS interpreter
		 * It watches the change of value of the given pin and make an interruption
		 */
		let onoffGpioWatch = function() {
			try {
				console.log('watch');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.unwatch' function for the JS interpreter
		 * Itun watches the change of value of the given pin
		 */
		let onoffGpioUnwatch = function() {
			try {
				console.log('unwatch');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.unwatch' function for the JS interpreter
		 * It unwatches the change of value of all the pins
		 */
		let onoffGpioUnwatchAll = function() {
			try {
				console.log('unwatchAll');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.direction' function for the JS interpreter
		 * It returns the current state of the given pin
		 */
		let onoffGpioDirection = function() {
			try {
				console.log('direction');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.setDirection' function for the JS interpreter
		 * It sets the new state of the given pin
		 */
		let onoffGpioSetDirection = function() {
			try {
				console.log('setDirection');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.activeLow' function for the JS interpreter
		 * ---------------------------
		 */
		let onoffGpioActiveLow = function() {
			try {
				console.log('activeLow');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'onoff.Gpio.activeLow' function for the JS interpreter
		 * ---------------------------
		 */
		let onoffGpioSetActiveLow = function() {
			try {
				console.log('setActiveLow');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.print' function for the JS interpreter
		 * It prints a text on LCD
		 */
		let lcdPrint = function(value) {
			try {
				console.log('print');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.clear' function for the JS interpreter
		 * It clears the LCD
		 */
		let lcdClear = function() {
			try {
				console.log('clear');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.home' function for the JS interpreter
		 * It sets the cursore to start
		 */
		let lcdHome = function() {
			try {
				console.log('home');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.setCursor' function for the JS interpreter
		 * It sets the cursor to a given position
		 */
		let lcdSetCursor = function(row, col) {
			try {
				console.log('setCursor');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.cursor' function for the JS interpreter
		 * It return the current position of the cursor
		 */
		let lcdCursor = function() {
			try {
				console.log('cursor');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.noCursor' function for the JS interpreter
		 * It deletes the cursor
		 */
		let lcdNoCursor = function() {
			try {
				console.log('noCursor');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.blink' function for the JS interpreter
		 * It makes the LCD to blink
		 */
		let lcdBlink = function() {
			try {
				console.log('blink');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.noBlink' function for the JS interpreter
		 * It stops the LCD from blinking
		 */
		let lcdNoBlink = function() {
			try {
				console.log('noBlink');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.scrollDisplayLeft' function for the JS interpreter
		 * It scrolls the LCD to the left
		 */
		let lcdScrollDisplayLeft = function() {
			try {
				console.log('scrollDisplayLeft');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.scrollDisplayRight' function for the JS interpreter
		 * It scrolls the LCD to the right
		 */
		let lcdScrollDisplayRight = function() {
			try {
				console.log('scrollDisplayRight');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.leftToRight' function for the JS interpreter
		 * ---------------------------
		 */
		let lcdLeftToRight = function() {
			try {
				console.log('leftToRight');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.rightToLeft' function for the JS interpreter
		 * ---------------------------
		 */
		let lcdRightToLeft = function() {
			try {
				console.log('rightToLeft');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.autoscroll' function for the JS interpreter
		 * It lets the LCD to autoscroll
		 */
		let lcdAutoscroll = function() {
			try {
				console.log('autoscroll');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.noAutoscroll' function for the JS interpreter
		 * It stops the autoscroll
		 */
		let lcdNoAutoscroll = function() {
			try {
				console.log('noAutoscroll');
			} catch(e) {
				console.log(e);
			}
		};

		/**
		 * --- NOT YET IMPLEMENTED ---
		 * The 'lcd.close' function for the JS interpreter
		 * It closes the LCD
		 */
		let lcdClose = function() {
			try {
				console.log('close');
			} catch(e) {
				console.log(e);
			}
		};

		// Create for the JS interpreter the object 'console' and set the function 'log' over it
		let jsConsole = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		interpreter.setProperty(scope, 'console', jsConsole);
		interpreter.setProperty(jsConsole, 'log', interpreter.createNativeFunction(consoleLog));

		// Set the function 'sleep'
		interpreter.setProperty(scope, 'sleep', interpreter.createAsyncFunction(sleep));

		// Create the object 'onoff' with the given structure and set all the functions
		let onoff = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		let Gpio = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		interpreter.setProperty(scope, 'onoff', onoff);
		interpreter.setProperty(onoff, 'Gpio', Gpio);
		interpreter.setProperty(Gpio, 'create', interpreter.createNativeFunction(onoffGpioCreate));
		interpreter.setProperty(Gpio, 'read', interpreter.createNativeFunction(onoffGpioRead));
		interpreter.setProperty(Gpio, 'readSync', interpreter.createNativeFunction(onoffGpioReadSync));
		interpreter.setProperty(Gpio, 'write', interpreter.createNativeFunction(onoffGpioWrite));
		interpreter.setProperty(Gpio, 'writeSync', interpreter.createNativeFunction(onoffGpioWriteSync));
		interpreter.setProperty(Gpio, 'watch', interpreter.createNativeFunction(onoffGpioWatch));
		interpreter.setProperty(Gpio, 'unwatch', interpreter.createNativeFunction(onoffGpioUnwatch));
		interpreter.setProperty(Gpio, 'unwatchAll', interpreter.createNativeFunction(onoffGpioUnwatchAll));
		interpreter.setProperty(Gpio, 'direction', interpreter.createNativeFunction(onoffGpioDirection));
		interpreter.setProperty(Gpio, 'setDirection', interpreter.createNativeFunction(onoffGpioSetDirection));
		interpreter.setProperty(Gpio, 'activeLow', interpreter.createNativeFunction(onoffGpioActiveLow));
		interpreter.setProperty(Gpio, 'setActiveLow', interpreter.createNativeFunction(onoffGpioSetActiveLow));

		// Create the object lcd with the given structure and set all the functions
		let lcd = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		interpreter.setProperty(scope, 'lcd', lcd);
		interpreter.setProperty(lcd, 'print', interpreter.createNativeFunction(lcdPrint));
		interpreter.setProperty(lcd, 'clear', interpreter.createNativeFunction(lcdClear));
		interpreter.setProperty(lcd, 'home', interpreter.createNativeFunction(lcdHome));
		interpreter.setProperty(lcd, 'setCursor', interpreter.createNativeFunction(lcdSetCursor));
		interpreter.setProperty(lcd, 'cursor', interpreter.createNativeFunction(lcdCursor));
		interpreter.setProperty(lcd, 'noCursor', interpreter.createNativeFunction(lcdNoCursor));
		interpreter.setProperty(lcd, 'blink', interpreter.createNativeFunction(lcdBlink));
		interpreter.setProperty(lcd, 'noBlink', interpreter.createNativeFunction(lcdNoBlink));
		interpreter.setProperty(lcd, 'scrollDisplayLeft', interpreter.createNativeFunction(lcdScrollDisplayLeft));
		interpreter.setProperty(lcd, 'scrollDisplayRight', interpreter.createNativeFunction(lcdScrollDisplayRight));
		interpreter.setProperty(lcd, 'leftToRight', interpreter.createNativeFunction(lcdLeftToRight));
		interpreter.setProperty(lcd, 'rightToLeft', interpreter.createNativeFunction(lcdRightToLeft));
		interpreter.setProperty(lcd, 'autoscroll', interpreter.createNativeFunction(lcdAutoscroll));
		interpreter.setProperty(lcd, 'noAutoscroll', interpreter.createNativeFunction(lcdNoAutoscroll));
		interpreter.setProperty(lcd, 'close', interpreter.createNativeFunction(lcdClose));
	}
}
