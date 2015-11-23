//Notes:
//chrome.tabs.sendMessage -> content.js
// tabs is relates to content.js
//chrome.extension.sendMessage -> background.js
// extension relates to background.js



//This will accept messages send form the content.js
//content.js will call chrome.extension.sendMessage({ type: "up", dimensions: 9 });
// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.type === "up") {
//     	var capturedVidoeSrc = captureImage(sender.tab.id, request.dimensions);
//     	sendResponse({capturedVidoeSrc: capturedVidoeSrc});
//     }
// });
var canvas = null;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            sendResponse(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // sendResponse to clean up the communication port.
            sendResponse();
        };
        xhttp.open(method, request.url, true);
        if (method === 'POST' || 'PUT') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the sendResponse from being called too early on return
    }
	
	if(request.message === "cameraIconClicked") {

		var croppedDataUrl = '';
		chrome.tabs.captureVisibleTab(null, null, function(screenshotUrl) 
	    {
	        if (!canvas) {
        		canvas = document.createElement("canvas");
    		}
	        var image = new Image();
	        var context = canvas.getContext('2d');
	        canvas.width = request.dimensions.width;
            canvas.height = request.dimensions.height;
	        image.onload = function() {
	            context.drawImage(image, request.dimensions.left, request.dimensions.top, request.dimensions.width, request.dimensions.height, 0, 0, request.dimensions.width, request.dimensions.height );
	            var cropped = canvas.toDataURL('image/jpg', 90);
	            sendResponse({capturedVidoeSrc: cropped});
	        }
	        image.src = screenshotUrl;
	     });

		// this works capture whole tab  #########################################################################
		// chrome.tabs.captureVisibleTab(function(screenshotUrl) {
		// 	sendResponse({capturedVidoeSrc: screenshotUrl});
		// });
		// #######################################################################################################

		// var capturedVidoeSrc = captureImage(sender.tab.id, request.dimensions);
		// capture();
    	// sendResponse({capturedVidoeSrc: imgUrl});

    	// croppedDataUrl='';
    	// croppedDataUrl.url = "hello";
    	// sendResponse({capturedVidoeSrc: croppedDataUrl.url});

    	return true;
	}
});


// Listens for click on the icon
chrome.browserAction.onClicked.addListener(function(tab) {
	// send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {"message": "clicked_browser_action"});
		// captureImage();
		// chrome.tabs.captureVisibleTab(function(imgSrc) {
		// 	chrome.tabs.sendMessage(tabs[0].id, {"message": "clicked_browser_action", "imgSrc": imgSrc});
		// });
		
	});

	// chrome.tabs.executeScript({
 //    	code: 'document.getElementsByTagName("video")[0].pauseVideo();'
 //  	});

	// chrome.tabs.captureVisibleTab(function(imgSrc) {
	// 	document.getElementById('target').src = imgSrc;
	// 	console.log('captured');
	// });

	// chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
	// 	chrome.tabs.sendMessage(tabs[0].id, {'capture': dataUrl});
 //        }
 //    );
});


// can also detect page clicks with this
// chrome.pageAction.onClicked.addListener(function onClicked(tab) {
//     chrome.tabs.sendMessage(tab.id, { type: "start" }, function(response) {});
// });

// var canvas = null;
// function captureImage(tabId, dimensions, croppedDataUrl) {

	// chrome.tabs.captureVisibleTab(function(dataUrl) {
	// // chrome.tabs.captureVisibleTab(tabs[0].id { format: "png" }, function(dataUrl) {
 //        if (!canvas) {
 //            canvas = document.createElement("canvas");
 //            document.body.appendChild(canvas);
 //        }
 //        var image = new Image();
 //        image.onload = function() {
 //            canvas.width = dimensions.width;
 //            canvas.height = dimensions.height;
 //            var context = canvas.getContext("2d");
 //            context.drawImage(image,
 //                dimensions.left, dimensions.top,
 //                dimensions.width, dimensions.height,
 //                0, 0,
 //                dimensions.width, dimensions.height
 //            );
 //            croppedDataUrl = canvas.toDataURL("image/jpg");
 //            // chrome.tabs.create({
 //            //     url: croppedDataUrl,
 //            //     windowId: tab.windowId
 //            // });
 //        }
 //        image.src = dataUrl;
 //    });
    // return x;
// }
