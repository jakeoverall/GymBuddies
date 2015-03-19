var sessions = require('express-session');

//comes with Node.js
exports.fs = require('fs');
exports.http = require('http');
exports.path = require('path');

//requires npm install
exports.express = require('express');
exports.cookieParser = require('cookie-parser');
exports.bodyParser = require('body-parser');
exports.sessions = sessions;
exports.MongoStore = require('connect-mongo')(sessions);
exports.compression = require('compression');
exports.validator = require('validator');