/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('movieApp',['ui.router','ngResource','movieApp.controllers','movieApp.services', 'cloudinary',  'photoAlbumAnimations',  'photoAlbumControllers',  'photoAlbumServices']);

angular.module('movieApp').config(function($stateProvider,$httpProvider){
    $stateProvider.state('movies',{
        url:'/movies',
        templateUrl:'partials/movies.html',
        controller:'MovieListController'
    }).state('viewMovie',{
       url:'/movies/:id/view',
       templateUrl:'partials/movie-view.html',
       controller:'MovieViewController'
    }).state('newMovie',{
        url:'/movies/new',
        templateUrl:'partials/movie-add.html',
        controller:'MovieCreateController'
    }).state('editMovie',{
        url:'/movies/:id/edit',
        templateUrl:'partials/movie-edit.html',
        controller:'MovieEditController'
    }).state('photoUpload', {
        url: '/photos/new',
        templateUrl: 'partials/photo-upload.html',
        controller: 'photoUploadCtrl' 
    }).state('photos', {
        url: '/photos',
        templateUrl: 'partials/photo-list.html',
        controller: 'photoListCtrl'
    });
}).run(function($state){
   $state.go('movies');
});