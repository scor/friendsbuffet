
//check with background about the plugin options and run the script when options are available
chrome.extension.sendRequest({msg: "check_opts"}, function(response) {
							 callback(response);
							 });


function callback (options) {





		rdfs.push({"href": document.location.href, "title": "RDFa", "type": rdfa_type});



  //send message to render the icon (or not)
  if (rdfs.length > 0) {
    // Notify the extension needs to show the RSS page action icon.
    chrome.extension.sendRequest({msg: "rdfDetected", rdfs: rdfs});
  }

}



//alert('e');
//jQuery(function() {

//window.localStorage['bla'] = 'hi';
//console.log(window.localStorage);

var store = new LinkedData.API.data.Store();
var parser = new LinkedData.API.data.Parser(store);
parser.parse();

//    var foundin = $('*:contains("Today")');
console.log(parser);

console.log('ff2');


people = find_people(store);
  console.log(people);

//name = query(store, people[0], 'foaf:name', null, 'o');
//console.log(name);


    var xPathQuery = '//*[@about="http://www.ivan-herman.net/foaf#me"]//img[contains(@rel,"foaf:depiction")]';
    var xPathResult = document.evaluate(
        xPathQuery,
        document,
        null,
        XPathResult.ANY_TYPE,
        null);
//console.log(xPathQuery);
//console.log(xPathResult);
    var nodes = [];
    var node;
    while (node = xPathResult.iterateNext()) {
      photo = node.src;
      break;
    }

console.log(photo);
//console.log(nodes);




        jQuery.each(people, function (i, p) {
//          console.log(p);
//          console.log('searching...');
          name = query(store, p, 'foaf:name', null, 'o');
console.log(name);
          // lda does not support @scr objects and cannot find a picture.






          photo = query(store, p, 'foaf:depiction', null, 'o');
//console.log(photo);

        });

/**
 * Query store based on a simple triple pattern.
 *
 * @todo only support one result
 */
function query(store, s, p, o, selector) {
  if (store.length > 0) {
    var results = [];
    for (var i = 0, length = store.length; i < length; i++) {
      var triple = store.get(i);
      var subject = triple.getSubject();
      var property = triple.getProperty();
      var object = triple.getObject();

      if (s !== null && s !== subject) {
        // No match.
        continue;
      }

      if (p !== null && p !== property) {
        // No match.
        continue;
      }

      if (o !== null && o !== object) {
        // No match.
        continue;
      }

      // If we got so far, we must have a matching triple.
      switch(selector) {
        case 's':
          result = subject;
          break;
        case 'p':
          result = property;
          break;
        case 'o':
          result = object;
          break;
      }
      return result;
    }
  }
}

function select(store, s, p) {
  if (store.length > 0) {
    for (var i = 0, length = store.length; i < length; i++) {
      var triple = store.get(i);
      var subject = triple.getSubject();
      var property = triple.getProperty();
      var object = triple.getObject();
console.log(property);
//console.log(property.toString());
console.log(object);
//console.log(object.toString());

      // @fixme there is a bug in lda which returns object CURIEs wrapped with <>.
      if (subject == s && property == p) {
console.log(p);
console.log(object);
        return object;
      }
    }
  }
}

/**
 * Find people described in the page.
 *
 * @todo use foaf:primaryTopic to narrow down the main person in the page.
 */
function find_people(store) {
if (store.length > 0) {
  var people = [];
  for (var i = 0, length = store.length; i < length; i++) {
    var triple = store.get(i);
    var subject = triple.getSubject();
    var property = triple.getProperty();
    var object = triple.getObject();
//console.log(property);
//console.log(property.toString());
//console.log(object);
//console.log(object.toString());
    // foaf:Person
    // @fixme there is a bug in lda which returns object CURIEs wrapped with <>.
    if (property == '&lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#type&gt;' && object == '&lt;foaf:Person&gt;') {
      people.push(subject);
    }
  }
  //console.log(people);
  return people;

//  chrome.extension.sendRequest({show: "icon", html: triplesHtml});
} else {
//  chrome.extension.sendRequest({show: "no_icon"});
}
}

//$("#mydiv").find(':contains(\'Today\')').prepend('found you!');
//$('*:contains(\'Today\')').prepend('found you!');

//e = document.getElementsByProperty('foaf:OnlineAccount');
//var e = LinkedData.API.getElementsByProperty('affiliation');
//e = $("body");
//e = 'dc:ti';
//console.log(e.indexOf('<ht'));


//});


