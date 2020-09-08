const express =  require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride  =  require('method-override');

const app = express();
const PORT = process.env.PORT || 5000;

//@ Configuring os for network interface .
var os = require('os');
var ifaces = os.networkInterfaces();
//@ Configuring os for network interface

// BodyParser middleware
// Load User model
const Data = require("./model/Data");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

  // DB Config
  const dbURI = require("./config/keys").mongoURI;
  // Connect to MongoDB
  mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
  var db = mongoose.connection;

  //@ Handling mongo Error 
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log("Mongo DB Connected ")
  });

    // @ Config View Engine 0
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// @ Body Parser middleware config 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// @ Method override middleware config 
app.use(methodOverride('_method'));

// @ Route : GET
// @ Access : Public
// @ Path :/
app.get('/', (req,res)=>{
   res.render('supplydata');
});

// @ Route : POST
// @ Access : Public
// @ Path :/data/search
app.post('/data/supply',async(req,res,next) => {
  var mobileName = req.body.mobileName.toLowerCase();
  var mobileDetails = [], dataJson
  var noneDevice = "This item is not present"
  console.log(mobileName);
  var collectionMobileData = await db.collection('datas')
  collectionMobileData.find({}).toArray((err, result) => {
      if (err) {
          res.send(err)
      } else {
                for (let i = 0; i < result.length; i++) {
                   if (result[i].title == mobileName) {
                       mobileDetails.push(result[i].title, result[i].description, result[i].images, result[i].lastModifiedDate)
                         dataJson = JSON.stringify(mobileDetails);
                         continue;
                   }
                    
                }
                res.render('details',{
                  latestData : dataJson
              });
    }
  });
});

// @ Route : GET
// @ Access : Public
// @ Path :/data/add

  app.get('/data/add', (req,res)=>{
    res.render('adddata');
  })
// @ Route : POST
// @ Access : Public 
// @ Path :/data/add

app.post('/data/add', (req,res,next)=>{
  var images = []
  let title = req.body.title.toLowerCase();
  let description = req.body.description.toLowerCase();
  let imageurl1 = req.body.imageurl1;
  let imageurl2 = req.body.imageurl2;
   images.push(imageurl1, imageurl2);

 // console.log('Received all Data', transaction_id, openingPrice, closingPrice, high, low, volume);
  Data.findOne({ title: title}).then(data => {
    if (data) {
      return res.status(400).json({ transaction_id: "This entry is already exists" });
    } else {
        // @ Dummy Field to save data in Mongo DB 
      const newData = new Data({
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        images: images
      });
           newData
            .save()
            .then(data => res.json(data))
            res.redirect('/')
            .catch(err => console.log(err));
    }
  });
});

  app.listen(PORT, () => {
   devURL();
 });

  //  @ Function generate Dev URL
  const devURL=() => {
    Object.keys(ifaces).forEach( (ifname) =>{
      var alias = 0;
      ifaces[ifname].forEach( (iface) => {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }
        if (alias >= 1) {
        } else {
          var url = 'http://'+iface.address+':'+PORT+'/'
          console.log(`Dev URL: `,url);
        }
        ++alias;
      });
    });
  }


