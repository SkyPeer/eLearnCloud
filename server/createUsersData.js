const fs = require("fs");
const USERS = require("../../testData/fakeUsers.json");

let exportData = [];

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

createExportData = () => {
  USERS.forEach(e => {
    const user = {
      name: "#" + e.name,
      age: getRandom(20, 25),
      course: getRandom(1, 4)
    };

    exportData.push(user);
  });
};

createExportData();

console.log(exportData);

const data = JSON.stringify(exportData, null, 2);
fs.writeFileSync("exportData.json", data);
