const express = require("express"),
  path = require("path"),
  http = require("http"),
  app = express(),
  server = http.createServer(app),
  compression = require("compression"),
  // mongoose = require("mongoose"),
  helmet = require("helmet"),
  bodyParser = require("body-parser"),
  datetime = require("node-datetime");
minimist = require("minimist");

serverConfig = require("./config");

let args = minimist(process.argv.slice(2));

if (args.port) {
  console.log("port was bind by args:", args.port);
  serverConfig.server.port = args.port;
}

// app.set("views", __dirname + "/build");
// app.set("view engine", "jade");

getSessionID = () => {
  const sessionLength = 256;
  return [...Array(sessionLength)]
    .map(i => (~~(Math.random() * 36)).toString(36))
    .join("");
};

app.get("/api/getNewSessionToken", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //CORS Policy disabled
  res.json({
    token: getSessionID()
  });
});

function getCurrnetDateTime() {
  /*let date = new Date(); */
  let date = datetime.create();
  return date;
  //return(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + (date.getHours() + ':' + date.getMinutes()));
}

app.use(helmet());
app.use(compression());

// app.use("/public", express.static(path.join(__dirname, "public")));

//app.use("/build", express.static(path.join(__dirname, "build")));

app.use("/static", express.static(path.join(__dirname, "build/static")));
app.use("", (req, res, next) => {
  res.sendFile("./build/index.html", { root: __dirname });
});

server.listen(serverConfig.server.port, function() {
  console.log(
    `eLearnServer started on http://${serverConfig.server.host}:${serverConfig.server.port}`
  );
});
