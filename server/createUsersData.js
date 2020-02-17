const fs = require("fs");
const USERS = require("../../testData/fakeUsers.json");

let exportData = [];

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

getLearnSession = () => {
  const course = getRandom(1, 4);

  getSemester = () => {
    if (course === 1) {
      return getRandom(1, 3);
    }
    if (course === 2) {
      return getRandom(3, 5);
    }
    if (course === 3) {
      return getRandom(5, 7);
    }
    if (course === 4) {
      return getRandom(7, 9);
    }
  };

  return { course, semester: getSemester() };
};

createExportData = () => {
  USERS.forEach(e => {
    const { course, semester } = getLearnSession();

    const user = {
      name: "#" + e.name,
      age: getRandom(20, 25),
      course,
      semester
    };

    exportData.push(user);
  });
};

createExportData();

console.log(exportData);

const data = JSON.stringify(exportData, null, 2);
fs.writeFileSync("exportData.json", data);
