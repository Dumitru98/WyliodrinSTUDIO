import $ from 'jquery';

import raspberrypiData from './../data/schematics/data/raspberrypi.js';
import raspberrypiWithLedData from './../data/schematics/data/raspberrypiWithLed.js';
import raspberrypiWith3LedsData from './../data/schematics/data/raspberrypiWith3Leds.js';
import raspberrypiWithButtonAndLedData from './../data/schematics/data/raspberrypiWithButtonAndLed.js';

let generic_raspberrypi = {
	name: 'Raspberry Pi 3 Model B v1.2',
	svgGenericPath: './plugins/device.simulator.raspberrypi/data/schematics/svg/',
	svgLoaded: 'raspberrypi',
	dataLoaded: raspberrypiData,
	vccPins: [0, 1, 3, 16],
	gndPins: [5, 8, 13, 19, 24, 29, 33, 38],
	pwmPins: [31, 32, 34],
	i2cPins: [2, 4],

	ledColors: {
		red: 'h0, 25%, 50%)',
		orange: 'hsl(37, 25%, 50%)',
		yellow: 'hsl(58, 25%, 50%)',
		green: 'hsl(117, 25%, 50%)',
		blue: 'hsl(230, 25%, 50%)'
	},

	pins: {
		pin0: {
			name: '3.3V',
			states: ['3.3']
		},
		pin1: {
			name: '5V',
			states: ['5']
		},
		pin2: {
			name: 'GPIO2',
			states: ['IN', 'OUT', 'I2C_SDA']
		},
		pin3: {
			name: '5V',
			states: ['5']
		},
		pin4: {
			name: 'GPIO3',
			states: ['IN', 'OUT', 'I2C_SCL']
		},
		pin5: {
			name: 'GND',
			states: ['0']
		},
		pin6: {
			name: 'GPIO4',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		pin7: {
			name: 'GPIO14',
			states: ['IN', 'OUT']
		},
		pin8: {
			name: 'GND',
			states: ['0']
		},
		pin9: {
			name: 'GPIO15',
			states: ['IN', 'OUT']
		},


		pin10: {
			name: 'GPIO17',
			states: ['IN', 'OUT']
		},
		pin11: {
			name: 'GPIO18',
			states: ['IN', 'OUT', 'SPI_CLK', 'PWM']
		},
		pin12: {
			name: 'GPIO27',
			states: ['IN', 'OUT']
		},
		pin13: {
			name: 'GND',
			states: ['0']
		},
		pin14: {
			name: 'GPIO22',
			states: ['IN', 'OUT']
		},
		pin15: {
			name: 'GPIO23',
			states: ['IN', 'OUT']
		},
		pin16: {
			name: '3.3V',
			states: ['3.3']
		},
		pin17: {
			name: 'GPIO24',
			states: ['IN', 'OUT']
		},
		pin18: {
			name: 'GPIO10',
			states: ['IN', 'OUT', 'SPI_MOSI']
		},
		pin19: {
			name: 'GND',
			states: ['0']
		},


		pin20: {
			name: 'GPIO9',
			states: ['IN', 'OUT', 'SPI_MOSI']
		},
		pin21: {
			name: 'GPIO25',
			states: ['IN', 'OUT']
		},
		pin22: {
			name: 'GPIO11',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		pin23: {
			name: 'GPIO8',
			states: ['IN', 'OUT', 'SPI_SS']
		},
		pin24: {
			name: 'GND',
			states: ['0']
		},
		pin25: {
			name: 'GPIO7',
			states: ['IN', 'OUT', 'SPI_SS']
		},
		pin26: {
			name: 'ID_SD',
			states: ['I2C_SDA']
		},
		pin27: {
			name: 'ID_SC',
			states: ['I2C_SCL']
		},
		pin28: {
			name: 'GPIO5',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		pin29: {
			name: 'GND',
			states: ['0']
		},


		pin30: {
			name: 'GPIO6',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		pin31: {
			name: 'GPIO12',
			states: ['IN', 'OUT', 'PWM']
		},
		pin32: {
			name: 'GPIO13',
			states: ['IN', 'OUT', 'PWM']
		},
		pin33: {
			name: 'GND',
			states: ['0']
		},
		pin34: {
			name: 'GPIO19',
			states: ['IN', 'OUT', 'PWM']
		},
		pin35: {
			name: 'GPIO16',
			states: ['IN', 'OUT']
		},
		pin36: {
			name: 'GPIO26',
			states: ['IN', 'OUT']
		},
		pin37: {
			name: 'GPIO20',
			states: ['IN', 'OUT']
		},
		pin38: {
			name: 'GND',
			states: ['0']
		},
		pin39: {
			name: 'GPIO21',
			states: ['IN', 'OUT']
		}
	},

	schematicsData: {
		'raspberrypi': {
			name: 'RaspberryPi',
			data: raspberrypiData
		},
		'raspberrypiWithLed': {
			name: 'RaspberryPi With Led',
			data: raspberrypiWithLedData
		},
		'raspberrypiWith3Leds': {
			name: 'RaspberryPi With 3 Leds',
			data: raspberrypiWith3LedsData
		},
		'raspberrypiWithButtonAndLed': {
			name: 'RaspberryPi With Button and Led',
			data: raspberrypiWithButtonAndLedData
		}
	},

	loadSvg: function(name) {
		try {
			// Save SVG and data loaded
			this.svgLoaded = name;
			this.dataLoaded = this.schematicsData[name].data;

			// Load SVG file
			let svgPath = this.svgGenericPath + name + '.svg';
			let xhr = new XMLHttpRequest();

			xhr.open('GET', svgPath, false);
			xhr.overrideMimeType('image/svg+xml');
			xhr.send('');

			// Put SVG file in HTML component
			if (document.getElementById('raspberrypi_svg').firstElementChild === null) {
				document.getElementById('raspberrypi_svg').appendChild(xhr.responseXML.documentElement);
			} else {
				document.getElementById('raspberrypi_svg').replaceChild(xhr.responseXML.documentElement, document.getElementById('raspberrypi_svg').firstElementChild);
			}

			// Set LEDs to off
			for (let pin of Object.keys(this.schematicsData[name].data)) {
				try {
					if (this.schematicsData[name].data[pin].component === 'LED') {
						$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.schematicsData[name].data[pin].partID + '"] #color_path32').css({ fill: 'hsl(' + this.schematicsData[name].data[pin].color + ', 25%, 50%)' });
					}
				} catch(e) {
					
				}
			}

			return this.schematicsData[name].data;
		} catch(e) {
			console.log(e);
		}
	}
}

export default generic_raspberrypi;