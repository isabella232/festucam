(function(root, factory) {
	if (typeof define === 'function' && define.amd && define.amd.dust === true) {
		define(['dust.core'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('dustjs-linkedin'));
	} else {
		factory(root.dust);
	}
}(this, function (dust) {
	dust.helpers.message = function messageHelper(chunk, context, bodies, params) {
		//simulates https://github.com/krakenjs/dust-message-helper/blob/master/index.js (paired mode)
		chunk.write(JSON.stringify(params.obi));
		//return chunk;
		return chunk.map(function (chunk) {
			chunk.render(bodies.block, context).end();
		});
	}
}));
