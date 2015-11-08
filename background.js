// Listen for click on the icon
chrome.browserAction.onClicked.addListener(function(tab) {
	// send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
