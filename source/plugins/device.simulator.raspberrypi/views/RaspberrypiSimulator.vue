<template>
	<div>
		<!-- <v-btn icon color="red" rounded dark @click.stop="projectsList = !projectsList"><v-icon color="blue darken-2">widgets</v-icon></v-btn>
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
		</v-navigation-drawer> -->

		<v-btn block color="secondary" dark @click="addSvg">Add Project SVG</v-btn>
		<v-btn block color="secondary" dark @click="addXml">Add Project XML</v-btn>
		<v-btn block color="secondary" dark @click="loadProject">Load Project</v-btn>

		<template>
			<v-data-table v-show="componentsTable.length !== 0" dense hide-default-footer no-data-text="There is no pin assigned!" :headers="headerTable" :items="componentsTable" item-key="pin" class="elevation-1"></v-data-table>
		</template>

		<div id="raspberrypi_svg"></div>
		<div id="lcd_display"></div>
	</div>
</template>

<script>
import $ from 'jquery';

import generic_raspberrypi from './../libraries/utils/generic_raspberrypi.js';

export default {
	name: 'RaspberrypiSimulator',

	data() {
		return {
			projectsList: false,

			componentsTable: [],
			headerTable: [{
				text: 'Pins',
				align: 'left',
				sortable: false,
				value: 'pins'
			}, {
				text: 'Name',
				value: 'name'
			}, {
				text: 'Color',
				value: 'color'
			}],

			projectName: '',
			projectData: {},

			xmlOwnProject: null,
			svgOwnProject: null
		}
	},

	created() {
		// Save the current project name
		this.projectName = generic_raspberrypi.svgLoaded;
	},

	watch: {
		/**
		 * Load a new project for every change of the variable 'projectName'
		 * @param  {String} name The name of the project to be loaded
		 */
		projectName(name) {
			// Load the new project data
			if (name === 'Own Project') {
				generic_raspberrypi.loadProject(name, this.svgOwnProject, this.xmlOwnProject);
			} else {
				generic_raspberrypi.loadProject(name);
			}

			this.projectData = generic_raspberrypi.dataLoaded;
			this.componentsTable = [];

			// Create the list needed for the table of components
			for (let component of Object.keys(this.projectData.components)) {
				let newComponent = {
					pins: null,
					name: null,
					color: null
				};

				// Set the attribute 'pins' of each component
				let pins = '';
				for (let pin of Object.keys(this.projectData.pins)) {
					if (this.projectData.pins[pin].id !== 'gnd' && this.projectData.pins[pin].components.includes(component)) {
						if (pins === '') {
							pins += pin;
						} else {
							pins += ', ';
							pins += pin;
						}
					}
				}
				newComponent.pins = pins.toUpperCase();

				// Set the attribute 'name' of each component
				newComponent.name = this.projectData.components[component].name.toUpperCase();

				// Set the attribute 'color' of each component
				if (this.projectData.components[component].color) {
					newComponent.color = this.projectData.components[component].color.toUpperCase();
				} else {
					newComponent.color = '-';
				}

				// Add the component to the table
				this.componentsTable.push(newComponent);

				// Create the LCD segments simulation and add them to the HTML
				if (this.projectData.components[component].name === 'lcd') {
					let leftPosition = 0;
					let topPosition = 50;

					for (let i = 0; i < 2; i ++) {
						for (let j = 0; j < 16; j ++) {
							let lcd = document.createElement('div');

							if (j === 0 && i !== 0) {
								leftPosition = 0;
								topPosition += 21;
							}

							lcd.style.cssText = 'position: absolute; left: ' + leftPosition + 'px; top: ' + topPosition + 'px; width: 12px; height: 20px; text-align: center; font-size: 15px; background: #9ACD32';
							lcd.id = 'segment ' + i + '-' + j;
							document.getElementById('lcd_display').appendChild(lcd);

							leftPosition += 13;
						}
					}
				}
			}
		}
	},

	methods: {
		async addSvg() {
			let files = await this.studio.filesystem.openImportDialog({
				title:'Import SVG',
				filetypes:['svg']
			});

			if (files.length) {
				let fileData = await this.studio.filesystem.readImportFile (files[0]);

				this.svgOwnProject = fileData.toString();
			}
		},

		async addXml() {
			let files = await this.studio.filesystem.openImportDialog({
				title:'Import XML',
				filetypes:['xml']
			});

			if (files.length) {
				let fileData = await this.studio.filesystem.readImportFile (files[0]);

				this.xmlOwnProject = fileData.toString();
			}
		},

		loadProject() {
			if (this.xmlOwnProject === null) {
				console.log('error no xml loaded');
			} else if (this.svgOwnProject === null) {
				console.log('error no svg loaded');
			} else {
				this.projectName = 'Own Project';
			}
		}
	}
}
</script>