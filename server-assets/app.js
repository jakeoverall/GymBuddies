var GymBuddies = require('./config/namespace'),
    modules = GymBuddies.modules,
    app = GymBuddies.routehandler.main,
    splash = GymBuddies.routehandler.splash,
    members = GymBuddies.routehandler.members,
    admin = GymBuddies.routehandler.admin,
    db = GymBuddies.dbConnect,
    port = 8999;

var server = modules.http.createServer(app);

//compress files to optimize load times
app.use(modules.compression());

//Set up the root directories for routes
splash.use(modules.express.static(__dirname + '/../public/splash', { maxAge: 86400000 }));
members.use(modules.express.static(__dirname + '/../public/members'));
admin.use(modules.express.static(__dirname + '/../public/admin'));

//Handles request parsing
app.use(modules.cookieParser());
app.use(modules.bodyParser.json());
app.use(modules.bodyParser.urlencoded({extended: true}));

//add route handlers
app.use('/', splash);
app.use('/members', members);
app.use('/admin', admin);

splash.get('/robots.txt', function(req, res){
  return res.sendFile('robots.txt', {root: modules.path.join(__dirname, '../public/splash')});
});
splash.get('/faqs', function(req, res){
  return res.sendFile('faqs.html', {root: modules.path.join(__dirname, '../public/splash/faqs')});
});

//Member Auth Requests
members.post('/login', db.users.auth.login);
members.get('/authenticate', db.users.auth.authenticate);
members.post('/register', db.users.auth.register);
members.put('/update', db.users.auth.update);

//Member Posts Requests
members.post('/post/create', db.users.posts.create);
members.put('/post/update', db.users.posts.update);
members.delete('/post/delete', db.users.posts.delete);
members.get('/post/like', db.users.posts.like);

//Member Comments Requests
members.post('/post/create', db.users.posts.create);
members.put('/post/update', db.users.posts.update);
members.put('/post/delete', db.users.posts.delete);
members.get('/post/like', db.users.posts.like);

//Admin Login
admin.get('/authenticate', db.users.auth.isAdmin);

//wait to setup 404 on unknown routes
app.get('*', function(req, res){
  res.status(404).sendFile('404.html', {root: modules.path.join(__dirname, '../public/404')});
});


// Starts the server listening on the specified port
server.listen(port, function(){
  console.log('Listening at localhost on port: ', port);
});