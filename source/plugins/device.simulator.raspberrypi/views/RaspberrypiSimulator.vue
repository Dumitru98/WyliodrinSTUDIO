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
					<v-list-item-title>{{ project.name }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<template>
			<v-data-table dense :headers="headersTable" :items="pinsTable" item-key="pin" class="elevation-1"></v-data-table>
		</template>

		<div id="raspberrypi_svg"></div>

		<div id="potentiometer_slider"></div>

		<v-flex xs9 v-for="potentiometer in potentiometers" :key="potentiometer">
            <v-slider :min="0" :max="255" thumb-label="always" label="Potentiometer"></v-slider>
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
			headersTable: [{
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
			pinsTable: [],
			potentiometers: [],

			projects: null,

			projectName: null,
			projectData: null
		}
	},

	created() {
		this.projects = generic_raspberrypi.schematicsData;

		this.projectName = 'raspberrypi';
		this.projectData = generic_raspberrypi.loadSvg(this.projectName);
	},

	watch: {
		projectName(value) {
			this.projectName = value;
			this.projectData = generic_raspberrypi.loadSvg(value);

			this.pinsTable = [];
			for (let pinData of Object.keys(this.projectData)) {
				if (this.projectData[pinData] !== null && this.projectData[pinData].state !== '0') {
					this.pinsTable.push({
						pin: this.projectData[pinData].pin,
						component: this.projectData[pinData].component,
						state: this.projectData[pinData].state,
						color: this.projectData[pinData].colorName
					})

					if (this.projectData[pinData].component === 'POTENTIOMETER') {
						this.potentiometers.push(this.projectData[pinData].partID);
					}
				}
			}
		}
	},

	methods: {}
}
</script>