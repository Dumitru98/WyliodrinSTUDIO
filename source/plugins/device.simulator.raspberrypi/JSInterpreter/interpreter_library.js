import $ from 'jquery';
import _ from 'lodash';
import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

export default function interpreterLibrary (studio, device) {
	return function simulator (interpreter, scope) {
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

		let sleep = function(delay, callback) {
			setTimeout(function() {
				callback(true);
			}, delay);
		};

		let create = function(pin, state) {
			if (state && generic_raspberrypi.dataLoaded.pins[pin]) {
				generic_raspberrypi.dataLoaded.pins[pin].state = state;
			}
		};

		let read = function(type, pin) {
			try {
				console.log('read');
			} catch(e) {
				console.log(e);
			}
		};

		let readSync = function(type, pin) {
			try {
				let activeCircuit = true;

				for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
					if (generic_raspberrypi.components[component].active === false) {
						activeCircuit = false;
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

		let write = function(pin, type, value) {
			try {
				console.log('write ' + value.toString());
			} catch(e) {
				console.log(e);
			}
		};

		let writeSync = function(pin, type, value) {
			try {
				generic_raspberrypi.dataLoaded.pins[pin].value = value;

				if (generic_raspberrypi.dataLoaded.pins[pin].circuitInterruption === false) {
					for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
						if (generic_raspberrypi.dataLoaded.components[component].name === 'led') {
							generic_raspberrypi.dataLoaded.components[component].active = true;
							$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"] #color_path32').css({ fill: 'hsl(' + generic_raspberrypi.ledColors[generic_raspberrypi.dataLoaded.components[component].color] + ', 100%, 50%)' });
						}
					}
				} else {
					let activeCircuit = true;

					for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
						if (generic_raspberrypi.dataLoaded.components[component].active === false) {
							activeCircuit = false;
						}
					}

					if (activeCircuit) {
						for (let component of generic_raspberrypi.dataLoaded.pins[pin].components) {
							if (generic_raspberrypi.dataLoaded.components[component].name === 'led') {
								generic_raspberrypi.dataLoaded.components[component].active = true;
								$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"] #color_path32').css({ fill: 'hsl(' + generic_raspberrypi.ledColors[generic_raspberrypi.dataLoaded.components[component].color] + ', 100%, 50%)' });
							}
						}
					}
				}
			} catch(e) {
				console.log(e);
			}
		};

		let watch = function() {
			try {
				console.log('watch');
			} catch(e) {
				console.log(e);
			}
		};

		let unwatch = function() {
			try {
				console.log('unwatch');
			} catch(e) {
				console.log(e);
			}
		};

		let unwatchAll = function() {
			try {
				console.log('unwatchAll');
			} catch(e) {
				console.log(e);
			}
		};

		let direction = function() {
			try {
				console.log('direction');
			} catch(e) {
				console.log(e);
			}
		};

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

		let jsConsole = interpreter.createObjectProto(interpreter.OBJECT_PROTO);
		interpreter.setProperty(scope, 'console', jsConsole);
		interpreter.setProperty(jsConsole, 'log', interpreter.createNativeFunction(log));

		interpreter.setProperty(scope, 'sleep', interpreter.createAsyncFunction(sleep));

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
