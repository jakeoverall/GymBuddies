###Part 1 - Introduction

We are going to look at using JavaScript as a back-end service. I will focus heavily on keeping your server code clean, organized and <a href="http://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank">DRY</a>. I have a repo on GitHub called <a href="https://github.com/jakeoverall/GymBuddies" target="_blank">GymBuddies</a> that should be used in conjunction with this tutorial.

####Getting Started
+ <a href="http://git-scm.com/">Git</a>
+ <a href="http://nodejs.org/">Node.js</a>
+ <a href="http://www.mongodb.org/">MongoDb</a>

If you have a good understanding of Node and already have MongoDb installed and working you might want to skip this section.

First things first Fork this repo so you can edit and push your changes back up to github. If you just clone this repo you will not have permission to push your changes to github which would be sad :(

```terminal
	//Mac users may need to prepend sudo to all of these commands
	> git clone 'Your Fork'
	> npm install  // Downloads all your node_components
	> npm install -g bower // This will globally install bower
	> bower install // This will download the front-end dependencies
```
If you get an error with npm make sure you have node.js installed and that your system's "PATH" Environment Variable includes the bin folder of node. You shouldn't have to do this manually with if you used the node installer however, you will likely have to do this for MongoDb. If you are not sure how to edit your path variables read <a href="http://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/" target="_blank">here</a> Also another caveat if you have node installed but are getting a weird error like 

```terminal
	Error: ENOENT, stat 'C:\Users\"userName"\AppData\Roaming\npm
```

ENOENT just means no such directory can be found so simply go to that location and create a new folder called npm. If you can't find the folder Roaming folder you might not have show hidden files on. Read <a href="http://windows.microsoft.com/en-us/windows/show-hidden-files#show-hidden-files=windows-7" target="_blank">this</a> to turn them on. This error usually happens because Node does not have permission to create the folder itself.

####MongoDb
Okay lets make sure MongoDb is setup go to your Environment Variables and add the bin folder of MongoDb to your "PATH". Adding a folder to you path variables just makes it so you can access the files in that folder from your command line easily.

The path will usually look something like this depending on the version  of Mongo you installed.

```system
	C:\Program Files\MongoDB 2.6 Standard\bin
```

Now you should be able to open your command line and type in

```terminal
	> mongod
```

This is the command that will startup your MongoDb Server. Its likely you will get another ENOENT error. This is because Mongo is looking for a specific folder structure to save the databases that you will be creating. By default that path is 

```
	C:>data\db\
```

If you create these two folders and then got back to your command line and type in 

```terminal
	> mongod
```
The command line should now print out a bunch of information if it doesn't try closing and the re-open your command line window. Now everything should be setup. You can now open another command line window and type

```
	> mongo //Shell access to your mongo server
```

Now you can run mongo commands to look at your databases. The mongo shell is pretty much JavaScript so you only need to learn a few methods to start manipulating your data directly if you want. If you want a GUI for your mongo server there are several choices. <a href="http://robomongo.org/" target="_blank">RoboMongo</a> is cross platform, shows you the commands that are actually ran for the queries and allows you to use ssl or ssh to access a mongo server remotely.

If you are interested you can setup mongo as a <a href="http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/" target="_blank">Windows Service</a> and change the location of your databases by setting up a config file for mongo. 

###Node Server.js

Let's get some boilerplate server code setup so we can test out our node server. Go ahead and create a file called temp-server.js and add the following code

```javascript
	var express = require('express'),
		app = express(),
		port = 3000;

	//Sets up the root directory for our server
	app.use(express.static(__dirname + '/temp-public'));

	//Starts the server listening on the specified port
	app.listen(port, function(){
		console.log('Listening at localhost on port: ', port);
	});
```

<a href="http://expressjs.com/">Express.js</a> is a framework that makes working with node easier. 

Before testing this server take a close look at this line of code

```javascript
	app.use(express.static(__dirname + '/temp-public'));
```

This line is telling your app that you want to statically server the files in this folder location. We will discuss later, how to serve additional routes with this method. 

__dirname is a shortcut so you don't have to fully qualify your paths. It simply means from this current directory.

Before starting the server note you don't actually have a folder called temp-public so go create it and add an index.html inside of it.

```html
	<html>
    	<head>
        	<title>Getting Started with Node</title>
        </head>
        <body>
        	<h1>Hello, World!</h1>
        </body>
    </html>
```

With this setup starting a web server is a simple command. From your command line window navigate to your projects home directory and type

```terminal
	> node temp-server.js
```

You can now go to http://localhost:3000/ and see hello world. Woot! your first web server with node. Pretty easy right?

Now that you have some basic understanding of node and we have ensured your system environment is up and running let's get started.

---
###GYM BUDDIES

{<1>}![Gym Buddies logo](https:boisecodeworks.com/blog/content/images/2015/03/Gym-Buddies-Logo-256.png)

Okay let me introduce you to the project that you will be expanding upon and learning from. Pretend for a second that you have been approached by a client that wants you to build a social media platform specifically targeted to Gym Fanatics. Your client is just positive that this app will be the next best thing and has done all of the leg work to get investors lined up but one big snag he is an idea guy only so there is no code base and he needs an MVP by the end of the week. 

Sound Familiar? Red flags? 

Right you should probably run but hey money is tight and this guy is going to pay well enough that you might just be able to get your dog those beer fetching lessons that he has been begging for. So you're going to accept the project. 

Alright one of the main reasons I love working with Node and MongoDb is the speed at which I can get a scalable project up and running. The one caveat, speed can be a dangerous thing. Quickly written JavaScript can get messy really fast and become a maintenance nightmare. Because of this I want to stress the importance of organizing your code as you go and not leaving it up for a refactoring mess later.

---

#####Organization

One of the biggest complaints I hear about Node is the lack of organization and structure. It is difficult to know exactly how to organize your code. I struggled with this myself until I read a short post by <a href="http://rauschma.de/" target="_blank">Dr. Axel Rauschmayer</a> about namespacing JavaScript. 

Node relies heavily on the export and require pattern for passing your code around between files. What is cool about this is you can write small modules and then just plug them in wherever you need a particular section of code. This alone should help with organization however, I personally hate having to see at the top of all my files a thousand require statements. After a few trial and errors I finally came up with a system that I like. 

The GymBuddies repo is pretty much a seed project structured after this pattern. Have a look at the folder structure.

```directory
Project
+-- server-assets
|    +-- config 
|    +-- db
|    |	+-- [Models]
+-- public
|	+-- [App]
|	|	+-- assets
```

This is the folder structure I use if I am only dealing with a single namespace and I know the app isn't going to grow. If I am dealing with multiple namespaces it changes just a bit depending on the need of the namespaces to touch the same database or their own.

```directory
Project
+-- server-assets
|	+--[Namespace]
|   |	 +-- config 
|   |	 +-- db
|   |	 |	+-- [Models]
|	+-- shared-db
+-- public
|	+-- [App]
|	|	+-- assets
```


Why is the folder structure important? Because your folder structure will ultimately become the thing you hate most about working with your app if it isn't laid out well. As a general rule of thumb if you ever have to navigate up and down several directories in a require there is probably something you can do to better.

```javascript
	var myModule = require('../../something/another/file');  //This is ugly
```

My solution is namespacing. Inside the config folder I create a couple files

-	namespace.js
-	route-handler.js
-	modules.js
-	sessions.js

Take a look at namespace.js 

```javascript
exports.modules = require('./modules'),
exports.dbConnect = require('../db/db-connect'), //I know hypocrite 
exports.routehandler = require('./route-handler'),
exports.sessions = require('./sessions');
```

I won't go through each subfile but it suffices to say that loading a namespace loads through the use of require all necessary components, routes, and modules necessary for the app to run right when you spin up your server. This also gives you access to all of these components through a single object.

Now in app.js or some other file we can do something like this

```javascript
var GymBuddies = require('./config/namespace'),
	modules = GymBuddies.modules;
```

The levels of abstraction can go pretty deep. Sometimes it is hard to decide if the abstraction is really necessary. If it isn't going to improve readability, change frequently, or accessed by more than a few things leave it where it is.

---

####Part 2 - Getting functional

Coming Soon