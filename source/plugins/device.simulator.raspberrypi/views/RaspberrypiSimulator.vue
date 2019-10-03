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

		<template>
			<v-data-table v-show="componentsTable.length !== 0" dense hide-default-footer no-data-text="There is no pin assigned!" :headers="headerTable" :items="componentsTable" item-key="pin" class="elevation-1"></v-data-table>
		</template>

		<div id="raspberrypi_svg"></div>
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
			projectData: {}
		}
	},

	created() {
		// for (let raspberrypiSchematic of Object.keys(generic_raspberrypi.schematicsData)) {
		// 	this.projects[raspberrypiSchematic] = generic_raspberrypi.schematicsData[raspberrypiSchematic].name;
		// }

		this.projectName = generic_raspberrypi.svgLoaded;
	},

	watch: {
		projectName(name) {
			generic_raspberrypi.loadSvg(name);
			this.projectData = generic_raspberrypi.dataLoaded;

			this.componentsTable = [];

			for (let component of Object.keys(this.projectData.components)) {
				let newComponent = {
					pins: null,
					name: null,
					color: null
				};

				let pins = '';
				for (let pin of Object.keys(this.projectData.pins)) {
					console.log(this.projectData.pins[pin].components.indexOf(component) + ', ' + this.projectData.components[component].name);
					if (this.projectData.pins[pin].components.includes(component)) {
						if (pins === '') {
							pins += pin;
						} else {
							pins += ', ';
							pins += pin;
						}
					}

					break;
				}

				newComponent.pins = pins.toUpperCase();
				newComponent.name = this.projectData.components[component].name.toUpperCase();

				if (this.projectData.components[component].color) {
					newComponent.color = this.projectData.components[component].color.toUpperCase();
				} else {
					newComponent.color = '-';
				}

				this.componentsTable.push(newComponent);
			}
		}
	}
}
</script>