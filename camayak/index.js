var request = require('request');
var events = require('events');
var _ = require('underscore');
var crypto = require('crypto');

// API class
function API(key, secret, subdomain) {
	this.key = key || process.env.CAMAYAK_API_KEY;
	this.secret = secret || process.env.CAMAYAK_API_SECRET;
	this.subdomain = subdomain || process.env.CAMAYAK_SUBDOMAIN;
}

// Method to generate a signature for API request signing
// and Webhook verification
API.prototype.signature = function(i) {
	i = i || 0;
	date = Math.floor(Date.now() / 1000 + i).toString();
	hmac = crypto.createHmac("sha1", this.secret);
	hmac.update(date);
	hmac.update(this.key);
	return hmac.digest("hex");
}

// Verify the signature by calculating a series of hashes,
// then verify against the series
API.prototype.verifySignature = function(signature) {
	var hashes = [this.signature()];
	for(var i = -5; i <= 5; i++) {
		hashes.push(this.signature(i));
	}
	return _.contains(hashes, signature);
}

// Story class ...
function Story(api, uri) {
	this.api = api;
	this.uri = uri;
	this.fetch();
}

// ... that is an EventEmitter
Story.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Story,
        enumerable: false
    }
});

// The fetch method pulls down the story from the CAMAYAK
// API and emits a ready event when it's available
Story.prototype.fetch = function() {
	var self = this;
	var options = {
		uri: this.uri,
		qs: {
			api_key: this.api.key,
			api_sig: this.api.signature()
		},
		json: true
	};
	request.get(options, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			self.resource = body;
			self.emit('ready', body);
		}
		else {
			console.error(JSON.stringify(body));
			self.emit('error', error);
		}
	});
};

// Return a comma-separated byline where each name
// links to the author's profile page
Story.prototype.byline = function() {
	return _.map(this.resource.bylines, function(el) {
		return '<https://' + this.api.subdomain + '.camayak.com/#/profile/' + el.uuid + '|' + el.first_name + ' ' + el.last_name + '>'
	}, this).join(', ');
};

// Return a comma-separated list of media elements
// ex: 3 images, 2 pdfs, 1 video
Story.prototype.media = function() {
	if(this.resource.media) {
		return _.chain(this.resource.media)
			.pluck('type')
			.countBy(function(el) {
				var mime = el.split('/');
				if(mime[0] == 'application') {
					return mime[1] + 's';
				}
				else {
					return mime[0] + 's';
				}
			})
			.map(function(value, key) {
				return value + ' ' + key;
			})
			.value().join(', ');
	}
	else {
		return "None";
	}
};

// If the teaser is set, return it; otherwise,
// create one from the content field
Story.prototype.teaser = function(length) {
	var teaser = this.resource.teaser || this.resource.content;
	var length = length || 150;
	return teaser.replace(/(<([^>]+)>)/ig,"").substring(0, length).trim() + '...';
}

// Getter for the headline
Story.prototype.headline = function() {
	return this.resource.heading;
};

module.exports.API = API;
module.exports.Story = Story;