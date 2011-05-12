
//check with background about the plugin options and run the script when options are available
chrome.extension.sendRequest({msg: "check_opts"}, function(response) {
							 callback(response);
							 });


function callback (options) {

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
