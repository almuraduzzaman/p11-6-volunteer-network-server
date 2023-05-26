const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qe4grrt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const eventsCollection = client.db("volunteerNetwork").collection('events');
        const volunteerCollection = client.db("volunteerNetwork").collection('volunteers');
        const myEventsCollection = client.db("volunteerNetwork").collection('myEvents');


        // Events 

        // insert a event to db 
        app.post('/upload-event', async (req, res) => {
            const data = req.body;
            const result = await myEventsCollection.insertOne(data);
            // console.log(data);
            res.send(result);
        })


        // read from db
        app.get('/all-events', async (req, res) => {
            const events = eventsCollection.find();
            const result = await events.toArray();
            res.send(result);
        })

        // find a specific data from all data 
        app.get('/event-register/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await eventsCollection.findOne(query);
            res.send(result);
        })

        // update data in db
        app.patch('/update-event/:id', async (req, res) => {
            const id = req.params.id;
            const updatedEventData = req.body;
            const filter = { _id: new ObjectId(id) };
            // console.log(updatedEventData);

            const updatedDoc = {
                $set: {
                    name: updatedEventData.name,
                    image: updatedEventData.image,
                    country: updatedEventData.country,
                    category: updatedEventData.category,

                }
            }
            const result = await eventsCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        // delete data in db 
        app.delete('/delete-event/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const result = await eventsCollection.deleteOne(filter);
            res.send(result);
        })


        // volunteer 
        // insert a event to db 
        app.post('/volunteer', async (req, res) => {
            const data = req.body;
            const result = await volunteerCollection.insertOne(data);
            res.send(result);
        })

        // read from db
        app.get('/volunteers', async (req, res) => {
            const events = volunteerCollection.find();
            const result = await events.toArray();
            res.send(result);
        })

        // delete data in db 
        app.delete('/delete-volunteer/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await volunteerCollection.deleteOne(filter);
            res.send(result);
        })


        // my events 
        // read from db
        app.get('/my-events', async (req, res) => {
            const events = myEventsCollection.find();
            const result = await events.toArray();
            res.send(result);
        })

           // delete data in db 
           app.delete('/delete-myEvents/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await myEventsCollection.deleteOne(filter);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Volunteer server is running');
})

app.listen(port, () => {
    console.log(`Volunteer server is running on port ${port}`);
})