<template>
	<div>
		<v-btn icon color="red" rounded dark @click.stop="projectsList = !projectsList"><v-icon color="blue darken-2">widgets</v-icon></v-btn>
		<v-navigation-drawer v-model="projectsList" absolute temporary width="500" dark>
			<v-list>
				<v-btn height="70" block>LOAD PROJECT</v-btn>
				<v-list-item v-for="(project, index) in projects" :key="index" @click="projectName = index; projectsList = !projectsList">
					<v-list-item-title>{{ project }}</v-list-item-title>
					<v-list-item-avatar size="150">
						<v-img :src="svgPath + index + '.svg'"></v-img>
					</v-list-item-avatar>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<template>
			<v-data-table v-show="pinTable.length !== 0" dense hide-default-footer no-data-text="There is no pin assigned!" :headers="headerTable" :items="pinTable" item-key="pin" class="elevation-1"></v-data-table>
		</template>

		<div id="raspberrypi_svg"></div>

		<v-flex xs9>
            <v-slider id="test" @mousedown="highlightPotentiometer(potentiometer)" v-model="potentiometerData[potentiometer]" v-for="potentiometer in potentiometerSlider" :key="potentiometer" :min="0" :max="255" thumb-label="always" label="Potentiometer"></v-slider>
		</v-flex>
	</div>
</template>

<script>
import $ from 'jquery';
import generate_project_json from './../libraries/generate_project_json.js'

import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

export default {
	name: 'RaspberrypiSimulator',

	data() {
		return {
			projectsList: false,
			svgPath: './plugins/device.simulator.raspberrypi/data/schematics/svg/',

			pinTable: [],
			headerTable: [{
				text: 'Pin',
				align: 'left',
				sortable: false,
				value: 'pin'
			}, {
				text: 'Component',
				value: 'component'
			}, {
				text: 'State',
				value: 'state'
			}, {
				text: 'Color',
				value: 'color'
			}],

			projectName: '',
			projectData: {},
			projects: {},

			potentiometerSlider: [],
			potentiometerData: [],
		}
	},

	created() {
		for (let raspberrypiSchematic of Object.keys(generic_raspberrypi.schematicsData)) {
			this.projects[raspberrypiSchematic] = generic_raspberrypi.schematicsData[raspberrypiSchematic].name;
		}

		this.projectName = generic_raspberrypi.svgLoaded;

		console.log('Aici fac incarcarea si parsarea de xml\n\n\n');

		// Examples:
		// let xmlPath = './plugins/device.simulator.raspberrypi/data/schematics/netlist/3LedsAndButton.xml';
		// let xmlPath = './plugins/device.simulator.raspberrypi/data/schematics/netlist/ledAndPotentiometer.xml';
		let xmlPath = './plugins/device.simulator.raspberrypi/data/schematics/netlist/test.xml';
		let xhr = new XMLHttpRequest();

		xhr.open('GET', xmlPath, false);
		xhr.overrideMimeType('image/svg+xml');
		xhr.send('');

		let obj = generate_project_json(xhr.responseXML.documentElement);
		console.log(obj);
	},

	watch: {
		projectName(name) {
			generic_raspberrypi.loadSvg(name);
			this.projectData = generic_raspberrypi.dataLoaded;

			this.pinTable = [];
			this.potentiometerSlider = [];
			this.potentiometerData = [];

			for (let pinID of Object.keys(this.projectData)) {
				if (this.projectData[pinID] !== null && this.projectData[pinID].state !== '0') {
					this.pinTable.push({
						pin: this.projectData[pinID].pin,
						component: this.projectData[pinID].component,
						state: this.projectData[pinID].state,
						color: this.projectData[pinID].colorName
					})

					if (this.projectData[pinID].component === 'POTENTIOMETER') {
						this.potentiometerSlider.push(this.projectData[pinID].pin);
						this.potentiometerData[this.projectData[pinID].pin] = 0;
					}
				}
			}
		},

		potentiometerData() {
			for (let pin of this.potentiometerSlider) {
				this.projectData[pin].value = this.potentiometerData[pin];
			}
		}
	},

	methods: {
		highlightPotentiometer(pin) {
			try {
				$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.projectData[pin].partID + '"]').hide(300);
				$(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + this.projectData[pin].partID + '"]').show(300);
			} catch(e) {
				console.log(e);
			}
		}
	}
}
</script>