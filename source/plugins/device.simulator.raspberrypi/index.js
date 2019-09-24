let studio = null;
let simulator = {
	connected: false,
	isRunning: false,
	opperationsCounter: 0
};
let deviceEvents = new EventEmitter ();
import _ from 'lodash';
import { EventEmitter } from 'events';
import RaspberrypiSimulator from './views/RaspberrypiSimulator.vue';
import JSInterpreter from './JSInterpreter/interpreter.js';
import JSInterpreterLibrary from './JSInterpreter/interpreter_library.js';
import generic_raspberrypi from './libraries/generic_raspberrypi.js';
import onoff from './libraries/onoff.js';

function updateDevice(device) {
	deviceEvents.emit('update:' + device.id, device);
}

let device_simulator_raspberrypi = {
	connect(device) {
		console.log('check already connected');
		if (simulator.connected === false) {
			console.log('check object');
			if (_.isObject(device)) {
				process.nextTick(() => {
					device.status = 'CONNECTED';
					updateDevice(device);
				});
				simulator.connected = true;

				return device;
			}
		}
	},

	disconnect(device) {
		console.log('check already disconnected');
		if (simulator.connected === true) {
			console.log('check object');
			if (_.isObject(device)) {
				device.status = 'DISCONNECTED';
				updateDevice(device);
				simulator.connected = false;

				return true;
			}
		}
	},

	registerForUpdate(device, fn) {
		deviceEvents.on('update:' + device.id, fn);
		return() => deviceEvents.removeListener('update:' + device.id, fn);
	}
};

export default function setup(options, imports, register) {
	studio = imports;
	let workspace = studio.workspace.registerDeviceDriver('raspberrypi_simulator', device_simulator_raspberrypi);

	workspace.updateDevices([{
			id: 'raspberrypi_simulator',
			name: 'RaspberryPi Simulator',
			priority: 1000,
			address: 'raspberrypi_simulator',
			board: 'raspberrypi_simulator',
			properties: {
				isRunning: false
			}
		}
	]);

	workspace.registerDeviceToolButton ('DEVICE_SIMULATOR_RASPBERRY_PI_RUN', 40, async () => {
		// Load project code
		let project = studio.projects.getCurrentProject();
		let filePath = studio.projects.getDefaultRunFileName(project);
		let code = await studio.projects.loadFile(project, filePath);

		let device = studio.workspace.getDevice();
		if (device && device.properties.isRunning === false) {
			studio.console.show();
			studio.console.select(device.id);

			// Create objects for libraries and insert before code
			let librariesToLoad = 
				`var libraries = {};\n\n`
				+ onoff +
				`function require (name) {
					return libraries[name];
				};\n\n`;
			code = librariesToLoad.toString() + code.toString();

			// Create interpreter
			let interpreter = new JSInterpreter(code, JSInterpreterLibrary(studio, device));
			simulator.opperationsCounter = 0;
			simulator.isRunning = true;
			device.properties.isRunning = true;
			updateDevice(device);

			let runToCompletion = function() {
				if (simulator.isRunning && interpreter.step()) {
					simulator.opperationsCounter ++;
					if (simulator.opperationsCounter === 100) {
						setTimeout(runToCompletion, 1000);
						simulator.opperationsCounter = 0;
					} else {
						setTimeout(runToCompletion, 10);
					}
				} else {
					simulator.isRunning = false;
					device.properties.isRunning = false;
					updateDevice(device);
				}
			};
			process.nextTick(runToCompletion);
		}
	}, 'plugins/device.simulator.raspberrypi/data/img/icons/run-icon.svg', {
		visible() {
			let device = studio.workspace.getDevice ();
			return (device.status === 'CONNECTED' && !device.properties.isRunning);
		},
		type: 'run'
	});

	workspace.registerDeviceToolButton('DEVICE_SIMULATOR_RASPBERRY_PI_STOP', 50, () => {
		let device = studio.workspace.getDevice ();
		if (device && device.properties.isRunning) {
			device.properties.isRunning = false;
			simulator.isRunning = false;
			updateDevice(device);
		}
	}, 'plugins/device.simulator.raspberrypi/data/img/icons/stop-icon.svg', {
		visible() {
			let device = studio.workspace.getDevice ();
			return (device.status === 'CONNECTED' && device.properties.isRunning);
		},
		type: 'stop'
	});

	studio.workspace.registerTab('DEVICE_SIMULATOR_RASPBERRY_PI', 1000, RaspberrypiSimulator, {
		visible() {
			let device = studio.workspace.getDevice ();
			return (device.status === 'CONNECTED' && device.id === 'raspberrypi_simulator');
		},
	});
	
	register(null, {
		device_simulator_raspberrypi
	});
}