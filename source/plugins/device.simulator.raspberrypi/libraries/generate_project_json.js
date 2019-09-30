import xml2json from './../libraries/xml2json.js';
import generic_raspberrypi from './../libraries/generic_raspberrypi.js';

export default function generate_project_json(xml) {
	let obj = {};
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
							value: null
						}

						component.partID = connector.part.attributes.id;
						component.value = 0;
						if (connector.part.attributes.title.toLowerCase().includes('led')) {
							component.name = 'led';
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

	console.log(connections);
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

		if (connection.name.toLowerCase().includes('gpio') &&
			connection.components.length > 0) {
			newPinObject.value = 0;
			newPinObject.state = 'out';
			newPinObject.edge = '-';
			newPinObject.circuitInterruption = false;
			newPinObject.components.push(connection.components[0]);

			for (let pin of Object.keys(generic_raspberrypi.pins)) {
				if (generic_raspberrypi.pins[pin].name === connection.name) {
					newPinObject.id = pin;
					obj[pin] = newPinObject;
					break;
				}
			}
		} else if ((connection.name.toLowerCase().includes('3v3') ||
					connection.name.toLowerCase().includes('5v')) &&
					connection.components.length > 0) {
			newPinObject.id = 'voltage';
			newPinObject.value = 1;
			newPinObject.state = 'out';
			newPinObject.edge = '-';
			newPinObject.circuitInterruption = false;

			for (let component of connection.components) {
				newPinObject.components.push(component);
			}

			obj[newPinObject.id] = newPinObject;
		}
	}

	// Add the rest of the components, the ones that are not directly connected to the RPI
	let i = 0;
	while (connections[0].components.length !== 0 && i < nrOfComponents) {
		for (let component of connections[0].components) {
			for (let pin of Object.keys(obj)) {
				if (obj[pin].components.indexOf(component.start) !== -1) {
					if (components[component.finish].name === 'button') {
						obj[pin].circuitInterruption = true;
					}
					obj[pin].components.push(component.finish);
					connections[0].components.splice(connections[0].components.indexOf(component), 1);
					break;
				} else if (obj[pin].components.indexOf(component.finish) !== -1) {
					if (components[component.start].name === 'button') {
						obj[pin].circuitInterruption = true;
					}
					obj[pin].components.push(component.start);
					connections[0].components.splice(connections[0].components.indexOf(component), 1);
					break;
				}
			}
		}

		i ++;
	}

	return {
		components: components,
		pins: obj
	};
}