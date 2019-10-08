import $ from 'jquery';
import generate_project_json from './generate_project_json.js';

let generic_raspberrypi = {
	name: 'Raspberry Pi 3 Model B v1.2',
	svgGenericPath: './plugins/device.simulator.raspberrypi/data/schematics/svg/',
	xmlGenericPath: './plugins/device.simulator.raspberrypi/data/schematics/xml/',
	svgLoaded: 'testButtonAndLed',
	dataLoaded: null,
	vccPins: [0, 1, 3, 16],
	gndPins: [5, 8, 13, 19, 24, 29, 33, 38],
	pwmPins: [31, 32, 34],
	i2cPins: [2, 4],

	// The dictionary with the names of the projects that can be loaded
	projectsName: {},

	// Colors dictionary for HSL format
	ledColors: {
		'red': 0,
		'orange': 37,
		'yellow': 58,
		'green': 117,
		'blue': 230
	},

	// The pins for the RaspberryPi
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
			name: 'GIPO2',
			states: ['IN', 'OUT', 'I2C_SDA']
		},
		3: {
			name: '5V',
			states: ['5']
		},
		4: {
			name: 'GIPO3',
			states: ['IN', 'OUT', 'I2C_SCL']
		},
		5: {
			name: 'GND',
			states: ['0']
		},
		6: {
			name: 'GIPO4',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		7: {
			name: 'GIPO14',
			states: ['IN', 'OUT']
		},
		8: {
			name: 'GND',
			states: ['0']
		},
		9: {
			name: 'GIPO15',
			states: ['IN', 'OUT']
		},


		10: {
			name: 'GIPO17',
			states: ['IN', 'OUT']
		},
		11: {
			name: 'GIPO18',
			states: ['IN', 'OUT', 'SPI_CLK', 'PWM']
		},
		12: {
			name: 'GIPO27',
			states: ['IN', 'OUT']
		},
		13: {
			name: 'GND',
			states: ['0']
		},
		14: {
			name: 'GIPO22',
			states: ['IN', 'OUT']
		},
		15: {
			name: 'GIPO23',
			states: ['IN', 'OUT']
		},
		16: {
			name: '3.3V',
			states: ['3.3']
		},
		17: {
			name: 'GIPO24',
			states: ['IN', 'OUT']
		},
		18: {
			name: 'GIPO10',
			states: ['IN', 'OUT', 'SPI_MOSI']
		},
		19: {
			name: 'GND',
			states: ['0']
		},


		20: {
			name: 'GIPO9',
			states: ['IN', 'OUT', 'SPI_MOSI']
		},
		21: {
			name: 'GIPO25',
			states: ['IN', 'OUT']
		},
		22: {
			name: 'GIPO11',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		23: {
			name: 'GIPO8',
			states: ['IN', 'OUT', 'SPI_SS']
		},
		24: {
			name: 'GND',
			states: ['0']
		},
		25: {
			name: 'GIPO7',
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
			name: 'GIPO5',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		29: {
			name: 'GND',
			states: ['0']
		},


		30: {
			name: 'GIPO6',
			states: ['IN', 'OUT', 'SPI_CLK']
		},
		31: {
			name: 'GIPO12',
			states: ['IN', 'OUT', 'PWM']
		},
		32: {
			name: 'GIPO13',
			states: ['IN', 'OUT', 'PWM']
		},
		33: {
			name: 'GND',
			states: ['0']
		},
		34: {
			name: 'GIPO19',
			states: ['IN', 'OUT', 'PWM']
		},
		35: {
			name: 'GIPO16',
			states: ['IN', 'OUT']
		},
		36: {
			name: 'GIPO26',
			states: ['IN', 'OUT']
		},
		37: {
			name: 'GIPO20',
			states: ['IN', 'OUT']
		},
		38: {
			name: 'GND',
			states: ['0']
		},
		39: {
			name: 'GIPO21',
			states: ['IN', 'OUT']
		}
	},

	/**
	 * Set the color and the value of the led
	 * @param  {String} component The id of the led
	 * @param  {Integer} value The value that the led should have, '0' of '1'
	 */
	setLed: function(component, value) {
		if (value) {
			this.dataLoaded.components[component].active = true;
			$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"] #color_path32').css({ fill: 'hsl(' + this.ledColors[this.dataLoaded.components[component].color] + ', 100%, 50%)' });
		} else {
			this.dataLoaded.components[component].active = false;
			$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"] #color_path32').css({ fill: 'hsl(' + this.ledColors[this.dataLoaded.components[component].color] + ', 25%, 50%)' });
		}
	},

	/**
	 * Set the functions of the button
	 * @param  {String} component The id of the button
	 */
	setButton: function(component) {
		this.dataLoaded.components[component].active = false;

		// Function for pressing the button
		$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"]').on('mousedown', () => {
			this.dataLoaded.components[component].active = true;

			for (let pin of Object.keys(this.dataLoaded.pins)) {
				if (this.dataLoaded.pins[pin].components.indexOf(component) !== -1 && this.dataLoaded.pins[pin].state === 'out' && this.dataLoaded.pins[pin].value === 1) {

					// Check if the full circuit is active
					let closeCircuit = true;
					for (let otherComponent of this.dataLoaded.pins[pin].components) {
						if (otherComponent !== component && this.dataLoaded.components[otherComponent].name === 'button' && this.dataLoaded.components[otherComponent].active === false) {
							closeCircuit = false;
							break;
						}
					}

					// If the circuit is active, turn the other components associated to the pin 'on'
					if (closeCircuit) {
						for (let otherComponent of this.dataLoaded.pins[pin].components) {
							if (this.dataLoaded.components[otherComponent].name === 'led') {
								$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + otherComponent + '"] #color_path32').css({ fill: 'hsl(' + this.ledColors[this.dataLoaded.components[otherComponent].color] + ', 100%, 50%)' });
								this.dataLoaded.components[otherComponent].active = true;
							}
						}
					}
				}
			}
		});

		// Function for releasing the button
		$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"]').on('mouseup', () => {
			this.dataLoaded.components[component].active = false;

			// Turn the other components associated to the pin 'off'
			for (let pin of Object.keys(this.dataLoaded.pins)) {
				if (this.dataLoaded.pins[pin].components.indexOf(component) !== -1) {
					for (let otherComponent of this.dataLoaded.pins[pin].components) {
						if (otherComponent !== component && this.dataLoaded.components[otherComponent].name === 'led') {
							$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + otherComponent + '"] #color_path32').css({ fill: 'hsl(' + this.ledColors[this.dataLoaded.components[otherComponent].color] + ', 25%, 50%)' });
							this.dataLoaded.components[otherComponent].active = false;
						}
					}
				}
			}
		});

		// Function for leveaing the area of the button
		$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"]').on('mouseleave', () => {
			this.dataLoaded.components[component].active = false;

			// Turn the other components associated to the pin 'off'
			for (let pin of Object.keys(this.dataLoaded.pins)) {
				if (this.dataLoaded.pins[pin].components.indexOf(component) !== -1) {
					for (let otherComponent of this.dataLoaded.pins[pin].components) {
						if (otherComponent !== component && this.dataLoaded.components[otherComponent].name === 'led') {
							$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + otherComponent + '"] #color_path32').css({ fill: 'hsl(' + this.ledColors[this.dataLoaded.components[otherComponent].color] + ', 25%, 50%)' });
							this.dataLoaded.components[otherComponent].active = false;
						}
					}
				}
			}
		});

		// Change the cursor style if hover the button
		$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"]').css('cursor', 'pointer');
	},

	/**
	 * Load the SVG, parse the XML and set to default the components
	 * @param  {String} name The name of the project to load
	 */
	loadProject: function(name) {
		try {
			this.svgLoaded = name;

			// Load SVG file
			let svgPath = this.svgGenericPath + name + '.svg';
			let xhrSvg = new XMLHttpRequest();

			xhrSvg.open('GET', svgPath, false);
			xhrSvg.overrideMimeType('image/svg+xml');
			xhrSvg.send('');

			// Put SVG file in HTML component
			if (document.getElementById('raspberrypi_svg').firstElementChild === null) {
				document.getElementById('raspberrypi_svg').appendChild(xhrSvg.responseXML.documentElement);
			} else {
				document.getElementById('raspberrypi_svg').replaceChild(xhrSvg.responseXML.documentElement, document.getElementById('raspberrypi_svg').firstElementChild);
			}

			// Load XML file
			let xmlPath = this.xmlGenericPath + name + '.xml';
			let xhrXml = new XMLHttpRequest();

			xhrXml.open('GET', xmlPath, false);
			xhrXml.overrideMimeType('image/svg+xml');
			xhrXml.send('');

			// Parse XML file and save the JSON generated
			this.dataLoaded = generate_project_json(xhrXml.responseXML.documentElement, name);

			// Initialize LEDs 'off'
			for (let component of Object.keys(this.dataLoaded.components)) {
				if (this.dataLoaded.components[component].valid && this.dataLoaded.components[component].name === 'led') {
					this.setLed(component, 0);
				}
			}

			// Initialize LEDs 'on' for cases of direct voltage connections
			for (let pin of Object.keys(this.dataLoaded.pins)) {
				if ((this.dataLoaded.pins[pin].id === '3v3' || this.dataLoaded.pins[pin].id === '5v') && this.dataLoaded.pins[pin].circuitInterruption === false) {
					for (let component of Object.keys(this.dataLoaded.components)) {
						if (this.dataLoaded.components[component].valid && this.dataLoaded.components[component].name === 'led') {
							this.setLed(component, 1);
						}
					}
				}
			}

			// Initialize BUTTONs functions
			for (let component of Object.keys(this.dataLoaded.components)) {
				if (this.dataLoaded.components[component].valid && this.dataLoaded.components[component].name === 'button') {
					this.setButton(component);
				}
			}

			console.log(this.dataLoaded);
		} catch(e) {
			console.log(e);
		}
	}
}

export default generic_raspberrypi;