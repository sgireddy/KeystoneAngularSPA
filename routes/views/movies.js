var keystone = require('keystone');

exports = module.exports = function (req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'movies';
	
	// Load the galleries by sortOrder
	view.query('movies', keystone.list('Movie').model.find().sort('sortOrder'));
	
	// Render the view
	view.render('movies');
	
};
