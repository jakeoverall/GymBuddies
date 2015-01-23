# GymBuddies 
=============

###Prerequisites
+ <a href="http://git-scm.com/">Git</a>
+ <a href="http://nodejs.org/">Node.js</a>
+ <a href="http://www.mongodb.org/">MongoDb</a>
+ <a href="http://bower.io/">Bower</a> //Use node's npm to install bower

First things first Fork this repo so you can edit push your changes back up to github. If you just clone this you will not have permision to push your changes to github

````terminal
	> Git clone 'Your Fork'
	> npm install  // Downloads all your node_componets
	> npm install -g bower // This will globally install bower
	> bower install // This will download the front-end dependencies
````
If you get an error with npm make sure you have node.js installed and that your systems "PATH" Environment Variable includes the bin folder of node. You shouldn't have to do this manually with if you used the node installer however you will likely have to do this for MongoDb so you might as well get use to it. Also another caveot if you have node installed but are getting a weird error like 

````terminal
	<i style="color:red;">Error: ENOENT, stat 'C:\Users\"userName"\AppData\Roaming\npm</i>
````

ENOENT just means no such directory can be found so simply go to that location and create a new folder called npm. This error usually happens because Node does not have permission to create the folder itself.