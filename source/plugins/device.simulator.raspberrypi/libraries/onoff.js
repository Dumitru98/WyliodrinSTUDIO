let onoff = 
`libraries['onoff'] = {
	Gpio: function (pin, type, edge, options) {
		this.pin = pin;
		this.type = type;
		this.edge = edge;
		this.options = options;

		this.read = function() {
			onoff.Gpio.read();
		};

		this.readSync = function() {
			onoff.Gpio.readSync(this.pin);
		};

		this.write = function(value) {
			onoff.Gpio.write(value);
		};

		this.writeSync = function(value) {
			onoff.Gpio.writeSync(this.pin, value);
		};

		this.watch = function() {
			onoff.Gpio.watch();
		};

		this.unwatch = function() {
			onoff.Gpio.unwatch();
		};

		this.unwatchAll = function() {
			onoff.Gpio.unwatchAll();
		};

		this.direction = function() {
			onoff.Gpio.direction();
		};

		this.setDirection = function(value) {
			onoff.Gpio.setDirection(value);
		};

		this.activeLow = function(value) {
			onoff.Gpio.activeLow(value);
		};

		this.setActiveLow = function(value) {
			onoff.Gpio.setActiveLow(value);
		};
	}
};\n`;

export default onoff;