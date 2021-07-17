const routes = require('next-routes')();

//adds route rule with passed in info, then template to show
routes
	.add('/campaigns/new', '/campaigns/new')
	.add('/campaigns/:address', '/campaigns/show');

module.exports = routes;