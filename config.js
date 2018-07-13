var config = {
	host_url: process.env.HOST_URL,		// mounted on this url
	base: "/",								// add a base url path. e.g: "/auth"
	base_api: "/api",						// api base path
	port: 6284,
	// bind: "127.0.0.1",					// bind to an ip

	debug: false,							// add stack trace & infos in errors


	staticsalt: process.env.STATIC_SALT,
	publicsalt: process.env.PUBLIC_SALT,

	redis: {
		port: 6379,
		host: process.env.REDIS_TCP_ADDR,
		// password: '...my redis password...',
		// database: ...0~15...
		// options: {...other options...}
	},

	plugins: [

	]
};

try {
	if (__dirname != process.cwd()) {
		var instance_config = require(process.cwd() + '/config.js');
		for (var k in instance_config) {
			config[k] = instance_config[k];
		}
	}
} catch (e) {
	console.log('No config file found, using defaults');
}

try {
	if (__dirname != process.cwd()) {
		var instance_config = require(process.cwd() + '/config.local.js');
		for (var k in instance_config) {
			config[k] = instance_config[k];
		}
	}
} catch (e) {
}

module.exports = config;
