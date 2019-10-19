<template>
	<div>
		<v-toolbar dense>
			<v-app-bar-nav-icon @click.stop="projectsListShow = !projectsListShow"></v-app-bar-nav-icon>
			<v-toolbar-title>{{ projectNameToBeShown }}</v-toolbar-title>
		</v-toolbar>

		<v-navigation-drawer v-if="projectsList" v-model="projectsListShow" absolute temporary width="500" dark>
			<v-list>
				<v-btn block color="secondary" dark @click="projectsListShow = !projectsListShow">Close</v-btn>
				<v-btn block color="secondary" dark @click="uploadOwnProject(); projectsListShow = !projectsListShow">Load Project</v-btn>

				<v-list-item v-for="(project, index) in projectsList" :key="index" @click="projectName = project.originalName; projectsListShow = !projectsListShow">
					<v-list-item-title>{{ project.name }}</v-list-item-title>
					<v-list-item-avatar size="150">
						<v-img :src="svgGenericPath + project.svgPath + '.svg'"></v-img>
					</v-list-item-avatar>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-data-table v-show="componentsTable.length !== 0" dense hide-default-footer :headers="headerTable" :items="componentsTable" item-key="pin" class="elevation-1"></v-data-table>

		<div id="raspberrypi_svg"></div>
		<div id="lcd_display"></div>
	</div>
</template>

<script>
import $ from 'jquery';

import LoadProject from './dialogs/LoadProject.vue';
import generic_raspberrypi from './../libraries/utils/generic_raspberrypi.js';

export default {
	name: 'RaspberrypiSimulator',

	data() {
		return {
			projectsListShow: null,
			projectsList: null,
			svgGenericPath: null,

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

			projectNameToBeShown: null,
			projectName: null,
			projectData: null
		}
	},

	/**
	 * Read and create the list of projects, as well as load the initial project
	 */
	async created() {
		// Load the tutorials list of projects
		this.svgGenericPath = generic_raspberrypi.svgGenericPath;

		let svgList = await this.studio.filesystem.readdir('./source' + this.svgGenericPath.substr(1));
		let projectsList = [];

		for (let i = 0; i < svgList.length; i ++) {
			// The name for the SVG path
			svgList[i] = svgList[i].split('.svg')[0];

			// The name to be shown in the list
			let name = svgList[i].split(generic_raspberrypi.startingNameForTutorials)[1];
			name = name.replace(/([0-9A-Z])/g, ' $1').trim();

			projectsList.push({
				name: name,
				originalName: svgList[i],
				svgPath: svgList[i]
			});
		}

		this.projectsList = projectsList;
		this.projectsListShow = false;

		// Save the current project name
		this.projectName = generic_raspberrypi.nameStartingProject;
	},

	watch: {
		/**
		 * Load a new project for every change of the variable 'projectName'
		 * @param  {String} name The name of the project to be loaded
		 */
		projectName(name) {
			// Load the new project data
			this.loadProject(name);
		}
	},

	methods: {
		/**
		 * Load a new project with the SVG and the data required
		 * @param  {String} name The name of the project to be loaded
		 */
		loadProject(name) {
			// $.svg.addExtension('graph', SVGGraph);

			// Parse the name to be shown on the screen if needed
			this.projectNameToBeShown = name;
			if (this.projectNameToBeShown.indexOf(generic_raspberrypi.startingNameForTutorials) === 0) {
				this.projectNameToBeShown = this.projectNameToBeShown.split(generic_raspberrypi.startingNameForTutorials)[1];
				this.projectNameToBeShown = this.projectNameToBeShown.replace(/([0-9A-Z])/g, ' $1').trim();
			}

			generic_raspberrypi.loadProject(name);
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
					let svgLeftPosition = 0;
					let svgTopPosition = 0;

					let lcd = document.createElement('g');
					lcd.style.cssText = 'position: absolute; left:' + svgLeftPosition + 'px; top: ' + svgTopPosition + 'px;';
					lcd.id = 'segments_container';

					let leftPosition = 0;
					let topPosition = 0;
					for (let i = 0; i < 2; i ++) {
						for (let j = 0; j < 16; j ++) {
							let lcdSegment = document.createElement('g');

							if (j === 0 && i !== 0) {
								leftPosition = 0;
								topPosition += 21;
							}

							lcdSegment.style.cssText = 'position: absolute; left: ' + leftPosition + 'px; top: ' + topPosition + 'px; width: 12px; height: 20px; text-align: center; font-size: 15px; background: #009628';
							lcdSegment.id = 'segment ' + i + '-' + j;
							lcd.appendChild(lcdSegment);

							leftPosition += 13;
						}
					}

					// document.getElementById('lcd_display').appendChild(lcd);

					let test = $(document.createElement('g')).css('background-color', 'red').css('width', '1000').css('height', '1000');
					

					// find('g[partID="' + component + '"]')
					console.log($(document.querySelector('#raspberrypi_svg').firstElementChild).find('g[partID="' + component + '"]').css('left'));
				}
			}
		},

		/**
		 * Upload files for a new project and then load it
		 */
		async uploadOwnProject() {
			await this.studio.workspace.showDialog(LoadProject, {
				width: 1000
			});

			this.loadProject(generic_raspberrypi.ownProject.name);
		}
	}
}
</script>