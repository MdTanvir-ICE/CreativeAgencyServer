const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = 4000;


const app = express();
app.use(express.static('images'));
app.use(fileUpload());

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//start

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://creativeAgency:creativeAgency@cluster0.sfbl4.mongodb.net/creativeAgency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const adminCollection = client.db("creativeAgency").collection("admin");
  const serviceCollection = client.db("creativeAgency").collection("service");
  const orderCollection = client.db("creativeAgency").collection("order");
  const reviewCollection = client.db("creativeAgency").collection("review");

  app.post('/addAdmin', (req, res) => {
    const email = req.body;
    console.log(email);
    adminCollection.insertOne(email)
      .then(result => {
        console.log(result);
        res.send('your product added');
      })
  });

  app.post('/addService', (req, res) => {
    const email = req.body;
    console.log(email);
    serviceCollection.insertOne(email)
      .then(result => {
        console.log(result);
        res.send('your product added');
      })
  });
  app.post('/addReview', (req, res) => {
    const data = req.body;
    console.log(data);
    reviewCollection.insertOne(data)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0);
      })
  });

  app.post('/addEvent', (req, res) => {
    const file = req.files.file;
    const name = req.body.title;
    const about = req.body.about;
    const newImg = file.data;
    const encImg = newImg.toString('base64');


    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    serviceCollection.insertOne({ name, about, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  app.post('/addOrder', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const about = req.body.about;
    const status = req.body.status;
    const project = req.body.project;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    console.log(name);
    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    orderCollection.insertOne({ name, email,about,status,project, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  //get method is here

  //for all homw page event
  app.get('/event', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });
  
  //all client review
  app.get('/allReview', (req, res) => {
    reviewCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

//admin see the all order collection
app.get('/allOrder', (req, res) => {
  orderCollection.find({})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})


//user all services
app.get('/user/:email', (req, res) => {
  email = (req.params.email)
  console.log(email);
  orderCollection.find({ email: email })
    .toArray((err, documents) => {
      res.send(documents);
    })
})

//chek the admin email
  app.get('/admin/:email', (req, res) => {
    email = (req.params.email)
    console.log(email);
    adminCollection.find({ email: email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


});


//end

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT ||port)