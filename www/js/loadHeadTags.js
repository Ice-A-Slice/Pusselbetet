var comp;
window.AdobeEdge = {}
function loadStyleSheet(file_path) {
	var fileref;
	// Check extension
	if (file_path.split('.')[file_path.split('.').length - 1] == 'css') {
		fileref = document.createElement('link');
		fileref.setAttribute('rel', 'stylesheet');
		fileref.setAttribute('type', 'text/css');
		fileref.setAttribute('href', file_path);
	} else {
		console.log('Error: could not load css-file: "' + file_path + '"');
		return false;
	}
	document.getElementsByTagName('head')[0].appendChild(fileref);
}
function setMetaTags(meta_object) {
	var head = document.getElementsByTagName('head')[0];
	for (m in meta_object) {
		var metas = meta_object[m];
		var metaref = document.createElement('meta');
		for (met in metas) {
			metaref.setAttribute(met, metas[met]);
		}
		// Prepend
		head.insertBefore(metaref, head.firstChild);
	}
}
// Returns the filename without extension of the page you're viewing
function getEnviroment() {

  // Get file path (ex: "folder/savanna.html")
  var path = window.location.pathname;

  // Remove the folders path and extension to get the envoriment (ex: "savanna")
  path = path.substring(path.lastIndexOf('/') + 1);
  var env = path.substring(0, path.lastIndexOf('.'));

  if (env.length === 0)
    env = 'index';

  return env;
}
// Loads a js file from an array, and when done; loads the next one in the array.
function loadJavaScripts(files, filenumber) {
	var script;
	var filenumber = filenumber || 0;
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = files[filenumber];
	script.charset = 'utf-8';
	if (files.length > filenumber + 1) {
		if (script.readyState) { //IE
			script.onreadystatechange = function () {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					loadJavaScripts(files, filenumber + 1);
				} else {
					console.log('ERROR: could not load JS-file: ' + files[filenumber]);
					loadJavaScripts(files, filenumber + 1);
				}
			};
		} else { //Others
			script.onload = function () {
				loadJavaScripts(files, filenumber + 1);
			};
			script.onerror = function() {
				console.log('ERROR: could not load JS-file: ' + files[filenumber]);
				loadJavaScripts(files, filenumber + 1);
			}
		}
	}
	document.getElementsByTagName('head')[0].appendChild(script);
}
var stylesheets = [
	'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css',
	'css/master.css',
	'css/'+ getEnviroment() + '.css'
];
var javascripts = [
	'js/lib/jquery-2.1.0.min.js',
	'js/lib/howler.js',
	'js/lib/jquery-ui.min.js',
	'js/lib/jquery.pep.js',
	'js/lib/jquery.stellar.min.js',
	'js/lib/iscroll.js',
	'js/extraJquery.js',
	'js/sounds.js',
	'db/json.js',
	'js/pep.js',
	'js/loadPage.js',
	'js/parallax.js',
	'js/iosscroll.js',
	'js/index.js'
];

var metas = {
	0: {
		'http-equiv': "X-UA-Compatible",
		'content': "IE=Edge"
	},
	1: {
		'name': 'viewport',
		// WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. 
		// See https://issues.apache.org/jira/browse/CB-4323
		// , width=device-width, height=device-height
		'content': 'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, target-densitydpi=device-dpi'
	},
	2: {
		'name': "format-detection",
		'content': "telephone=no"
	},
	3: {
		'http-equiv': 'Content-Type',
		'content': 'text/html; charset=utf-8'
	},

	4: {
		'name': 'viewport', 
		'content': 'minimal-ui'
	},

	5: {
		'name': 'apple-mobile-web-app-capable',
		'content': 'yes'
	}

}

// loadHeadTags()
if (getEnviroment() != 'index') {
	setMetaTags(metas);
	(function (csss, jss) {
		var len = csss.length;
		for (var i = 0; i < len; i++) {
			loadStyleSheet(csss[i]);
		}
		loadJavaScripts(jss);
	})(stylesheets, javascripts);
};
