import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

let onoff_library = {
	/**
	 * The 'onoff.Gpio.create' function for the JS interpreter
	 * It sets the state of the a pin in the JSON of the parsed XML
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} state The state of the pin, 'in' or 'out'
	 */
	create: function(pin, state) {
		if (generic_raspberrypi.dataLoaded.pins[pin] && state) {
			generic_raspberrypi.dataLoaded.pins[pin].state = state;
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'onoff.Gpio.read' function for the JS interpreter
	 * It returns the value received by the pin (ASYNCHRONOUS)
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} state The state of the pin, 'in' or 'out'
	 */
	read: function(pin, state) {
		try {
			console.log('read');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'onoff.Gpio.readSync' function for the JS interpreter
	 * It returns the value received by the pin (SYNCHRONOUS)
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} state The state of the pin, 'in' or 'out'
	 */
	readSync: function(pin, state) {
		try {
			let activeCircuit = true;

			for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
				if (generic_raspberrypi.dataLoaded.components[component].active === false) {
					activeCircuit = false;
					break;
				}
			}

			if (activeCircuit && generic_raspberrypi.dataLoaded.pins[pin].activeLow === false) {
				return 1;
			} else {
				return 0;
			}
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'onoff.Gpio.write' function for the JS interpreter
	 * It sets the pin and the other components associated to the value given (ASYNCHRONOUS)
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} state The state of the pin, 'in' or 'out'
	 * @param  {Integer} value The value to be written, '0' or '1'
	 */
	write: function(pin, state, value) {
		try {
			console.log('write ' + value.toString());
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'onoff.Gpio.write' function for the JS interpreter
	 * It sets the pin and the other components associated to the value given (SYNCHRONOUS)
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} state The state of the pin, 'in' or 'out'
	 * @param  {Integer} value The value to be written, '0' or '1'
	 */
	writeSync: function(pin, state, value) {
		try {
			let output = value;

			// Invert values in case of activeLow
			if (generic_raspberrypi.dataLoaded.pins[pin].activeLow) {
				if (output) {
					output = 0;
				} else {
					output = 1;
				}
			}

			generic_raspberrypi.dataLoaded.pins[pin].value = output;

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
			if (validCircuit && output) {
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
			} else if (validCircuit && output === false) {
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
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'onoff.Gpio.watch' function for the JS interpreter
	 * It watches the change of value of the given pin and make an interruption
	 */
	watch: function() {
		try {
			console.log('watch');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'onoff.Gpio.unwatch' function for the JS interpreter
	 * Itun watches the change of value of the given pin
	 */
	unwatch: function() {
		try {
			console.log('unwatch');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'onoff.Gpio.unwatch' function for the JS interpreter
	 * It unwatches the change of value of all the pins
	 */
	unwatchAll: function() {
		try {
			console.log('unwatchAll');
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'onoff.Gpio.direction' function for the JS interpreter
	 * It returns the current state of the given pin
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	direction: function(pin) {
		try {
			return generic_raspberrypi.dataLoaded.pins[pin].state;
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * --- NOT YET IMPLEMENTED ---
	 * The 'onoff.Gpio.setDirection' function for the JS interpreter
	 * It sets the new state of the given pin
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {String} value The new state of the pin
	 */
	setDirection: function(pin, value) {
		try {
			generic_raspberrypi.dataLoaded.pins[pin].state = value;
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'onoff.Gpio.activeLow' function for the JS interpreter
	 * It returns the value of activeLow of the given pin
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 */
	activeLow: function(pin) {
		try {
			return generic_raspberrypi.dataLoaded.pins[pin].activeLow;
		} catch(e) {
			console.log(e);
		}
	},

	/**
	 * The 'onoff.Gpio.setActiveLow' function for the JS interpreter
	 * It sets the value of activeLow to the given pin
	 * @param  {Integer} pin The number of the pin from the RaspberryPi
	 * @param  {Bool} value The value if the input/output should be inverted
	 */
	setActiveLow: function(pin, value) {
		try {
			generic_raspberrypi.dataLoaded.pins[pin].activeLow = value;
		} catch(e) {
			console.log(e);
		}
	}
}

export default onoff_library;