var request = require('request');

function Slack(url, channel) {
	this.url = url || process.env.SLACK_HOOK_URL;
	this.channel = channel || process.env.SLACK_CHANNEL || '#general';
}

// Build a JSON payload for a simple text message
Slack.prototype.postText = function(msg) {

	// Build the JSON payload to send to Slack
	var payload = {
		"channel": this.channel,
		"username": "Camayak",
		"text": msg,
		"icon_url": process.env.HEROKU_URL + "/camayak.png"
	};

	this.send(payload);

}

// Build a JSON payload for a rich message
Slack.prototype.postRich = function(msg) {

	// Fallback for fallback text
	msg.fallback = msg.fallback || msg.pretext;

	var payload = {
		"channel": this.channel,
		"username": "Camayak",
		"icon_url": process.env.HEROKU_URL + "/camayak.png",
		"attachments": [{
			"fallback": msg.fallback,
			"pretext": msg.pretext,
			"color": msg.color,
			"fields": msg.fields
		}]
	};

	this.send(payload);

}

// Send the JSON payload to Slack
Slack.prototype.send = function(payload) {

	request.post({
		uri: this.url,
		body: JSON.stringify(payload)
	}, function (error, response, body) {
		if(error) {
			console.error(error);
		}
		else if(body != 'ok') {
			console.error(body);
		}
		else {
			console.log('Successfully POSTed payload ' + JSON.stringify(payload) + ' to Slack');
		}
	});

}

module.exports = Slack;