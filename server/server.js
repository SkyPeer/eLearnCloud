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
cors = require("cors");
minimist = require("minimist");
questions = require("./testArray");

serverConfig = require("./config");

testArray = require("./testArray");

let args = minimist(process.argv.slice(2));

app.use(cors());
app.use(helmet());
app.use(compression());

if (args.port) {
  console.log("port was bind by args:", args.port);
  serverConfig.server.port = args.port;
}

//--------------------------

var sessions = [];

getSessionID = () => {
  const sessionLength = 256;
  return [...Array(sessionLength)]
    .map(i => (~~(Math.random() * 36)).toString(36))
    .join("");
};

function getCurrnetDateTime() {
  /*let date = new Date(); */
  let date = datetime.create();
  return date;
  //return(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + (date.getHours() + ':' + date.getMinutes()));
}

// // onlyGet
// app.get("/api/getNewSessionToken", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); //CORS Policy disabled
//   res.json({
//     token: getSessionID()
//   });
// });

const whitelist = ["http://example1.com", "http://localhost:3000"];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
      // console.log("CORS -- 1");
    } else {
      console.log("CORS -- 2");
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.post(
  "/api/newsessioncreate",
  bodyParser.json(),
  cors(corsOptions),
  function(req, res, next) {
    //console.log("/api/newsessioncreate", req.body);
    res.json({
      //status: 200,
      sessionId: createSession(req.body)
    });
  }
);

function createSession(user) {
  const sessionId = getSessionID();
  sessions.push({
    id: sessionId,
    user: user,
    time: getCurrnetDateTime()._now
  });

  //console.log("sessions:", sessions);
  return sessionId;
}

// onlyGet
app.get("/api/getTests", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //CORS Policy disabled
  res.json(testArray);
});

app.post("/api/setAnswers", bodyParser.json(), cors(corsOptions), function(
  req,
  res,
  next
) {
  console.log("/api/setAnswers", req.body);
  res.json({
    //status: 200,
    // sessionId: createSession(req.body)
  });
});

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
