const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID, ObjectId } = require('bson');
require('dotenv').config();
// middle ware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.USER_PASSWORD}@cluster0.wfqwiph.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('singwithjoy').collection('services');
        const reviewCollection = client.db('singwithjoy').collection('reviews');
        const addServicesCollection = client.db('singwithjoy').collection('addServices');

        app.get('/services', async(req,res)=>{
            const query ={}
            const cursor =serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // app.get('/services/:id',async(req,res)=>{
        //     const id = req.params.id;
        //     const query ={}
        //     const cursor =serviceCollection.find(query);
        //     const services = await cursor.toArray();
        //     const selectedService = services.find(service =>service.id === id);
        //     res.send(selectedService)
        // });
        app.get('/services/:id', async(req,res)=>{
            const Id = req.params.id
            const query ={ _id: ObjectId(Id) }
            // const cursor =serviceCollection.findOne(query);
            const services = await serviceCollection.findOne(query);
            res.send(services);
        })

        // reviwes api
        app.post('/review', async(req, res)=>{
            const reviews= req.body;
            const result= await reviewCollection.insertOne(reviews);
            res.send(result)
        })
        

        app.get('/review/:id', async(req,res)=>{
            const Id = req.params.id
            const query ={ id: (Id) }
            const cursor =reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/myreview/:uid', async(req,res)=>{
            const uid =req.params.uid
            const query ={uid: (uid)}
            const cursor =reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/addservices', async(req, res)=>{
            const services= req.body;
            const result= await serviceCollection.insertOne(services);
            res.send(result)
        })
    }
    finally{

}
}
run().catch(err => console.error(err));


// console.log(process.env.DB_USER)
app.get('/',(req,res)=>{
    res.send('look mama tor heda')
});

app.listen(port,()=>{
    console.log(`server is running mama ${port}`)
})