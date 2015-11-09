chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if( request.message === "clicked_browser_action" ) {
				// alert('clicked_browser_action');
				// https://github.com/nishanths/youtube-pause-chrome/blob/master/src/scripts/youtube-pause-extension.js
				// http://stackoverflow.com/a/9517879/3309046
				//inject js
				var s = document.createElement('script');
				s.src = chrome.extension.getURL('inject.js');
				s.onload = function() { this.parentNode.removeChild(this); };
				(document.head||document.documentElement).appendChild(s);

				//inject css
				var link = document.createElement("link");
				link.href = chrome.extension.getURL("content.css");
				link.type = "text/css";
				link.rel = "stylesheet";
				document.getElementsByTagName("head")[0].appendChild(link);

				//inject html
				var div=document.createElement("div"); 
				document.getElementById('eow-title').appendChild(div);
				div.innerText="test123";

			    // read in contents of file
			    var xhr = new XMLHttpRequest();
				xhr.open('GET', chrome.extension.getURL('content.html'), true);
				xhr.onreadystatechange = function()
				{
				    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
				    {
				    	var div = document.createElement('div');
    					div.innerHTML = xhr.responseText;
				        document.body.appendChild(div);
				        setTimeout(function(){
				        	//set image src from screenshot
				        	// document.getElementById('target').src = request.imgSrc;
				        	// "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwME…j+L3jrwFql7qMtjpXhuS5upY7OV4rmeVmgMSpIuDGAYmLOCGGAFwTuT1eigAooooAKKKKAP//Z"
				        	// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaoAAADwCAYAAABR7SDTAAAgAElEQ…SCuTeV+nN6T1T0I82jevZGKc6PNehREkp7w4Dx6Rrz8f8A6Vcv2JjUq8IAAAAASUVORK5CYII="
				        			// this is being listened to in background.js

				        	// ytp-chrome-bottom = controls -> hide
							chrome.extension.sendMessage({ type: "up", dimensions: videoDimensions() }, function(response){
								document.getElementById('target').src = response.capturedVidoeSrc;
								// ytp-chrome-bottom = controls -> unhide controls
							});
				        	document.getElementById('slideout_inner').style.right = 0;
				        }, 1000)
				        
				    }
				};
				xhr.send();
			}
		}
);

function videoDimensions(){
	var dimensions = {};
	var elem = document.getElementsByClassName('html5-video-content')[0];

	dimensions.width = elem.offsetWidth;
	dimensions.height = elem.offsetHeight;
	dimensions.top = -window.scrollY;
    dimensions.left = -window.scrollX;

	while (elem !== document.body) {
        dimensions.top += elem.offsetTop;
        dimensions.left += elem.offsetLeft;
        elem = elem.offsetParent;
    }

	console.log(dimensions);
	return dimensions;
}