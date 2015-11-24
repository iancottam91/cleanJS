# cleanJS

## Clean and enhance your offline HTML files

clean.js is a simple Node.js module that allows you to process a batch of html files programmatically or through the command line. clean.js will allow the following operations:

* remove elements specified by a jquery selector 
* add custom styles
* create new elements in defined locations
* custom operations, coded in a JavaScript function

## Usage

install through npm ny running:

`npm install cleanjs`

require the module from your Node.js application:

`var cleanFiles = require('cleanjs');
cleanFiles();`

cleanjs exports a function that takes 5 parameters. If you call the function without any parameters and run the above code from the command line, you will be prompted for them. Otherwise you can provide the parameters in your application:

`cleanFiles(directory, elementsToDelete, customStyles, customFunction, callback);`

---

directory: the absolute path to the directory containing your html content

---

elementsToDelete: a string of comma separated jQuery selectors to specify elements to delete

---

customStyles: A set of css rules defined as a string to be applied to each page

---

customFunction: A custom js function. The function should take one parameter 'html', which is the full HTML document as a jQuery variable. It should return the same varaible after manipulation.

--- 

callback: 



## Examples

1. Use example.js to process the data in /test-data. To do this open a command prompt in the 'examples' directory and run:

`node example.js`

2. Use commandUse.js to fill in the parameters at the command line. Open a command prompt in the root directory and run:

`node commandUse.js`
