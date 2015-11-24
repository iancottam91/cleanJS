

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

module.exports = addContent;