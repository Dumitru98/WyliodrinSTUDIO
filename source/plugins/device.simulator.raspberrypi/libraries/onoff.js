let onoff = 
`libraries['onoff'] = {
	Gpio: function (pin, type, edge, options) {
		this.pin = pin;
		this.type = type;
		this.edge = edge;
		this.options = options;

		onoff.Gpio.create(this.pin, this.type, this.edge);

		this.read = function() {
			return onoff.Gpio.read(this.pin, this.type);
		};

		this.readSync = function() {
			return onoff.Gpio.readSync(this.pin, this.type);
		};

		this.write = function(value) {
			onoff.Gpio.write(this.pin, this.type, value);
		};

		this.writeSync = function(value) {
			onoff.Gpio.writeSync(this.pin, this.type, value);
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