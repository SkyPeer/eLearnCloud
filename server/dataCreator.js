//DataCreator testLib
const fetch = require("node-fetch");
const fs = require("fs");
const fakeUsers = require("../../testData/fakeUsers.json");
const testArray = require("./testArray");

let answers = {};
let testData = [];

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

updateAnswerObjects = () => {
  testArray.forEach((question, index) => {
    questionIndex = getRandom(0, question.answers.length);
    answers[index] = question.answers[questionIndex].id;
  });
};

//updateAnswerObjects();

getSession = async user => {
  const res = await fetch("http://localhost:3100/api/newsessioncreate", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(user)
  });

  if (res.status === 200) {
    const resData = await res.json();
    if (resData.sessionId) {
      const sessionId = resData.sessionId;
      return sessionId;
    }
  }
};

setAnswers = async (answers, sessionId) => {
  //console.log("setAnswers", answers, sessionId);
  const res = await fetch("http://localhost:3100/api/setAnswers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      answers,
      sessionId
    })
  });

  if (res.status === 200) {
    const data = await res.json();
    console.log(" - - - - - -");
    console.log("result", data);
    console.log(" - - - - - -");
  }
};

getUser = () => {
  return {
    name: fakeUsers[getRandom(0, fakeUsers.length - 1)].name,
    age: getRandom(20, 30),
    course: getRandom(1, 4)
  };
};

getAnswers = () => {
  let answers = {};
  testArray.forEach(q => {
    answers[q.questionId] = getRandom(0, q.answers.length - 1);
  });
  return answers;
};

createTestModel = async () => {
  let _answers = {};
  let testModel = {
    user: {
      name: fakeUsers[getRandom(0, fakeUsers.length - 1)].name,
      age: getRandom(20, 30),
      course: getRandom(1, 4)
    }
  };
  testArray.forEach(q => {
    _answers[q.questionId] = getRandom(0, q.answers.length - 1);
  });
  testModel["answers"] = _answers;

  testData.push(testModel);
};

foo = async () => {
  const user = getUser();
  const answers = getAnswers();
  // console.log("user:", user);
  const sessionId = await getSession(user);
  if (sessionId) {
    console.log("sessionWasCreated:", sessionId.slice(0, 15));
  }
  // console.log(answers);
  setAnswers(answers, sessionId);
};

start = async () => {
  for (var i = 0; i < 1024; i++) {
    await foo();
  }
};

start();
//createTestModel();
// for (var i = 0; i < 2; i++) {
//   createTestModel();
// }

// foo = () => {
//   testData.forEach(async (testData, i) => {
//     await getSession(testData);
//     console.log("res: ", i);
//   });
// };
// foo();

//getSession();cls

// console.log(" - - - testData", testData);
