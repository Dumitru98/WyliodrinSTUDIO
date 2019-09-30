import $ from 'jquery';

import raspberrypiData from './../data/schematics/data/raspberrypi.js';
import raspberrypiWithLedData from './../data/schematics/data/raspberrypiWithLed.js';
import raspberrypiWith3LedsData from './../data/schematics/data/raspberrypiWith3Leds.js';
import raspberrypiWithButtonAndLedData from './../data/schematics/data/raspberrypiWithButtonAndLed.js';
import raspberrypiWithPotentiometerAndLedData from './../data/schematics/data/raspberrypiWithPotentiometerAndLed.js';

let generic_raspberrypi = {
	name: 'Raspberry Pi 3 Model B v1.2',
	svgGenericPath: './plugins/device.simulator.raspberrypi/data/schematics/svg/',
	svgLoaded: 'raspberrypi',
	dataLoaded: raspberrypiData,
	vccPins: [0, 1, 3, 16],
	gndPins: [5, 8, 13, 19, 24, 29, 33, 38],
	pwmPins: [31, 32, 34],
	i2cPins: [2, 4],

	schematicsData: {
		'raspberrypi': raspberrypiData,
		'raspberrypiWithLed': raspberrypiWithLedData,
		'raspberrypiWith3Leds': raspberrypiWith3LedsData,
		'raspberrypiWithButtonAndLed': raspberrypiWithButtonAndLedData,
		'raspberrypiWithPotentiometerAndLed': raspberrypiWithPotentiometerAndLedData
	},

	ledColors: {
		red: 'hsl(0, 25%, 50%)',
		orange: 'hsl(37, 25%, 50%)',
		yellow: 'hsl(58, 25%, 50%)',
		green: 'hsl(117, 25%, 50%)',
		blue: 'hsl(230, 25%, 50%)'
	},

	pins: {
		0: {
			name: '3.3V',
			states: ['3.3']
		},
		1: {
			name: '5V',
			states: ['5']
		},
		2: {
			name: 'GPIO2',
			states: ['IN', 'OUT', 'I2C_SDA']
		},
		3: {
			name: '5V',
			states: ['5']
		},
		4: {
			name: 'GPIO3',
			states: ['IN', 'OUT', 'I2C_SCL']
		},
		5: {
			name: 'GND',
			states: ['0']
		},
		6: {
			name: 'GPIO4',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		7: {
			name: 'GPIO14',
			states: ['IN', 'OUT']
		},
		8: {
			name: 'GND',
			states: ['0']
		},
		9: {
			name: 'GPIO15',
			states: ['IN', 'OUT']
		},


		10: {
			name: 'GPIO17',
			states: ['IN', 'OUT']
		},
		11: {
			name: 'GPIO18',
			states: ['IN', 'OUT', 'SPI_CLK', 'PWM']
		},
		12: {
			name: 'GPIO27',
			states: ['IN', 'OUT']
		},
		13: {
			name: 'GND',
			states: ['0']
		},
		14: {
			name: 'GPIO22',
			states: ['IN', 'OUT']
		},
		15: {
			name: 'GPIO23',
			states: ['IN', 'OUT']
		},
		16: {
			name: '3.3V',
			states: ['3.3']
		},
		17: {
			name: 'GPIO24',
			states: ['IN', 'OUT']
		},
		18: {
			name: 'GPIO10',
			states: ['IN', 'OUT', 'SPI_MOSI']
		},
		19: {
			name: 'GND',
			states: ['0']
		},


		20: {
			name: 'GPIO9',
			states: ['IN', 'OUT', 'SPI_MOSI']
		},
		21: {
			name: 'GPIO25',
			states: ['IN', 'OUT']
		},
		22: {
			name: 'GPIO11',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		23: {
			name: 'GPIO8',
			states: ['IN', 'OUT', 'SPI_SS']
		},
		24: {
			name: 'GND',
			states: ['0']
		},
		25: {
			name: 'GPIO7',
			states: ['IN', 'OUT', 'SPI_SS']
		},
		26: {
			name: 'ID_SD',
			states: ['I2C_SDA']
		},
		27: {
			name: 'ID_SC',
			states: ['I2C_SCL']
		},
		28: {
			name: 'GPIO5',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		29: {
			name: 'GND',
			states: ['0']
		},


		30: {
			name: 'GPIO6',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		31: {
			name: 'GPIO12',
			states: ['IN', 'OUT', 'PWM']
		},
		32: {
			name: 'GPIO13',
			states: ['IN', 'OUT', 'PWM']
		},
		33: {
			name: 'GND',
			states: ['0']
		},
		34: {
			name: 'GPIO19',
			states: ['IN', 'OUT', 'PWM']
		},
		35: {
			name: 'GPIO16',
			states: ['IN', 'OUT']
		},
		36: {
			name: 'GPIO26',
			states: ['IN', 'OUT']
		},
		37: {
			name: 'GPIO20',
			states: ['IN', 'OUT']
		},
		38: {
			name: 'GND',
			states: ['0']
		},
		39: {
			name: 'GPIO21',
			states: ['IN', 'OUT']
		}
	},

	loadSvg: function(name) {
		try {
			// Save SVG and data loaded
			this.svgLoaded = name;
			this.dataLoaded = this.schematicsData[name].pins;

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
			for (let pin of Object.keys(this.dataLoaded)) {
				if (this.dataLoaded[pin] !== null) {
					if (this.dataLoaded[pin].component === 'LED') {
						$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.dataLoaded[pin].partID + '"] #color_path32').css({ fill: 'hsl(' + this.dataLoaded[pin].color + ', 25%, 50%)' });
					} else if (this.dataLoaded[pin].component === 'BUTTON') {
						this.dataLoaded[pin].value = 0;

						$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.dataLoaded[pin].partID + '"]').on('mousedown', () => {
							this.dataLoaded[pin].value = 1;
						});

						$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.dataLoaded[pin].partID + '"]').on('mouseup', () => {
							this.dataLoaded[pin].value = 0;
						});

						$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.dataLoaded[pin].partID + '"]').on('mouseout', () => {
							this.dataLoaded[pin].value = 0;
						});

						$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.dataLoaded[pin].partID + '"]').css('cursor', 'pointer');
					} else if (this.dataLoaded[pin].component === 'POTENTIOMETER') {
						this.dataLoaded[pin].value = 0;
					}
				}
			}
		} catch(e) {
			console.log(e);
		}
	}
}

export default generic_raspberrypi;