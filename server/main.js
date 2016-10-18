import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {

 Meteor.publish('links', function() {
 	return Links.find({});
 });

});

//runs when user visits with localhost:3000/abcd
function onRoute(req, res, next) {

//take out token find match link in links collection
const link = Links.findOne({ token: req.params.token });

//if link is found redirect user to long url - if not send to app
	if (link) {

		Links.update(link, { $inc: { clicks: 1 }});

		res.writeHead(307, { 'Location': link.url });
		res.end();

	} else {
		next();

	}

}

//use for changing logo if coming from certain url
const middleware = ConnectRoute(function(router){
	router.get('/:token', onRoute);
});

WebApp.connectHandlers.use(middleware);
	