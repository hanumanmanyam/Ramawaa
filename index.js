const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const url =
  "mongodb+srv://ramawaa:Ramawaa1$@cluster0.mcbiqsc.mongodb.net/?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));
var arr = [];
var today=0;
var tab=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
try {
  mongoose.connect(url);
  console.log("DB IS CONNECTED");
} catch (error) {
  console.log(error);
}
const User = require("./models/pass.js");
const Menu1 = require("./models/menu.js");
const History = require("./models/orders.js");
app.get("/", (req, res) => {
  res.render("Login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/back", (req, res) => {
  Menu1.find({}).then(function (menu) {
    if (menu) {
      History.find().then(function (ord) {
        if (ord) {
          return res.render("home", {
            to:today,
            arr:ord,
            menu1:menu,
            table:"Total"
            
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
                to:today,
                arr:ord,
                menu1:menu,
                table:"Total"
                
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
  let type1;
  if(num>=1 && num<100)type1="Dine in";
  else type1="Delivary"
  Menu1.find({}).then(function (menu) {
    if (menu) {
      return res.render("menu", {
        arr2: arr,
        table: num,
        menu1: menu,
        type:type1
      });
    } else {
      console.log(err);
      return;
    }
  });
});
app.post("/cart", function (req, res) {
  let table1 = req.query.table;
  var str = req.body.name;
  var opt1;
  if(table1 >=1 && table1<=100)opt1="Dine-in";
  else opt1="Delevary";
  var name1 = str.substring(1, str.length - 1);
  var total1=0;
  console.log(name1);
  Menu1.findOne({ name: name1 }).then(function (item) {
    console.log(item);
    total1 = (item.price * req.body.count);
    console.log(item+" "+total1);
    

    var item1 = {
      name: name1,
      cat: item.cat,
      count: req.body.count,
      total: total1,
      table: table1,
      opt: opt1
    };
    
    arr.push(item1);
  });

  
  return res.redirect("back");
});
app.get("/view", function (req, res) {
  return res.render("Orders", {
    arr2: arr,
  });
});
app.get("/confirm",function(req,res){
  let table1 = req.query.table;
  var index = 0;
  today++;
  var temp=[];

  for (let i of arr) {
    if (i.table == table1) {
      temp.push(i); 
    }
    
  }
  for (let i of arr) {
    if (i.table == table1) {
      arr.splice(index);
    }
    index++;
  }
  var a={order: temp};
  if(table1>=1 && table1<100)tab[table1-1].push(temp); 
  History.create(a).then(function (item) {
    if (item) {
      console.log(item);
      console.log(item.createdAt);
    } else {
      console.log("Error");
    }
  });
  return res.redirect("back");
});
app.get('/edit',function(req,res){
  res.render('Edit');

});
app.post('/Eitem',function(req,res){
  var name1=req.body.name;
  var cat1=req.body.cat;
  Menu1.findOneAndUpdate({ name: name1,cat:cat1 },{price:req.body.price}).then(function (item) {
    console.log(item);
  });
  return res.redirect('back');


});

app.get('/his',function(req,res){
  let table1 = req.query.table;

  History.find().then(function (ord) {
    if (ord) {
      return res.render('History',{
        table:table1,
        arr1:arr,
        order:ord
    
      });
    } else {
      console.log(err);
      return;
    }
  });
  


});

app.get("/clear", function (req, res) {
  let table1 = req.query.table;
  var index = 0;
  for (let i of arr) {
    if (i.table == table1) {
      arr.splice(index);
    }
    index++;
  }
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
app.get("/order",function(req,res){

  History.find().then(function (ord) {
    if (ord) {
      return res.render("OrderHistory", {
        arr:ord,
        count:ord.length,
        table:"Total"
        
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
