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
		let log = function (text) {
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
		let create = function(pin, state) {
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
		let read = function(pin, state) {
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
		let readSync = function(pin, state) {
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
		let write = function(pin, state, value) {
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
		let writeSync = function(pin, state, value) {
			try {
				generic_raspberrypi.dataLoaded.pins[pin].value = value;

				// Check if the circuit associated to the given pin is valid
				let validCircuit = true;
				for (let component of Object.keys(generic_raspberrypi.dataLoaded.pins[pin].components)) {
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
								generic_raspberrypi.dataLoaded.components[component].active = true;
								$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"] #color_path32').css({ fill: 'hsl(' + generic_raspberrypi.ledColors[generic_raspberrypi.dataLoaded.components[component].color] + ', 100%, 50%)' });
							}
						}
					} 
				} else if (validCircuit && value === false) {
					// Set the low value for every LED
					for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
						if (generic_raspberrypi.dataLoaded.components[component].name === 'led') {
							generic_raspberrypi.dataLoaded.components[component].active = false;
							$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"] #color_path32').css({ fill: 'hsl(' + generic_raspberrypi.ledColors[generic_raspberrypi.dataLoaded.components[component].color] + ', 25%, 50%)' });
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
		let watch = function() {
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
		let unwatch = function() {
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
		let unwatchAll = function() {
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
		let direction = function() {
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
		let setDirection = function() {
			try {
				console.log('setDirection');
			} catch(e) {
				console.log(e);
			}
		};

		let activeLow = function() {
			try {
				console.log('activeLow');
			} catch(e) {
				console.log(e);
			}
		};

		let setActiveLow = function() {
			try {
				console.log('setActiveLow');
			} catch(e) {
				console.log(e);
			}
		};

		// Create for the JS interpreter the object 'console' and set the function 'log' over it
		let jsConsole = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		interpreter.setProperty(scope, 'console', jsConsole);
		interpreter.setProperty(jsConsole, 'log', interpreter.createNativeFunction(log));

		// Set the function 'sleep'
		interpreter.setProperty(scope, 'sleep', interpreter.createAsyncFunction(sleep));

		// Create the object 'onoff' with the given structure and set all the functions
		let onoff = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		let Gpio = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		interpreter.setProperty(scope, 'onoff', onoff);
		interpreter.setProperty(onoff, 'Gpio', Gpio);
		interpreter.setProperty(Gpio, 'create', interpreter.createNativeFunction(create));
		interpreter.setProperty(Gpio, 'read', interpreter.createNativeFunction(read));
		interpreter.setProperty(Gpio, 'readSync', interpreter.createNativeFunction(readSync));
		interpreter.setProperty(Gpio, 'write', interpreter.createNativeFunction(write));
		interpreter.setProperty(Gpio, 'writeSync', interpreter.createNativeFunction(writeSync));
		interpreter.setProperty(Gpio, 'watch', interpreter.createNativeFunction(watch));
		interpreter.setProperty(Gpio, 'unwatch', interpreter.createNativeFunction(unwatch));
		interpreter.setProperty(Gpio, 'unwatchAll', interpreter.createNativeFunction(unwatchAll));
		interpreter.setProperty(Gpio, 'direction', interpreter.createNativeFunction(direction));
		interpreter.setProperty(Gpio, 'setDirection', interpreter.createNativeFunction(setDirection));
		interpreter.setProperty(Gpio, 'activeLow', interpreter.createNativeFunction(activeLow));
		interpreter.setProperty(Gpio, 'setActiveLow', interpreter.createNativeFunction(setActiveLow));
	}
}
