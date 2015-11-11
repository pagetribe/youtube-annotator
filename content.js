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

				var googleFontsCss = document.createElement("link");
				googleFontsCss.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
				googleFontsCss.type = "text/css";
				googleFontsCss.rel = "stylesheet";
				document.getElementsByTagName("head")[0].appendChild(googleFontsCss);

				var vidControls = document.getElementsByClassName("ytp-chrome-controls")[0];
				vidControls.insertAdjacentHTML('beforeend', "<i class='material-icons md-light' id='camera-icon'>camera</i>");

				var cameraDiv = document.getElementById('camera-icon');
				cameraDiv.addEventListener("click", handleCameraIconClick);


				//inject html
				// var div=document.createElement("div"); 
				// document.getElementById('eow-title').appendChild(div);
				// div.innerText="test123";

				var slide_out = document.getElementById('slideout_inner');

				
				if(slide_out == null) {
					// console.log('slide_out does not extist');
				}
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

				   //      setTimeout(function(){
				   //      	//set image src from screenshot
				   //      	// document.getElementById('target').src = request.imgSrc;
				   //      	// "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwME…j+L3jrwFql7qMtjpXhuS5upY7OV4rmeVmgMSpIuDGAYmLOCGGAFwTuT1eigAooooAKKKKAP//Z"
				   //      	// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaoAAADwCAYAAABR7SDTAAAgAElEQ…SCuTeV+nN6T1T0I82jevZGKc6PNehREkp7w4Dx6Rrz8f8A6Vcv2JjUq8IAAAAASUVORK5CYII="
				   //      			// this is being listened to in background.js

				   //      	// ytp-chrome-bottom = controls -> hide
							// chrome.extension.sendMessage({ type: "up", dimensions: videoDimensions() }, function(response){
							// 	document.getElementById('target').src = response.capturedVidoeSrc;
							// 	// ytp-chrome-bottom = controls -> unhide controls
							// });
				   //      	document.getElementById('slideout_inner').style.right = 0;
				   //      }, 1000)
				        
				    }
				};
				xhr.send();
			}
		}
);

function handleCameraIconClick (argument) {
	// console.log('before send message');
	chrome.runtime.sendMessage({message: "cameraIconClicked", dimensions: videoDimensions() }, function(response) {
		//NOTE TODO: insert new element rather than updating response
		var img = document.createElement('img');
		img.className = 'captured-image';
		img.src = response.capturedVidoeSrc;
		// div.appendChild(img);
		var slide_out = document.getElementById('slideout_inner');
		slide_out.appendChild(img);
		// document.getElementById('target').src = response.capturedVidoeSrc;
		console.log(response.capturedVidoeSrc);
	});
}

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

 // 	dimensions.width = 600;
	// dimensions.height = 600;
 //    dimensions.left = 0;
 //    dimensions.top = 0;
	return dimensions;
}
