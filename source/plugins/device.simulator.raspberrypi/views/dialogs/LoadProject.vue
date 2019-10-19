<template>
	<v-card>
		<v-text-field v-model="nameOwnProject" dense label="Project Name"></v-text-field>
		<v-btn block color="secondary" dark @click="addSvg()">Add Project SVG</v-btn>
		<v-btn block color="secondary" dark @click="addXml()">Add Project XML</v-btn>
		<v-btn block color="secondary" dark @click="loadProject()">Load Project</v-btn>
		<v-btn block color="secondary" dark @click="close()">Close</v-btn>
	</v-card>
</template>

<script>
import generic_raspberrypi from './../../libraries/utils/generic_raspberrypi.js';

export default {
	name: 'LoadProject',

	data() {
		return {
			nameOwnProject: null,
			svgOwnProjectString: null,
			xmlOwnProjectString: null
		}
	},

	methods: {
		/**
		 * Load the SVG file from local disk
		 */
		async addSvg() {
			let files = await this.studio.filesystem.openImportDialog({
				title:'Import SVG',
				filetypes:['svg']
			});

			if (files.length) {
				let fileData = await this.studio.filesystem.readImportFile (files[0]);

				this.svgOwnProjectString = fileData.toString();
			}
		},

		/**
		 * Load the XML file from local disk
		 */
		async addXml() {
			let files = await this.studio.filesystem.openImportDialog({
				title:'Import XML',
				filetypes:['xml']
			});

			if (files.length) {
				let fileData = await this.studio.filesystem.readImportFile (files[0]);

				this.xmlOwnProjectString = fileData.toString();
			}
		},

		/**
		 * Save the name, the SVG and the XML files in the project data
		 */
		loadProject() {
			if (this.xmlOwnProject === null) {
				console.log('error no xml loaded');
			} else if (this.svgOwnProject === null) {
				console.log('error no svg loaded');
			} else {
				if (this.nameOwnProject === '' || this.nameOwnProject === null) {
					this.nameOwnProject = 'My Project';
				}

				generic_raspberrypi.ownProject.name = this.nameOwnProject;
				generic_raspberrypi.ownProject.svg = this.svgOwnProjectString;
				generic_raspberrypi.ownProject.xml = this.xmlOwnProjectString;

				this.close();
			}
		},

		/**
		 * Close the dialog
		 */
		close() {
			this.$root.$emit ('submit', undefined);
		}
	}
}
</script>