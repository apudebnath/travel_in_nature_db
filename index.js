const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mthak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('travelinnature')
        const packageCollection = database.collection('packages')
        const orderCollection = database.collection('orders')

        // Insert data to database
        app.post('/packages', async(req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            res.send(result);

        }) 
        // Insert Order data to database
        app.post('/orders', async(req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        })
        // Get all Packages
        app.get('/packages', async(req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
        // Get single Packages
        app.get('/packages/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const package = await packageCollection.findOne(query);
            res.send(package);
        })
        // Delete Order pack
        app.get('/orders/:email', async(req, res) => {
            const email = req.params.email;
            //const query = {email: {$in: email}}
            //const orders = await orderCollection.find(query).toArray();
            console.log(req.params);
            //res.send(orders);
        })
    }
    finally{
        //await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel Server is hitting');
})

app.listen(port, () => {
    console.log('Travel Server use Port', port);
})


