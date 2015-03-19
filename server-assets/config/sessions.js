var GymBuddies = require('./namespace'),
  modules = GymBuddies.modules,
  app = GymBuddies.routehandler.main;

var store = new modules.MongoStore({
  url: 'mongodb://localhost/GymBuddiesSessionStore'
});

var sessionStore = {
      secret: 'shhh... this is a secret',
      resave: false,
      saveUninitialized: true,
      name: 'GymBuddies',
      store: store
    };

exports.session = (function(){
  app.use(modules.sessions(sessionStore));
}());