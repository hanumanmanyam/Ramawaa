const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const url1 = process.env.MONGODB_URI;
mongoose
  .connect(url1, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    console.log("MONGODB");
  });
const d = new Date();
const app = express();
const path = require("path");
const url =
  "mongodb+srv://ramawaa:Ramawaa1$@cluster0.mcbiqsc.mongodb.net/?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));
var arr = [];
var today = 0;
var tab = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

// try {
//   mongoose.connect(process.env.MONGODB_URI);
//   console.log("DB IS CONNECTED");
// } catch (error) {
//   console.log(error);
// }
const User = require("./models/pass.js");
const Menu1 = require("./models/menu.js");
const History = require("./models/orders.js");
const Pending = require("./models/pending.js");
app.get("/", (req, res) => {
  res.render("Login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/back", (req, res) => {
  var email2 = req.query.email;
  console.log(email2);
  Menu1.find({}).then(function (menu) {
    if (menu) {
      History.find().then(function (ord) {
        if (ord) {
          return res.render("home", {
            to: today,
            arr: ord,
            menu1: menu,
            table: "Total",
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            email1: email2,
          });
        } else {
          console.log(err);
          return;
        }
      });
    } else {
      console.log(err);
      return;
    }
  });
});

app.post("/signup", function (req, res) {
  // if(req.body.password != req.body.Cpassword)
  // {
  //     return  res.redirect('back');
  // }
  User.findOne({ email: req.body.email }).then(function (user) {
    try {
      if (user) {
        return res.redirect("back");
      } else {
        User.create(req.body).then(function (err) {
          if (err) {
            console.log(err);
          } else {
            return res.redirect("Login");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

app.post("/validate", function (req, res) {
  User.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      if (req.body.password != user.password) {
        return res.redirect("back");
      }
      Menu1.find({}).then(function (menu) {
        if (menu) {
          History.find().then(function (ord) {
            if (ord) {
              return res.render("home", {
                to: today,
                arr: ord,
                menu1: menu,
                table: "Total",
                year: d.getFullYear(),
                month: d.getMonth(),
                day: d.getDate(),
                email1: req.body.email,
              });
            } else {
              console.log(err);
              return;
            }
          });
        } else {
          console.log(err);
          return;
        }
      });
      // res.cookie['user_id',user.id];
    } else {
      return res.redirect("back");
    }
  });
});
app.get("/item", function (req, res) {
  res.render("Add", {
    arr1: arr,
  });
});
app.get("/table", function (req, res) {
  let num = req.query.num;
  console.log(req.query.email);
  var email1 = req.query.email;
  let type1;
  if (num >= 1 && num < 100) type1 = "Dine in";
  else type1 = "Delivary";
  Menu1.find({}).then(function (menu) {
    Pending.find({}).then(function (item) {
      if (menu) {
        if (item) {
          return res.render("menu", {
            arr2: item,
            table: num,
            menu1: menu,
            type: type1,
            email: email1,
          });
        } else {
          console.log(err);
          return;
        }
      }
    });
  });
});
app.get("/del", function (req, res) {
  let id = req.query.id;
  // let table1 = req.query.table;
  // let ind=req.query.index;
  // console.log(ind);
  // if(arr[ind].count>1) arr[ind].count--;
  // else arr.splice(ind,1);
  Pending.findById(id).then(function (item) {
    if (item.count > 1) {
      Pending.findByIdAndUpdate(id, { count: item.count - 1 }).then(function (
        item1
      ) {
        if (item1) console.log(item1);
      });
    } else {
      Pending.findByIdAndDelete(id).then(function (item2) {
        if (item2) {
          console.log(item2);
        }
      });
    }
  });

  return res.redirect("back");
});
app.post("/cart", function (req, res) {
  let table1 = req.query.table;
  var str = req.body.name;
  var opt1;
  if (table1 >= 1 && table1 <= 100) opt1 = "Dine-in";
  else opt1 = "Delevary";
  var name1 = str.substring(1, str.length - 1);
  var total1 = 0;
  console.log(name1);
  Menu1.findOne({ name: name1 }).then(function (item) {
    console.log(item);
    total1 = item.price * req.body.count;
    console.log(item + " " + total1);

    var item1 = {
      name: name1,
      cat: item.cat,
      count: req.body.count,
      total: total1,
      table: table1,
      opt: opt1,
    };

    arr.push(item1);
    Pending.create(item1).then(function (item) {
      if (item) console.log(item);
    });
  });

  return res.redirect("back");
});
app.get("/view", function (req, res) {
  return res.render("Orders", {
    arr2: arr,
  });
});
app.get("/confirm", function (req, res) {
  var table1 = req.query.table;
  var arr1 = req.query.arr;
  var temp = [];
  Pending.find({ table: table1 }).then(function (item) {
    if (item) {
      for (let i of item) {
        console.log(i.table);
        if (i.table == table1) {
          console.log("Found");
          temp.push({
            name: i.name,
            cat: i.cat,
            count: i.count,
            total: i.total,
            table: i.table,
            opt: i.opt,
          });
        }
      }
      console.log(temp);
  var a = { order: temp };
  History.create(a).then(function (item) {
    if (item) {
      console.log(item);
      console.log(item.createdAt);
      Pending.deleteMany({ table: table1 }).then(function (item1) {
        if (item1) console.log(item1);
        return res.redirect("back");
      });
    } else {
      console.log("Error");
    }
    
  });
  
      
    }
  });
});
app.get("/edit", function (req, res) {
  res.render("Edit");
});
app.post("/Eitem", function (req, res) {
  var name1 = req.body.name;
  var cat1 = req.body.cat;
  Menu1.findOneAndUpdate(
    { name: name1, cat: cat1 },
    { price: req.body.price }
  ).then(function (item) {
    console.log(item);
  });
  return res.redirect("back");
});

app.get("/his", function (req, res) {
  var table1 = req.query.table;
  var email1 = req.query.email;
  console.log(email1);

  History.find().then(function (ord) {
    Pending.find({}).then(function (item) {
      if (ord) {
        if (item) {
          return res.render("History", {
            table: table1,
            arr1: item,
            order: ord,
            email: email1,
          });
        } else {
          console.log(err);
          return;
        }
      }
    });
  });
});

app.get("/clear", function (req, res) {
  let table1 = req.query.table;
  var index = 0;
  Pending.deleteMany({ table: table1 }).then(function (item) {
    if (item) console.log(item);
  });
  return res.redirect("back");
});
app.post("/add", function (req, res) {
  Menu1.create(req.body).then(function (item) {
    if (item) {
      console.log(item);
      return res.redirect("back");
    } else {
      console.log("Error");
      return;
    }
  });
});
app.get("/order", function (req, res) {
  History.find().then(function (ord) {
    if (ord) {
      return res.render("OrderHistory", {
        arr: ord,
        count: ord.length,
        table: "Total",
      });
    } else {
      console.log(err);
      return;
    }
  });
});

app.listen(8000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is up at: " + 8000);
  }
});
