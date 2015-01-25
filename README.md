# GymBuddies 
=============

###Prerequisites
+ <a href="http://git-scm.com/">Git</a>
+ <a href="http://nodejs.org/">Node.js</a>
+ <a href="http://www.mongodb.org/">MongoDb</a>
+ <a href="http://bower.io/">Bower</a>

First things first Fork this repo so you can edit and push your changes back up to github. If you just clone this repo you will not have permision to push your changes to github which would be sad :(

```terminal
	> Git clone 'Your Fork'
	> npm install  // Downloads all your node_components
	> npm install -g bower // This will globally install bower
	> bower install // This will download the front-end dependencies
```
If you get an error with npm make sure you have node.js installed and that your systems "PATH" Environment Variable includes the bin folder of node. You shouldn't have to do this manually with if you used the node installer however you will likely have to do this for MongoDb so you might as well get use to it. Also another caveot if you have node installed but are getting a weird error like 

```terminal
	Error: ENOENT, stat 'C:\Users\"userName"\AppData\Roaming\npm
```

ENOENT just means no such directory can be found so simply go to that location and create a new folder called npm. This error usually happens because Node does not have permission to create the folder itself.

####MongoDb
Okay lets make sure MongoDb is setup and working open up your console or terminal and type in

```terminal
	> mongod
```

This should startup your MongoDb Server if you get an error go to your "PATH" Enviroment Variable and add the bin folder of MongoDb, if you still get another ENOENT error go simple create the folder structure that Mongo is looking for usually its

```
	C:>data\db\
```

Okay once again type in mongod and this time it should print out a buch of information if it doesn't try closing and the re-open your terminal or console window. Now everything should be setup so lets get started.

###Node Server.js

lets get some boilerplate server code setup so we can test out our node server. Go ahead and open up server.js and add the following code

```javascript
	var express = require('express'),
		app = express(),
		port = 3000;

	//Sets up the root directory for our server
	app.use(express.static(__dirname + "/public"));

	//Starts the server listening on the specified port
	app.listen(port, function(){
		console.log('Listening at localhost on port: ', port);
	});
```

<a href="http://expressjs.com/">Express.js</a> is a framework that makes working with node a bit easier and we are going to be taking advantage of a couple cool things that express gives us.