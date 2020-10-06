const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuuqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const worksCollection = client.db("volunteerNetwork").collection("works");
    const participateCollection = client.db("volunteerNetwork").collection("participate");
    const ordersCollection = client.db("volunteerNetwork").collection("order");
   
   app.post('/addWorks', (req, res) => {
       const works = req.body;
       worksCollection.insertOne(works)
       .then(result => {
           res.send(result.insertedCount)
       })
   })

   app.get('/works', (req, res) =>{
       worksCollection.find({})
       .toArray( (err, documents) => {
           res.send(documents);
       })
   })

app.post('/addSector', (req, res) => {
    const sector = req.body;
    console.log(sector);
    participateCollection.insertOne(sector)
    .then(result =>{
        res.send(result.insertedCount)
    })
})

app.get('/sector', (req, res) => {
    participateCollection.find({})
    .toArray( (err, documents) =>{
        res.send(documents)
    })
})


app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder)
    ordersCollection.insertOne(newOrder)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

app.delete('/delete/:key', (req, res) => {
    participateCollection.deleteOne({key: req.params.key})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
})

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)