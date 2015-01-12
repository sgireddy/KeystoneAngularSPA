var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Movie Model
 * ==========
 */

var Movie = new keystone.List('Movie', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

Movie.add({
    title: { type: String, required: true },
    director: { type: String },
    releaseYear: { type: Types.Number },
    genre: { type: String },
    //heroImage: { type: Types.CloudinaryImage },
    images: { type: Types.CloudinaryImages }
});

Movie.defaultColumns = 'title, director|20%, releaseYear|10%, genre|20%';
Movie.register();
