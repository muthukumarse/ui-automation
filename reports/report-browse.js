var connect = require('connect');
var serveStatic = require('serve-static');
connect()
  .use(serveStatic(__dirname + "/../coverage"))
  .listen(3003, function() {
    console.log("Server running on 3003...");
    console.log("Goto http://localhost:3003  to View HTML Report");
  });