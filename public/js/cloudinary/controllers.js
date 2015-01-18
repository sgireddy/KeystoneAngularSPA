'use strict';

/* Controllers */

var photoAlbumControllers = angular.module('photoAlbumControllers', ['angularFileUpload']);

photoAlbumControllers.controller('photoUploadCtrlJQuery', ['$scope', '$rootScope', 
  /* Uploading with jQuery File Upload */
  function ($scope, $rootScope) {
        
        $scope.updateTitle = function () {
            var uploadParams = $scope.widget.fileupload('option', 'formData');
            uploadParams["context"] = "photo=" + $scope.title;
            $scope.widget.fileupload('option', 'formData', uploadParams);
        };
        
        $scope.widget = $(".cloudinary_fileupload")
      .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, { tags: 'myphotoalbum', context: 'photo=' }, {
            // Uncomment the following lines to enable client side image resizing and valiation.
            // Make sure cloudinary/processing is included the js file
            //disableImageResize: false,
            //imageMaxWidth: 800,
            //imageMaxHeight: 600,
            //acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
            //maxFileSize: 20000000, // 20MB
            dropZone: "#direct_upload",
            start: function (e) {
                $scope.status = "Starting upload...";
                $scope.$apply();
            },
            fail: function (e, data) {
                $scope.status = "Upload failed";
                $scope.$apply();
            }
        })
      .on("cloudinaryprogressall", function (e, data) {
            $scope.progress = Math.round((data.loaded * 100.0) / data.total);
            $scope.status = "Uploading... " + $scope.progress + "%";
            $scope.$apply();
        })
      .on("cloudinarydone", function (e, data) {
            $rootScope.photos = $rootScope.photos || [];
            data.result.context = { custom: { photo: $scope.title } };
            $scope.result = data.result;
            $rootScope.photos.push(data.result);
            $scope.$apply();
        });
    }]).controller('photoUploadCtrl', ['$scope', '$rootScope', '$upload', 
  /* Uploading with Angular File Upload */
  function ($scope, $rootScope, $upload) {
        $scope.$watch('files', function () {
            if (!$scope.files) return;
            $scope.files.forEach(function (file) {
                $scope.upload = $upload.upload({
                    url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
                    data: { upload_preset: $.cloudinary.config().upload_preset, tags: 'myphotoalbum', context: 'photo=' + $scope.title },
                    file: file
                }).progress(function (e) {
                    file.progress = Math.round((e.loaded * 100.0) / e.total);
                    file.status = "Uploading... " + file.progress + "%";
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }).success(function (data, status, headers, config) {
                    $rootScope.photos = $rootScope.photos || [];
                    data.context = { custom: { photo: $scope.title } };
                    file.result = data;
                    var tmp = {};

                    tmp["public_id"] = data.public_id.substring(14);
                    tmp["version"] = data.version;
                    tmp["signature"] = data.signature;
                    tmp["width"] = data.width;
                    tmp["height"] = data.height;
                    tmp["format"] = data.format;
                    tmp["resource_type"] = data.resource_type;
                    tmp["url"] = data.url;
                    tmp["secure_url"] = data.secure_url;
                    //tmp["etag"] = data.etag;
                                   

                    $scope.movie.images.push(JSON.stringify(tmp));
                    //$scope.movie["images_upload"] = JSON.stringify(tmp);

                    $rootScope.photos.push(data);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            });
        });
        
        /* Modify the look and fill of the dropzone when files are being dragged over it */
        $scope.dragOverClass = function ($event) {
            var items = $event.dataTransfer.items;
            var hasFile = false;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {  
                    if (items[i].kind == 'file') {
                        hasFile = true;
                        break;
                    }
                }
            } else {
                hasFile = true;
            }
            return hasFile ? "dragover" : "dragover-err";
        };
    }]);