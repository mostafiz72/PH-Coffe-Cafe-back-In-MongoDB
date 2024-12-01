const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware configuration Useing.......

app.use(cors());
app.use(express.json());

//// MongoDB database useing and configurations...........


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eywn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // clint site data receiveding functionality start here now-------------------
    
    const coffeCollection = client.db("coffeDB").collection("coffee"); // coffeDB name ekta data base create kora hoyse and coffee er mordhe all data thakbe mongodb te
    
    app.get("/coffe", async(req, res)=>{
      const result = await coffeCollection.find().toArray(); // ai 1 line a mongodb te data fetch kora holo
      res.send(result)
    })

    app.post('/coffe', async(req, res)=>{
      const newCoffe = req.body;
      console.log("new coffe hiting", newCoffe);
      const result = await coffeCollection.insertOne(newCoffe); /// ai 1 line a mongodb te data pathano holo
      res.send(result)
    })

    // Updated Coffee card functionality start here now---------------
   
    app.put('/coffe/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updatedDoc = req.body;
      const updated = {
        $set: {
          name: updatedDoc.name,
          Chef: updatedDoc.Chef,
          Supplier: updatedDoc.Supplier,
          Taste: updatedDoc.Taste,
          Category: updatedDoc.Category,
          Details: updatedDoc.Details,
          Photo: updatedDoc.Photo,
        }
      }
      const result = await coffeCollection.updateOne(filter, updated, options)
      res.send(result)
    })


    /// single product details functionality start here 

    app.get('/coffe/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeCollection.findOne(query);
      res.send(result);
    })

    /// product deleted functionality start here now---------------------

    app.delete('/coffe/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res)=>{
    res.send("Hello World!");
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})