// Listen for click on the icon
chrome.browserAction.onClicked.addListener(function(tab) {
	// send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {"message": "clicked_browser_action"});
	});

	// chrome.tabs.captureVisibleTab(function(img) {
	// 	alert(img);
	// });
});
