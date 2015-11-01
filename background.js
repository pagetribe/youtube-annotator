// Listen for click on the icon
chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.captureVisibleTab(function(img) {
		alert(img);
	});
});
