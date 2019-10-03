import xml2json from './../libraries/xml2json.js';
import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

export default function generate_project_json(xml, name) {
	let projectJson = {};
	let nrOfComponents = 0;
	let netArray = xml2json(xml).net;

	let connections = [{
		name: 'wire',
		components: []
	}];

	let components = {};

	// Create the list of the components and the connections list
	for (let net of netArray) {
		if (net.connector.length > 1) {
			let connection = {
				name: null,
				components: []
			};

			for (let connector of net.connector) {
				if (connector.part.attributes.title === 'Raspberry Pi 3') {
					connection.name = connector.attributes.name;
				} else {
					if (connection.components.indexOf(connector.part.attributes.id) === -1) {
						connection.components.push(connector.part.attributes.id);
					}

					if (Object.keys(components).indexOf(connector.part.attributes.id) === -1) {
						let component = {
							name: null,
							active: null
						}

						component.active = false;
						if (connector.part.attributes.title.toLowerCase().includes('led')) {
							component.name = 'led';
							component.color = connector.part.attributes.title.toLowerCase().split(' ')[0];
						} else if (connector.part.attributes.title.toLowerCase().includes('button')) {
							component.name = 'button';
						} else if (connector.part.attributes.title.toLowerCase().includes('pot')) {
							component.name = 'potentiometer';
						}

						components[connector.part.attributes.id] = component;

						nrOfComponents ++;
					}
				}
			}

			if (connection.name === null) {
				connections[0].components.push({
					start: connection.components[0],
					finish: connection.components[1]
				})
			} else {
				connections.push(connection);
			}
		}
	}

	// Create RPI pins with first component
	for (let connection of connections) {
		let newPinObject = {
			id: null,
			value: null,
			edge: null,
			state: null,
			circuitInterruption: null,
			components: []
		};

		if (connection.name.toLowerCase().includes('gipo') &&
			connection.components.length > 0) {
			newPinObject.value = 0;
			newPinObject.state = 'none';
			newPinObject.edge = 'none';
			newPinObject.circuitInterruption = false;
			newPinObject.components.push(connection.components[0]);

			for (let pin of Object.keys(generic_raspberrypi.pins)) {
				if (generic_raspberrypi.pins[pin].name === connection.name) {
					newPinObject.id = pin;
					projectJson[pin] = newPinObject;
					break;
				}
			}
		} else if (connection.name.toLowerCase().includes('3v3') &&
					connection.components.length > 0) {
			newPinObject.id = '3v3';
			newPinObject.value = 1;
			newPinObject.state = 'out';
			newPinObject.circuitInterruption = false;

			for (let component of connection.components) {
				newPinObject.components.push(component);
			}

			projectJson[newPinObject.id] = newPinObject;
		} else if (connection.name.toLowerCase().includes('5v') &&
					connection.components.length > 0) {
			newPinObject.id = '5v';
			newPinObject.value = 1;
			newPinObject.state = 'out';
			newPinObject.circuitInterruption = false;

			for (let component of connection.components) {
				newPinObject.components.push(component);
			}
		}
	}

	// Add the rest of the components, the ones that are not directly connected to the RPI
	let i = 0;
	while (connections[0].components.length !== 0 && i < nrOfComponents) {
		for (let component of connections[0].components) {
			for (let pin of Object.keys(projectJson)) {
				if (projectJson[pin].components.indexOf(component.start) !== -1) {
					if (components[component.finish].name === 'button') {
						projectJson[pin].circuitInterruption = true;
					}

					projectJson[pin].components.push(component.finish);
					connections[0].components.splice(connections[0].components.indexOf(component), 1);
				} else if (projectJson[pin].components.indexOf(component.finish) !== -1) {
					if (components[component.start].name === 'button') {
						projectJson[pin].circuitInterruption = true;
					}

					projectJson[pin].components.push(component.start);
					connections[0].components.splice(connections[0].components.indexOf(component), 1);
				}
			}
		}

		i ++;
	}

	return {
		name: name,
		components: components,
		pins: projectJson
	};
}