var keystone = require('keystone'),
	Gallery = keystone.list('Gallery');
var cloudinary = require('cloudinary');

exports = module.exports = function (req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.api_key = cloudinary.config().api_key;
	locals.cloud_name = cloudinary.config().cloud_name;
	locals.cloudinary = cloudinary;
	/*
	var cloudinaryUpload = cloudinary.uploader.direct_upload();
	locals.cloudinary = { 
			cloud_name: cloudinary.config().cloud_name, 
			api_key: cloudinary.config().api_key, 
			timestamp: cloudinaryUpload.hidden_fields.timestamp, 
			signature: cloudinaryUpload.hidden_fields.signature, 
			uploader: cloudinary.uploader 
	};

	locals.cloudinary_js_config = cloudinary.cloudinary_js_config();
	*/
	locals.page.title = 'Create a gallery - SriGruha';
	locals.page.cloudinaryCors = "http://" + req.headers.host + "/cloudinary_cors.html";
	
	
	view.on('post', { action: 'create-gallery' }, function (next) {
		
		// handle form
		var newGallery = new Gallery.model({
			publishedDate: new Date()
		}),

			updater = newGallery.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your new gallery:'
			});
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'name, images'
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				newGallery.notifyAdmins();
				req.flash('success', 'Your gallery has been added' + ((newGallery.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
				return res.redirect('/gallery/' + newGallery.slug);
			}
			next();
		});

	});

	view.render('createGallery'); /*, {
		cloudinary_cors: cloudinaryCors
	}); */
}
