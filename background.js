//Notes:
//chrome.tabs.sendMessage -> content.js
// tabs is relates to content.js
//chrome.extension.sendMessage -> background.js
// extension relates to background.js



//This will accept messages send form the content.js
//content.js will call chrome.extension.sendMessage({ type: "up", dimensions: 9 });
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "up") {
    	captureImage(sender.tab.id, request.dimensions);
    }
});



// Listens for click on the icon
chrome.browserAction.onClicked.addListener(function(tab) {
	// send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// captureImage();
		chrome.tabs.captureVisibleTab(function(imgSrc) {
			chrome.tabs.sendMessage(tabs[0].id, {"message": "clicked_browser_action", "imgSrc": imgSrc});
		});
		
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

var canvas = null;
function captureImage() {
	alert('hadswf');
	chrome.tabs.captureVisibleTab(function(dataUrl) {
	// chrome.tabs.captureVisibleTab(tabs[0].id { format: "png" }, function(dataUrl) {
        if (!canvas) {
            canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
        }
        var image = new Image();
        image.onload = function() {
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            var context = canvas.getContext("2d");
            context.drawImage(image,
                dimensions.left, dimensions.top,
                dimensions.width, dimensions.height,
                0, 0,
                dimensions.width, dimensions.height
            );
            var croppedDataUrl = canvas.toDataURL("image/png");
            chrome.tabs.create({
                url: croppedDataUrl,
                windowId: tab.windowId
            });
        }
        image.src = dataUrl;
    });
}
