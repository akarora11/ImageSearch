const express = require('express')
const app = express();
const port = 8000;
const fetch = require('node-fetch');
var fs = require("fs");

 app.get("/", function (request, response){
     response.sendFile(__dirname+"/test.html");
 });

 app.get("/getSearch", async function (request, response){
		 var searchStr = request.query.searchStr;
		 var key = request.query.key;
		 var cx = request.query.cx;
		 
		 let url = 'https://www.googleapis.com/customsearch/v1?key=' + key + '&cx=' + cx + '&searchType=image&imgSize=icon&q=' + searchStr;
		 
		 let resp = await fetch(url);
		 let data = await resp.json();

		 let result = {};
		 result.info = data.searchInformation;
		 result.items = data.items.map(d => {
			if(d.pagemap && d.pagemap.cse_thumbnail) {
			  d.thumbnail = { 
				src: d.pagemap.cse_thumbnail[0].src, 
				width: d.pagemap.cse_thumbnail[0].width, 
				height: d.pagemap.cse_thumbnail[0].height
			  } 
			}
			return d
		  });

		  fs.readFile('result.html', 'utf8', function (err, data) {
			console.log(result.items)
			response.write(data);
			response.write('<ul id="words">');
				for (var i=0; i < result.items.length; i++) {
					if(result.items[i]) {
						response.write('<li>');
							response.write('<img style="width: 70px; height: 70px; border: 1px solid black;" src="' + result.items[i].image.thumbnailLink + '&h=250&w=1000&zc=0&q=100"/>');
							response.write(' <b> Title :</b>' + result.items[i].htmlTitle + '<br />')
							response.write(' <b> Context Link :</b> <a href="' + result.items[i].image.contextLink + '">' + result.items[i].image.contextLink + '</a><br />')
						response.write('</li>');
					}
				}
			response.write('</ul>');
		});
 });

app.listen(port, () => {
	console.log('Listening on port' + port);
});
