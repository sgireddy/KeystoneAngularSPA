var async = require('async'),
	keystone = require('keystone'),
	_ = require('underscore'),
	mongoose = require('mongoose');

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
	var movie = new Movie.model();
	
	movie.title = data.title;
	movie.director = data.director;
	movie.releaseYear = data.releaseYear;
	movie.genre = data.genre;
	
	_.each(data.images, function (elm, idx, arr) {
		var tmp = {};
		tmp["public_id"] = elm.public_id; 
		tmp["version"] = elm.version;
		tmp["signature"] = elm.signature;
		tmp["width"] = elm.width;
		tmp["height"] = elm.height;
		tmp["format"] = elm.format;
		tmp["resource_type"] = elm.resource_type;
		tmp["url"] = elm.url;
		tmp["secure_url"] = elm.secure_url;
		tmp["_id"] = mongoose.Types.ObjectId();        
		movie.images.push(tmp);
	});	
	
	movie.save(function (err) {
		if (err) return res.apiError('error', err);
		res.apiResponse(movie);		
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

