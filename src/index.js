// require file system module
var mkdirp = require("mkdirp");
var fs = require('fs');
var path = require('path');
var getDirName = require("path").dirname
var cheerio = require('cheerio');
var prompt = require('prompt');

var saveFile = function (filePath, elementsToDelete, stylesToAdd, customFunction, callback) {

	var saveTo = filePath.split("\data")[0] + "data-new" + filePath.split("\data")[1];

  var cleanedContent = "Hello World Beater";
  
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    cleanedContent = cleanFile(data, elementsToDelete, stylesToAdd ,customFunction);

    // make the directory if it doesn't exist
    mkdirp(getDirName(saveTo), function (err) {
      if (err) return callback(err)
      fs.writeFile(saveTo, cleanedContent, callback(saveTo));
    });
  });
}


var cleanFile = function(data, elementsToDelete, stylesToAdd, customFunction, callback){

  var $ = cheerio.load(data);
  var html = $('html');
  html.find(elementsToDelete).remove();

  if(customFunction !== false){
    html = customFunction(html);
  }

  // make conditional on whether parameter is passed
  if(stylesToAdd !== false){
    html = addStyles(html, stylesToAdd);
  }


  return html;

}

// this needs to be a function that you write outside the module
var addStyles = function(cheerioHTML, stylesToAdd){

  cheerioHTML.find('head').append(stylesToAdd);
  return cheerioHTML;

}

// this needs to be a function that you write outside the module
var addContent = function(cheerioHTML){

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


// need to work on where the custom call back would come in. If at all

var cleanFiles = function(dir, elementsToDelete, stylesToAdd, customFunction, callback) {


  if(dir === undefined || dir === ""){
    promptForParameters()
    return;
  }

    var results = [];

    fs.readdir(dir, function(err, list) {

      if (err) return callback(err);
      var pending = list.length;

      if (!pending) return callback(null, results);
      list.forEach(function(file) {

        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {

          if (stat && stat.isDirectory()) {

            cleanFiles(file, elementsToDelete, stylesToAdd, customFunction, function(err, res) {
              results = results.concat(res);
              if (!--pending) {
                console.log('Finished building results array.');
              }
            });

          } else {

            // start to save the files now
            results.push(file);
            saveFile(file, elementsToDelete, stylesToAdd, customFunction, confirmSaved);
            if (!--pending) callback(null, results);

          }
        });

      });

    });

};

var promptForParameters = function(){

  // definie the schema for console input
  var initialSchema = {
    properties: {
      directory_path: {
        required: true
      },
      elements_to_delete: {
        required: true
      }
    }
  };

  var stylesOptionSchema = {
    properties: {
      add_custom_styles: {
        pattern: /^[yes|no]+$/i,
        message: "You must answer with yes or no"
      }
    }
  }

  var stylesDir = {
    properties: {
      custom_styles_path: {
        required: true
      }
    }
  }

  var customFnOptionSchema = {
    properties: {
      add_custom_fn: {
        pattern: /^[yes|no]+$/i,
        message: "You must answer with yes or no"
      }
    }
  }

  var customFn = {
    properties: {
      custom_fn_path: {
        required: true
      }
    }
  }

  var dir = "";
  var ele = "";

  var customStyles = false;
  var customStylesPath = false;
  var customStylesCSS = false;

  // begin interactions

  console.log('\nYou need to provide a directory with files to clean & some elements to delete!\n');
  prompt.start();
 
  // get directory and elements to delete
  prompt.get(initialSchema, function (err, result) {

    dir = result.directory_path;
    ele = result.elements_to_delete;


    console.log('\nThanks!\nWould you like to add some custom styles to your HTML files? (Answer Yes or No)\n');

    prompt.get(stylesOptionSchema, function (err, result) {
      console.log(result.add_custom_styles);
      if(result.add_custom_styles.toLowerCase() === "no"){

        // call function without custom styles
        console.log('ok, no custom styles then!');

        // add custom JS function
        console.log('\n\nWould you like to apply some custom functionality to your HTML files? (Answer Yes or No)\n');
        prompt.get(customFnOptionSchema, function (err, result) {
          if(result.add_custom_fn.toLowerCase() === "no"){
            cleanFiles(dir, ele, false, false, console.log('x'));
          } else {

            console.log("\nEnter the path to your custom js function. This must be a single JS file that exports a single function. The function should take one parameter 'html', which is the full HTML document as a jQuery variable. It should return the same varaible after manipulation.\n");
            // prompt for directory of JS funtion
            // load it
            prompt.get(customFn, function (err, result) {
              console.log(result.custom_fn_path);
              customFnPath = result.custom_fn_path;

              // open the file and read the function
              var addContent = require(customFnPath);
              // fs.readFile(customFnPath, "utf-8", function (err, data) {

              //   var addContent =  require('./tools');
              //   console.log(addContent);
              cleanFiles(dir, ele, false, addContent, console.log('x'));
              // });
            });

          }

        });

      } else {
        customStyles = true
        console.log('\nEnter the path to your custom stylesheet\n');
        // get the file name for custom styles
        prompt.get(stylesDir, function (err, result) {
          console.log(result.custom_styles_path);
          customStylesPath = result.custom_styles_path;

          // open the file and read the styles          

          // fs.readFile("C:/Users/CottaI01/Documents/Projects/SearchIO/cleanjs/resources/styles.css", "utf8", function (err, data) {
          fs.readFile(result.custom_styles_path, function (err, data) {
            if (err) throw err;
            customStylesCSS = "<style>" + data + "</style>";

            // cleanFiles(dir, ele, customStylesCSS, false, console.log('x'));
            // add custom JS function
            console.log('\n\nWould you like to apply some custom functionality to your HTML files? (Answer Yes or No)\n');

            prompt.get(customFnOptionSchema, function (err, result) {
              if(result.add_custom_fn.toLowerCase() === "no"){
                cleanFiles(dir, ele, customStylesCSS, false, console.log('x'));
              } else {

                console.log("\nEnter the path to your custom js function. This must be a single JS file that exports a single function. The function should take one parameter 'html', which is the full HTML document and a jQuery variable. It should return the same varaible after manipulation.\n");
                // prompt for directory of JS funtion
                // load it
                prompt.get(customFn, function (err, result) {
                  console.log(result.custom_fn_path);
                  customFnPath = result.custom_fn_path;

                  // open the file and read the function
                  var addContent = require(customFnPath);
                  // clean the folder
                  cleanFiles(dir, ele, customStylesCSS, addContent, console.log('x'));
                  
                });

              }
            });

          });


        });

      }
    });

  });


}

// currently we overwrite all the files

var confirmSaved = function (fileName){
    console.log('file saved at: ' + fileName);
}

// module.exports = logList;
module.exports = cleanFiles;