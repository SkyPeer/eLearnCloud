const express = require("express"),
  path = require("path"),
  http = require("http"),
  app = express(),
  server = http.createServer(app),
  compression = require("compression"),
  helmet = require("helmet"),
  bodyParser = require("body-parser"),
  datetime = require("node-datetime");
cors = require("cors");
minimist = require("minimist");
questions = require("./testArray");
mongoose = require("mongoose");

serverConfig = require("./config");
dbConfig = require("./dbconfig");
dbProviders = require("./dbproviders");
testArray = require("./testArray");

tensorflowAnalytics = require("./tensorflow");

let args = minimist(process.argv.slice(2));

const db = dbConfig;

mongoose
  .connect(`mongodb://${db.host}:${db.port}/${db.dbname}`, {
    useNewUrlParser: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log("-------------------");
    console.log("mongodb has started");
    console.log("-------------------");
  })
  .catch(err => {
    console.log("-------------------");
    console.log(err);
    console.log("-------------------");
  });

mongoose.Promise = global.Promise;

app.use(cors());
app.use(helmet());
app.use(compression());

if (args.port) {
  console.log("port was bind by args:", args.port);
  serverConfig.server.port = args.port;
}

//--------------------------
const testModel = new mongoose.Schema({
  sessionId: String,
  name: String,
  age: Number,
  course: Number,
  answers: Object,
  raiting: Number,
  semester: Number
});

let TestSchema = mongoose.model("tests", testModel);

insertInDB = async data => {
  if (data) {
    const { name, age, course, semester } = data.user;
    await TestSchema.create({
      sessionId: data.id,
      name,
      age,
      course,
      semester,
      answers: data.answers,
      raiting: data.raiting
    });
    console.log("dataWasInserted");
    return true;
  }
};

var sessions = [];

getSessionID = () => {
  const sessionIdLength = 256;
  return [...Array(sessionIdLength)]
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
      //console.log("CORS -- 2", origin);
      callback(null, true);
      //callback(new Error("Not allowed by CORS"));
    }
  }
};

// --------------- CREATE SESSION
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
    // console.log("---------------------------------");
    // console.log("ACTIVE SESSIONS:", sessions.length);
    // console.log("---------------------------------");
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

// --------------- GET TEST
app.get("/api/getTests", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //CORS Policy disabled
  res.json(testArray);
});

// --------------- SET ANSWERS
app.post(
  "/api/setAnswers",
  bodyParser.json(),
  cors(corsOptions),
  async function(req, res, next) {
    //console.log("/api/setAnswers", req.body);
    res.json(
      await getRaitingHandler(req.body)
      //status: 200,
      // sessionId: createSession(req.body)
    );
  }
);

app.get("/api/analytics", function(req, res, next) {
  TestSchema.find(async function(err, testResultData) {
    if (err) return next(err);
    // await res.json(testResultData);
    // getAnalyticsData(testResultData);
    res.json(await getAnalyticsData(testResultData));
  });
});

app.get("/api/train", function(req, res, next) {
  TestSchema.find(async function(err, testResultData) {
    if (err) return next(err);
    // await res.json(testResultData);
    // getAnalyticsData(testResultData);
    res.json(await train(testResultData));
  });
});

getAnalyticsData = async data => {
  let results = {};

  let analyticsData = [];

  let dataForAnalytics = {
    trainX: [],
    trainY: []
  };

  data.forEach(testResult => {
    if (results[testResult.semester]) {
      let arr = results[testResult.semester];
      arr.push(testResult.raiting);
      results[testResult.semester] = arr;
    } else {
      let arr = [];
      arr.push(testResult.raiting);
      results[testResult.semester] = arr;
    }
  });

  //average
  averageRaiting = raitigs => {
    return (
      raitigs.reduce((partial_sum, a) => partial_sum + a, 0) / raitigs.length
    );
  };

  let keys = Object.keys(results);

  keys.forEach(semester => {
    results[semester] = averageRaiting(results[semester]);
  });

  Object.keys(results).forEach(item => {
    analyticsData.push({
      x: parseInt(item),
      y: results[item]
    });
    dataForAnalytics["trainX"].push(parseInt(item));
    dataForAnalytics["trainY"].push(results[item]);
  });

  const predictedPoints = await tensorflowAnalytics.getTFdata(dataForAnalytics);

  return { analyticsData, predictedPoints };
};

train = async data => {
  let results = {};

  let analyticsData = [];

  let dataForAnalytics = {
    trainX: [],
    trainY: []
  };

  data.forEach(testResult => {
    if (results[testResult.semester]) {
      let arr = results[testResult.semester];
      arr.push(testResult.raiting);
      results[testResult.semester] = arr;
    } else {
      let arr = [];
      arr.push(testResult.raiting);
      results[testResult.semester] = arr;
    }
  });

  //average
  averageRaiting = raitigs => {
    return (
      raitigs.reduce((partial_sum, a) => partial_sum + a, 0) / raitigs.length
    );
  };

  let keys = Object.keys(results);

  keys.forEach(semester => {
    results[semester] = averageRaiting(results[semester]);
  });

  Object.keys(results).forEach(item => {
    analyticsData.push({
      x: parseInt(item),
      y: results[item]
    });
    dataForAnalytics["trainX"].push(parseInt(item));
    dataForAnalytics["trainY"].push(results[item]);
  });

  const predictedPoints = await tensorflowAnalytics.train(dataForAnalytics);

  return { analyticsData, predictedPoints };
};

getRaitingHandler = async data => {
  const sessionId = data.sessionId;
  let answers = Object.assign({}, data.answers);
  let currentSession = {};

  let failedQuestions = [];

  sessions.forEach(session => {
    if ((session.id = sessionId)) {
      currentSession = session;
    }
  });

  let raiting = 0;

  //getRaiting
  Object.keys(answers).forEach(questionId => {
    if (answers[questionId] == testArray[questionId].correct) {
      raiting = raiting + 1;
    } else {
      failedQuestions.push(testArray[questionId].question);
      //console.log(testArray[questionId].question);
    }
  });

  currentSession["answers"] = answers;
  currentSession["raiting"] = raiting;

  await insertInDB(currentSession);

  return {
    raiting,
    failedQuestions
  };
};

// app.use("/public", express.static(path.join(__dirname, "public")));

//app.use("/build", express.static(path.join(__dirname, "build")));

// app.use("/static", express.static(path.join(__dirname, "build/static")));

// app.use("", (req, res, next) => {
//   res.sendFile("./build/index.html", { root: __dirname });
// });

server.listen(serverConfig.server.port, function() {
  console.log(
    `eLearnServer started on http://${serverConfig.server.host}:${serverConfig.server.port}`
  );
});
