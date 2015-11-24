// require local module
var cleanFiles = require('../src/index.js');

// read file from file system

// var dir = process.argv[2];

var directory = "./test-data";



function logFileName(err, fileName){

	console.log(err);
	console.log('All files saved');

}



var elementsToDelete = 'script, .top-navbar .visible-desktop, .bottom-navbar-wrap, .sidebar-right > *, .author-about, .share-buttons, .global-footer .center-container, .display-opts, .related_items, .gallery-thumbnails-wrapper';

var customStyles = '<style>\
    #search-submit { width: 42px; }\
    #search-text {border: 1px solid #ddd;float: left;height: 40px;}\
    #site-search .input-fields { margin: 5px 0; }\
    #gallery-wrapper .gallery-inner-wrap{height: auto;}\
  </style>';

 // this needs to be a function that you write outside the module
var customFunction = function(cheerioHTML){

  // add sidebar
  var sidebarSearch = "<form id='site-search' action='#' method='get'>\
    <label for='search-text'>Search Cycling News</label>\
    <div class='input-fields'>\
      <input class='search-text' id='search-text' name='search-text' required='required' type='text' value=''>\
      <input class='input-search' id='search-submit' title='Submit' type='submit' value='' alt='Search Submit'>\
    </div>\
    <p>Type a keyword or a title</p>\
  </form>";
  cheerioHTML.find('.sidebar-right').append(sidebarSearch);

  // add back to news
  if(cheerioHTML.find('body').attr('id') !== "news"){
    cheerioHTML.find('#content').prepend('<div><a href="../index.html">back to news</a></div>');
  }

  return cheerioHTML;
}


cleanFiles(directory, elementsToDelete, customStyles, customFunction, logFileName);


// export a function called cleanFiles.customManipulation, then use this a parameter for cleanFiles?!




// exports:
// - module.clean(dir, eleToDelete)
// the basic clean and elements to dele


// How to encorporate?!

// styles to add
// elements to add
