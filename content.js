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


				// var iFrame  = document.createElement("iframe");
				// // iFrame.style.cssText = 'position:fixed;top:0;left:0;display:block; width:300px;height:100%;z-index:1000;';
				// iFrame.src  = chrome.extension.getURL ("content.html");
				// iFrame.id = "slideout_inner";
				// document.body.appendChild(iFrame);

				// document.body.insertBefore(iFrame, document.body.firstChild);
			    // document.getElementById('eow-title').appendChild(iFrame);

			    // read in contents of file
			    var xhr = new XMLHttpRequest();
				xhr.open('GET', chrome.extension.getURL('content.html'), true);
				xhr.onreadystatechange = function()
				{
				    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
				    {
				    	var div = document.createElement('div');
    					div.innerHTML = xhr.responseText;
				        //... The content has been read in xhr.responseText
				        // alert(xhr.responseText);
				         document.body.appendChild(div);
				    }
				};
				xhr.send();
			}
		}
);
