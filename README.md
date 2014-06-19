Camayak to Slack
=====
At [TCU 360](https://www.tcu360.com), we publish from Camayak to our Drupal CMS using copy-paste, so getting notifications in Slack when stories are ready to post is a big help.

**camayak-to-slack** allows [Slack](https://slack.com/) to function as a [Camayak](http://www.camayak.com/) publishing destination. When stories are published, a message is pushed to Slack with the story's byline, headline, teaser and some info on the types of media attached.

This app, which runs on Node.js, should easily run on Heroku's free tier. It receives a webhook from Camayak, grabs the story from Camayak's [Content API](http://support.camayak.com/the-camayak-content-publishing-api/) and pushes it to by posting an incoming webhook.

Setup
-----
1. Push this repo to Heroku. Set the Heroku environment variable `HEROKU_URL` to the app's URL (ex: http://your-app.herokuapp.com).
2. Add an incoming webhook in Slack. Don't worry about any of the settings (bot name, etc.) because those will be set by this app. Set the environment variable `SLACK_HOOK_URL` to the webhook's URL. Optionally, set `SLACK_CHANNEL` to the channel you'd like notifications pushed to. It'll post to #general by default.
3. Setup a new Content API publishing destination in Camayak. Use the Heroku app's URL (preferably the `https` version) as the *Webhook notify URL* and add a secret *Shared secret* of your choice. Set the `CAMAYAK_API_KEY`, `CAMAYAK_API_SECRET` and `CAMAYAK_SUBDOMAIN` environment variables accordingly.
4. That's it! You should now be receiving notifications in Slack for any Camayak items that are set to publish to your new Slack publishing destination.

Development
-----
This was a one-day project to add a little efficiency to our lives and see what was possible with the Camayak API, so there's probably plenty that can be improved (for one, we don't handle retract events or distinguish between updates and first-time publication). That said, pull requests and issue reports are most appreciated.

License
-----
The MIT License (MIT)

Copyright (c) 2014 TCU Student Media

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.