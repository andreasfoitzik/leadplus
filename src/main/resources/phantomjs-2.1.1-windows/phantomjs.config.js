var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs');



page.settings.userAgent = "aurbano";
// The following are only required if you're loading assets using file://
page.settings.localToRemoteUrlAccessEnabled = true;
page.settings.webSecurityEnabled = false;
page.settings.loadImages = true;

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  	console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
	printArgs.apply(this, arguments);
};

page.onResourceRequested = function(requestData, request) {
  console.log('::loading', requestData['url']);  // this does get logged now
};

page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: {
        top: "1.5cm",
        bottom: "1cm"
    },
    footer: {
        height: "1cm",
        contents: phantom.callback(function (pageNum, numPages) {
            return '' +
                '<div style="margin: 0 1cm 0 1cm; font-size: 0.65em">' +
                '   <div style="color: #888; padding:20px 20px 0 10px; border-top: 1px solid #ccc;">' +
                '       <span></span> ' +
                '       <span style="float:right">' + pageNum + ' / ' + numPages + '</span>' +
                '   </div>' +
                '</div>';
        })
    }
};

// This will fix some things that I'll talk about in a second
page.settings.dpi = "96";

var header ='<!DOCTYPE html>'+
			'<html lang="en">'+
			'<head>'+
				'<title>The title is irrelevant</title>'+
				'<meta http-equiv="content-type" content="text/html; charset=UTF-8">'+
				'<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
				'<link rel="stylesheet" media="all" type="text/css" href="file:///D:/LeadPlus/bin/phantomjs-2.1.1-windows/libs/assets/bootstrap.min.css" />'+
				// '<link rel="stylesheet" media="all" type="text/css" href="file:///D:/LeadPlus/bin/phantomjs-2.1.1-windows/libs/assets/assets.css" />'+
				'<link rel="stylesheet" media="all" type="text/css" href="file:///D:/LeadPlus/bin/phantomjs-2.1.1-windows/libs/assets/style.css" />'+
				'<link rel="stylesheet" media="all" type="text/css" href="file:///D:/LeadPlus/bin/phantomjs-2.1.1-windows/libs/font-awesome.min.css" />'+
			'</head>'+
			'<body>'+
				'<div style="padding:30px">';

page.content = header+fs.read(system.args[1])+'</div></body>';

var output = system.args[2];



page.onLoadStarted = function() {
	var timeout = setTimeout(function(){
		page.render(output,{format:"pdf"});
				phantom.exit(1);
			},1000*5);
}			
			
page.onLoadFinished = function(status) {
  console.log('Status: ' + status);
  // Do other things here...
	page.render(output,{format:"pdf"});
	phantom.exit(0);
};

