var noteId = '';
var baseUrl = 'http://localhost:8080/api/notes/';
var $form;

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
				// xhr.open('GET', chrome.extension.getURL('http://localhost:8080/api'), true);
				xhr.onreadystatechange = function()
				{
				    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
				    {
				    	var div = document.createElement('div');
    					div.innerHTML = xhr.responseText;
				        document.body.appendChild(div);
				        document.getElementById('slideout_inner').style.right = 0;
				        
				        $form = $('#note-form');
				        $form.on('submit', function(e) {
				 			e.preventDefault();
				 		});

						$('#form-submit').on('click', function(){
							// if not exists issue PUT else POST
							if(noteId) {
								xhrRequest($form.serialize(), 'PUT', noteId);
							}
							else {
								xhrRequest($form.serialize(), 'POST');
							}
						});

				    }
				};
				xhr.send();

				// load externa form page
				// loadExternalPage();
			}
		}
);

function xhrRequest (data, method, id) {
	chrome.runtime.sendMessage({
		data: data,
		method: method,
		action: 'xhttp',
		url: baseUrl + (id || "")
	}, function(responseText) {
		console.log(responseText);
		noteId = JSON.parse(responseText).id;
	});
}

// this works but all xhr request need to run via message passing use the 
// sendMessage below to communicate with localhost
// function loadExternalPage() {
// 	chrome.runtime.sendMessage({
// 	    method: 'GET',
// 	    action: 'xhttp',
// 	    url: 'http://localhost:8080/api'
// 	}, function(responseText) {
// 		// alert(responseText);
// 		var div = document.createElement('div');
//     	div.innerHTML = responseText;
//     	document.getElementById('slideout_inner').appendChild(div);
// 	    /*Callback function to deal with the response*/
// 	});
// }

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

	return dimensions;
}

