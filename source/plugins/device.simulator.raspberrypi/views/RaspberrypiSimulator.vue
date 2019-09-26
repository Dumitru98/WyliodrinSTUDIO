<template>
	<div>
		<v-menu>
			<template v-slot:activator="{ on: menu }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn color="primary" dark v-on="{ ...tooltip, ...menu }">Projects</v-btn>
					</template>
				</v-tooltip>
			</template>
			<v-list>
				<v-list-item v-for="(project, index) in projects" :key="index" @click="projectName = index">
					<v-list-item-title>{{ project }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<template>
			<v-data-table dense :headers="headerTable" :items="pinTable" item-key="pin" class="elevation-1"></v-data-table>
		</template>

		<div id="raspberrypi_svg"></div>

		<v-flex xs9>
            <v-slider v-model="potentiometerData[potentiometer]" v-for="potentiometer in potentiometerSlider" :key="potentiometer" :min="0" :max="255" thumb-label="always" label="Potentiometer"></v-slider>
		</v-flex>
	</div>
</template>

<script>
import $ from 'jquery';

import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

export default {
	name: 'RaspberrypiSimulator',

	data() {
		return {
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
	},

	watch: {
		projectName(name) {
			this.projectName = name;
			this.projectData = generic_raspberrypi.loadSvg(name);

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

	methods: {}
}
</script>