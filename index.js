const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1xtzuq.mongodb.net/?retryWrites=true&w=majority`;

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
    // const languageCollection = client.db('languageDb').collection('instructors');
    // const languageCollection = client.db('languageDb').collection('Classes');


    const classes = client.db('languageDb').collection("classes");
    const instructors = client.db('languageDb').collection("instructors");
    const reviewers = client.db('languageDb').collection("reviewer");
    const SelectedClasses = client.db('languageDb').collection("SelectClasses");
    const usersCollection = client.db('languageDb').collection("users");
  
   //  Select Class Collection
   app.post('/api/classes', async (req, res) => {
    const item = req.body;
    console.log(item)
    const result = await classes.insertOne(item);
    res.send(result);
  })

    app.get('/api/classes', async (req, res) => {
      const result = await classes.find().toArray();
      res.send(result);
    })

    app.get('/api/instructors', async (req, res) => {
      const result = await instructors.find().toArray();
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


app.get('/',(req, res) =>{
    res.send('server running');
})

app.listen(port, ()=>{
    console.log(`summer camp is running port ${port}`);
})