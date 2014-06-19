var express = require("express");
var app = express();
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});

// Require middleware
var logfmt = require("logfmt");
var bodyParser = require('body-parser');

// Require custom modules
var Slack = require('./slack');
var Camayak = require('./camayak');

// Make sure the required environmental variables are set
if(!process.env.SLACK_HOOK_URL) {
	throw new Error('The Slack Webhook URL is required.');
}
if(!process.env.CAMAYAK_API_KEY && !process.env.CAMAYAK_SUBDOMAIN && !process.env.CAMAYAK_API_SECRET) {
	throw new Error('The Camayak API key, shared secret and subdomain are required.');
}

var slack = new Slack();

var camayak = new Camayak.API();

app.use(express.static('static'));

app.get('/', function(req, res) {
	res.send('Nothing to see here.', 200);
});

app.use(logfmt.requestLogger());

app.use(bodyParser.json());
app.post('/', function(req, res) {
	var signature = req.get('Camayak-Signature');
	var eventType = req.param('event');
	if(eventType == 'validate') {
		res.set('Content-Type', 'text/plain');
		res.send('pong', 200);
	}
	else if(eventType == 'publish') {
		if(camayak.signature() == signature) { // TODO: Validate the shared secret here
			var resource = req.param('resource_uri');
			var story = new Camayak.Story(camayak, resource);
			story.on('ready', function() {
				var payload = {
					"fallback": "Story approved for publishing: " + story.headline(),
					"pretext": "Story approved for publishing:",
					"fields": [
						{"title": story.headline(), "value": story.teaser(), "short": false},
						{"title": "Byline", "value": story.byline(), "short": true},
						{"title": "Media", "value": story.media(), "short": true}
					]
				};
				slack.postRich(payload);
				res.send(200);		
			});
			story.on('error', function(e) {
				res.send(e, 500);
			});
		}
		else {
			console.error("Invalid shared secret.");
			res.send("Invalid shared secret.", 403);
		}
	}
	else if(eventType == 'retract') {
		// Acknoledge a retract event, but don't do anything with it
		res.send(200);
	}
	else {
		console.log("Unsupported event type.");
		res.send("Only validate, publish and retract events are supported.", 400);
	};
});