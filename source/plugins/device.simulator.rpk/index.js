let studio = null;
let simulator = {
	connected: false,
	isRunning: false,
	opperationsCounter: 0
};
let deviceEvents = new EventEmitter();
import _ from 'lodash';
import { EventEmitter } from 'events';
import RPKSimulator from './views/RPKSimulator.vue';
import JSInterpreter from './JSInterpreter/interpreter.js';
import JSInterpreterLibrary from './JSInterpreter/interpreter_library.js';
import generic_rpk from './libraries/generic_rpk.js';

function updateDevice(device) {
	deviceEvents.emit('update:' + device.id, device);
}

let device_simulator_rpk = {
	connect(device) {
		if (simulator.connected === false) {
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
				simulator.run = false;
				device.status = 'DISCONNECTED';
				updateDevice(device);
				simulator.connected = false;

				return true;
			}
		}
	},

	registerForUpdate(device, fn) {
		deviceEvents.on('update:' + device.id, fn);
		return () => deviceEvents.removeListener('update:' + device.id, fn);
	}
};

export default function setup(options, imports, register) {
	studio = imports;
	let workspace = studio.workspace.registerDeviceDriver('rpk_simulator', device_simulator_rpk);

	workspace.updateDevices([{
		id: 'rpk_simulator',
		name: 'RPK Simulator',
		priority: 1000,
		address: 'rpk_simulator',
		board: 'rpk',
		placeholder: true,
		properties: {
			isRunning: false
		}
	}
	]);

	workspace.registerDeviceToolButton('DEVICE_SIMULATOR_RPK_RUN', 40, async () => {
		// Load project code
		let project = studio.projects.getCurrentProject();
		let filePath = studio.projects.getDefaultRunFileName(project);
		let code = await studio.projects.loadFile(project, filePath);

		let device = studio.workspace.getDevice();
		if (device && device.properties.isRunning === false) {
			studio.console.show();
			studio.console.select(device.id);

			// Set parameters to default
			generic_rpk.setToDefault();

			// Create interpreter
			let interpreter = new JSInterpreter(code.toString(), JSInterpreterLibrary(studio, device, generic_rpk));
			simulator.opperationsCounter = 0;

			simulator.isRunning = true;
			device.properties.isRunning = true;
			updateDevice(device);
			
			let runToCompletion = function () {
				if (simulator.isRunning && interpreter.step()) {
					simulator.opperationsCounter++;
					if (simulator.opperationsCounter === 100) {
						setTimeout(runToCompletion, 10);
						simulator.opperationsCounter = 0;
					} else {
						setTimeout(runToCompletion, 1);
					}
				} else {
					simulator.isRunning = false;
					device.properties.isRunning = false;
					updateDevice(device);
				}
			};
			process.nextTick(runToCompletion);
		}
	}, 'plugins/device.simulator.rpk/data/img/icons/run-icon.svg', {
		visible() {
			let device = studio.workspace.getDevice();
			return (device.status === 'CONNECTED' && !device.properties.isRunning);
		},
		type: 'run'
	});

	workspace.registerDeviceToolButton('DEVICE_SIMULATOR_RPK_STOP', 40, () => {
		let device = studio.workspace.getDevice();
		if (device && device.properties.isRunning) {
			device.properties.isRunning = false;
			simulator.isRunning = false;
			updateDevice(device);
		}
	}, 'plugins/device.simulator.rpk/data/img/icons/stop-icon.svg', {
		visible() {
			let device = studio.workspace.getDevice();
			return (device.status === 'CONNECTED' && device.properties.isRunning);
		},
		type: 'stop'
	});

	studio.workspace.registerTab('DEVICE_SIMULATOR_RPK', 1000, RPKSimulator, {
		visible() {
			let device = studio.workspace.getDevice();
			return (device.status === 'CONNECTED' && device.id === 'rpk_simulator');
		},
	});

	register(null, {
		device_simulator_rpk
	});
}