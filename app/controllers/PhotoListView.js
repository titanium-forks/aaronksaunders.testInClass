//
// This is the controller for the PhotoListView, it has a matching .tss and .xml
// file which represent the styles and the presentation layer associated with
// this controller
//
// NOTE: Controllers for Tabs are all loaded when the tabGroup is opened, NOT when the
// tabs is switched to.
//

// variables passed into the controller
var args = arguments[0] || {};

// will use this for promises the same way we did in Ionic
var Q = require('q');

// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Cloud
// make sure you add the module in tiapp.xml
var Cloud = require('ti.cloud');

// using for time formatting - http://momentjs.com/
var moment = require('moment');

Ti.API.info('Loaded PhotoListView Controller');

/**
 * a public function for loading the images from ACS into a view for
 * the purpose of demonstrating ListViews and ListViewTemplates
 */
$.loadImages = function loadImages() {
	Ti.API.info('PhotoListView Controller: loadImages');

	// call ACS to get current List of photos
	getPhotosFromACS().then(function(_photos) {
		Ti.API.info(JSON.stringify(_photos, null, 2));

		// add photos to UI
		addPhotosToTableView(_photos);

	}, function(_error) {
		alert('Error:\n' + ((_error.error && _error.message) || JSON.stringify(_error)));
	});
};

/**
 * http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Cloud.Photos
 *
 * incorporating promises with ACS Cloud library to call ACS and get any photos
 */
function getPhotosFromACS() {
	var deferred = Q.defer();

	Cloud.Photos.query({
		page : 1,
		per_page : 100
	}, function(results) {
		if (results.success) {
			deferred.resolve(results.photos);
		} else {
			deferred.reject(e);
		}
	});
	return deferred.promise;
}

/**
 *
 */
function addPhotosToTableView(_photos) {

	for (var i = _photos.length - 1; i >= 0; i--) {

		// _photos[i].created_at - format the date using moment library
		var convertedDate = moment(_photos[i].created_at).format('MMMM Do YYYY, h:mm:ss a');
		var dateAndName = _photos[i].user.username + " - " + convertedDate;

		var listItem = {
			properties : {
				photoObject : _photos[i]
			},
			fileName : {
				text : _photos[i].filename
			},
			dateCreated : {
				//text :
				text : dateAndName
			},
			template : 'listViewTemplate',
			thumbImage : {
				image : _photos[i].urls.small_240
			}
		};

		$.listViewSection.appendItems([listItem]);
	}
}