var async = require('async'),
	keystone = require('keystone');

var Movie = keystone.list('Movie');

/**
 * List Movies
 */

exports.list = function (req, res) {
	
	var query = Movie.model.find();

	// If a title is provided, use regex to limit matches
	if (req.query.title) {
		query.where('title', new RegExp(keystone.utils.escapeRegExp(req.query.title), 'gi'));
	}
	
	// If a category is provided, only match movies related to that category
	if (req.query.category) {
		query.where('categories').in([req.query.category]);
	}
	
	
	query.exec(function (err, items) {
		
		if (err) return res.apiError('database error', err);		
		res.apiResponse(items);
		/*res.apiResponse({
			movies: items
		});*/
	});
}



/**

 * Get Movie by ID

 */

exports.get = function (req, res) {
	
	Movie.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse(item);
		/*res.apiResponse({
			movie: item
		});*/
	});
}


/**
 * Create a Movie
 */

exports.create = function (req, res) {
	
	var item = new Movie.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function (err) {
		if (err) return res.apiError('error', err);
		res.apiResponse(item);
		/*res.apiResponse({
			movie: item
		});*/
	});
}


/**
 * Get Movie by ID
 */

exports.update = function (req, res) {
	Movie.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		var data = (req.method == 'PUT') ? req.body : req.query;
		item.getUpdateHandler(req).process(data, function (err) {
			if (err) return res.apiError('create error', err);
			res.apiResponse(item);
			/*res.apiResponse({
				movie: item
			});*/
		});
	});
}

/**
 * Delete Movie by ID
 */

exports.remove = function (req, res) {
	Movie.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			return res.apiResponse({
				success: true
			});
		});
	});
}

