function request(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				callback(xhr.responseText);
			} else {
				callback(xhr.status);
			}
		}
	}
	
	xhr.open('GET', url, true);
	xhr.send(null);
}

function buildPerson(person) {
	// person is a JSON object with name, age, and twitter
	var div = document.createElement('div');
		div.className = 'person';
	
	var name = document.createTextNode(person['name']);
	
	var twitterLink = document.createElement('a');
		twitterLink.className = 'twitter-link';
		twitterLink.href = 'http://twitter.com/' + person['twitter'];
		twitterLink.innerHTML = '(@'+person['twitter'] + ')';
	
	div.appendChild(name);
	div.appendChild(twitterLink);
	return div;
}

// appends the HTML of the results div
function addHTML(data) {
	if(typeof(data) !== 'string') data = data.outerHTML;
	var resultsDiv = document.getElementById('result');
	resultsDiv.innerHTML += data;
}	

function addHandlers() {
	var link = document.getElementById('link');
	link.onclick = function() {
		request('./target-file.json', function(response) {
			var json = JSON.parse(response); // we know it's JSON
			for(var i = 0; i < json.length; i++) {
				var person = json[i];
				addHTML(buildPerson(person));
			}
			
			addMiniFeed();
			link.parentNode.removeChild(link);
		});
		return false;
	}
}

function addMiniFeed() {
	var links = document.getElementsByTagName('a');
	for(var i = 0; i < links.length; i++) {
		var link = links[i];
		if(link.className === 'twitter-link') {
			link.onclick = function() {
				var split = this.href.split(/\//);
				var username = split[split.length-1];
				var script = document.createElement('script');
					script.src = 'http://twitter.com/status/user_timeline/' + username + '.json?callback=populateMiniFeed';
				
				document.body.appendChild(script);
				return false;
			}
		}
	}
}

// twitter callback
function populateMiniFeed(data) {
	var div = document.createElement('div');
	
	var h2 = document.createElement('h2');
		h2.innerHTML = data[0]['user']['name'];
	div.appendChild(h2);
	
	for(var i = 0; i < data.length; i++) {
		div.appendChild(buildTweet(data[i]));
	}
	
	document.getElementById('feed').innerHTML = div.outerHTML;
}

function buildTweet(tweet) {
	console.log(tweet);	
	var wrapper = document.createElement('div')
		wrapper.className = 'tweet';

	var img = document.createElement('img');
		img.src = tweet['user']['profile_image_url'];
		img.className = 'profile-image';
		img.height = 48;
		img.width = 48;
	wrapper.appendChild(img);
	
	var content = document.createElement('div');
		content.innerHTML = tweet['text'];
	wrapper.appendChild(content);
		
	var clear = document.createElement('div')
		clear.className = 'clear';
	wrapper.appendChild(clear);
	
	return wrapper;
}
		
window.onload = function() {
	addHandlers();
}