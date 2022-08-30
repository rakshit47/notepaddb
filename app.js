const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const PORT = process.env.PORT || 3000;
const db = require("./db");

let x;

app.use(express.static(__dirname));

app.use(bodyparser.json());

app.listen(PORT, () => console.log(`Listening at ${PORT}`));

app.route("/txt").post((req, res) => {
  // res.sendFile(__dirname + '/index2.html');
  x = req.body;
  try {
    db.check(x.name)
      .then((r) => {
        checker(x.name);
        if (!!r) {
          throw { status: 403, msg: "FileName Aready Exists!" };
        } else {
          res.json({ status: 201, pro: true });
        }
      })
      .catch((err) => {
        err.pro = false;
        res.json(err);
      });
  } catch (error) {
    res.json(error);
  }
});

app.route("/new").post((req, res) => {
  let z = req.body;
  try {
    // console.log(req.body.text);
    db.create(z).then((a) => {
      res.json({ status: 201, msg: "Created Successfully" });
    });
  } catch (err) {
    res.json(err);
  }
});

app.route("/:fname").get((req, res) => {
  db.find(req.params.fname).then((d) => {
    if (!!d?.text)
      res.send(`<head>
    <title>${d.name}.txt</title>
    <link rel="shortcut icon" href="https://i.ibb.co/ZXNqjq0/ico.png" type="image/x-icon">
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";>
    <div id="one" class="one">
        <h1 class="heading">${d.name}</h1>
        <p class="info">createdOn: ${d.createdOn}</p>
        <hr class="hr">
    </div>
    ${d.text}

    <script>
      const col = document.getElementById("one");
      let x = Math.ceil(Math.random() * 5 - 1);
      let arr = [
        "rgb(255,255,7)",
        "rgb(6,138,254)",
        "rgb(188,6,254)",
        "rgb(254,167,6)",
        "rgb(254,6,6)",
      ];

      col.style.backgroundColor = arr[x];
    </script>

  </body>
  
  
<style>
* {
  margin: 0px;
  padding: 0px;
}

.one {
  user-select: none;
  /* display: inline; */
  position: static;
  background-color: rgb(255, 255, 7);
  font-family: "century gothic";
}

.heading {
  display: inline-block;
  margin: 15px;
  color: rgb(25, 25, 25);
  font-weight: 100;
  height: auto;
  box-shadow: 0px 0px 0px #3124eb;
}

.hr {
  height: 12px;
  border: 0pc;
  background-color: rgb(40, 40, 40);
  box-shadow: 1px 1px 2px rgb(40, 40, 40);
}

.info {
  margin-left: 15px;
}
</style>
`);
    else res.sendFile(__dirname + "/index2.html");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const checker = (name) => {
  if (name.length > 16) throw { status: 403, msg: `FileName Too Long` };
  for (ele of name) {
    let val = ele.charCodeAt(0);
    if (val < 34 || val > 126 || val == 46)
      throw { status: 403, msg: ` '${ele}' is not allowed` };
  }
};
