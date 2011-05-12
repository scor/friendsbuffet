
//check with background about the plugin options and run the script when options are available
chrome.extension.sendRequest({msg: "check_opts"}, function(response) {
							 callback(response);
							 });



function callback (options) {


  var store = new LinkedData.API.data.Store();
  var parser = new LinkedData.API.data.Parser(store);
  parser.parse();

  console.log(parser);


  candidates = find_people(store);

  var people = [];
  jQuery.each(candidates, function (i, uri) {
    var name;
    var photo;
    name = query(store, uri, 'foaf:name', null, 'o');
    uri = uri.replace('&lt;', '').replace('&gt;', '');

    // lda does not parse @scr objects in RDFa and cannot find a picture.
    // attempts to extract a picture with xpath instead.
    console.log('Searching photo for ' + uri);
    var xPathQuery = '//*[@about="' + uri + '"]//img[contains(@rel,"foaf:depiction")]';
    var xPathResult = document.evaluate(
        xPathQuery,
        document,
        null,
        XPathResult.ANY_TYPE,
        null);
    var node;
    while (node = xPathResult.iterateNext()) {
      photo = node.src;
      console.log('Photo found for ' + uri + ': ' + photo);
      // Only use the first picture.
      break;
    }


    // Only consider folks who have an explicit name.
    if (name !== undefined) {
      if (photo === undefined) {
        photo = 'https://ssl.gstatic.com/s2/profiles/images/silhouette200.png';
      }
      people.push({"href": uri, "uri": uri, "name": name.replace(/"/g, ''), "photo": photo, "type": 0, "title": 'bla'});
      console.log('Adding person ' + uri);

    }
  });
//  console.log(people);


  //send message to render the icon (or not)
  if (people.length > 0) {
    // Notify the extension needs to show the RSS page action icon.
    chrome.extension.sendRequest({msg: "rdfDetected", rdfs: people});
  }


}


//window.localStorage['bla'] = 'hi';
//console.log(window.localStorage);


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
//console.log(property);
//console.log(property.toString());
//console.log(object);
//console.log(object.toString());

      // @fixme there is a bug in lda which returns object CURIEs wrapped with <>.
      if (subject == s && property == p) {
//console.log(p);
//console.log(object);
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


function old_callback (options) {

//metadata types
const RDF = 0;
const RDFa = 1;
const RDFa_fb = 2;
const RDFa_og = 3;

//detect embeded RDF as <link rel="meta" type="...rdf..."
  var rdf_tags = document.evaluate(
      '//*[local-name()="link"][contains(@type, "rdf+xml")]', document, null, 0, null);

  var rdfs = [];
  var item;

  while (item = rdf_tags.iterateNext())
  {
    var title="";
    var href=item.href;
    var filename=href.split("/");
//    console.log('dupa:'+filename[filename.length-1]+'zzzz:'+item.title+'dddd');
    if (!item.title || item.title=='' || item.title==' ') title=filename[filename.length-1]; else title = item.title;
    rdfs.push({"href": item.href, "title": title, "type": RDF});
  }


//------------------------------------------------
//detect RDFa specific attributes ,property, about, resource, datatype, typeof

var rdfa_tags = document.evaluate(
								  '//@property | //@about | //@resource | //@datatype | //@typeof', document, null, 0, null);
var rdfa_type = RDFa;
var check_rdfa_types = options.check_rdfa_types;

//console.log("check types: "+check_rdfa_types);
//if (!check_rdfa_types) check_rdfa_types = 0; //default dont check types
var rdfa_item = rdfa_tags.iterateNext();

if (rdfa_item) //one attribute is enough to determine if the doc has RDFa
{
	if (check_rdfa_types==1) //if "check rdfa types option" is on, check what namespaces are added
	{
		//EXPERIMENTAL = added support only for opengraph and facebook metadata
		//if only one then determine type, if more then skip
		var rdfa2_test = document.evaluate('//html/@*', document, null, 0, null); //get all attributes of HTML
		var rdfa_namespace_count=0;
		var fb_og_namespace=0;
		while (item = rdfa2_test.iterateNext())
		{
			if (item.name.indexOf("xmlns:")>-1) //check for xmlns: attribs
			{
				if (item.value.indexOf("http://www.facebook.com/2008/fbml")>-1) fb_og_namespace= fb_og_namespace | 1 ;
				if (item.value.indexOf("http://opengraphprotocol.org/schema/")>-1 ) fb_og_namespace= fb_og_namespace | 2 ;

				if (	//break loop if there is more then just opengraph && facebook namespaces
					(rdfa_namespace_count>0 && fb_og_namespace!=3) ||  //fb or og detected in first loop but nothing in second
					(rdfa_namespace_count==0 && fb_og_namespace==0) || //nothing detected in first loop
					rdfa_namespace_count>1)								//more then 3 namespaces
				{

					fb_og_namespace=0; //reset fb/og flag
					break;
				}
				rdfa_namespace_count++
			}
			//
		}
		if (fb_og_namespace==0) rdfa_type=RDFa;
		if (fb_og_namespace==1) rdfa_type=RDFa_fb;
		if (fb_og_namespace>1) rdfa_type=RDFa_og;

		//often the only metadata = fb:id and no namespec specified, checking that without going through all properties
		if (fb_og_namespace==0 && rdfa_namespace_count==0 && rdfa_item.value.indexOf('fb:')>-1) rdfa_type=RDFa_fb;

//		console.log('RDFa_type:'+rdfa_type);
		rdfs.push({"href": document.location.href, "title": "RDFa", "type": rdfa_type});
	}
	else
	{
//		console.log('costam:'+RDFa);
		rdfs.push({"href": document.location.href, "title": "RDFa", "type": RDFa});
	}
}

//send message to render the icon (or not)
//  console.log("dlugosc tablicy: "+rdfs.length);
  if (rdfs.length > 0) {
    // Notify the extension needs to show the RSS page action icon.
    chrome.extension.sendRequest({msg: "rdfDetected", rdfs: rdfs});
  }

}
