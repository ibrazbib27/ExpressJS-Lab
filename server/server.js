const express = require("express");
const app = express();
const bp = require("body-parser");
const path = require("path");
const fs = require("fs");
let count = 0;

//REQUIRED STEP 5
app.use((req, res, next) => {
  console.log(`${req.url}`);
  next();
});

//ADVANCED
app.use(bp.urlencoded({ extended: false }));

app.use(bp.json());
app.post("/user-info", (req, res) => {
  if (!fs.existsSync("./user-info.json"))
    fs.appendFileSync(
      "user-info.json",
      '{\n "data": [\n' + (JSON.stringify(req.body, null, 2) + "]}")
    );
  else {
    fs.readFile("user-info.json", "utf8", (err, data) => {
      if (err) throw err;
      data = data.replace(/}]}/, "},\n");
      fs.writeFileSync(
        "user-info.json",
        data + (JSON.stringify(req.body, null, 2) + "]}")
      );
    });
  }
  res.send("User Info Submitted!");
});
app.get("/formsubmission", (req, res) => {
  fs.readFile("user-info.json", "utf8", (err, json) => {
    if (err) throw err;
    const jsonArr = JSON.parse(json);
    let data = "";
    jsonArr.data.forEach((obj) => {
      count++;
      data += `User No. ${count}: <ul><li><b>User's Name:</b> ${obj.name}</li><li><b>User's Email:</b> ${obj.email}</li><li><b>User's Age:</b> ${obj.age}</li><li><b>User's Phone Number:</b> ${obj.phoneNumber}</li></ul><br/><br/>`;
    });
    res.send(data);
  });
});

//REQUIRED STEP 4
app.use(express.static(path.join(__dirname, "../public")));

//REQUIRED STEP 3
app.get("/", (req, res) => {
  res.send("Hello from the web server side...");
});

app.listen(3000);
