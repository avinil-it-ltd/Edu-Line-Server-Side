const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyjwjrz.mongodb.net/?retryWrites=true&w=majority`;
// mongodb+srv://<username>:<password>@cluster0.iyjwjrz.mongodb.net/

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



    // Users Collection
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })
    app.post("/user", async (req, res) => {

      const requests = req.body;
      console.log(requests)
      const result = await usersCollection.insertOne(requests);
      res.json(result);
    });

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

    //  Select Class Collection
    app.post('/selectedClasses', async (req, res) => {
      const item = req.body;
      console.log(item)
      const result = await SelectedClasses.insertOne(item);
      res.send(result);
    })
    app.get('/selectedClasses', async (req, res) => {
      const result = await SelectedClasses.find().toArray();
      res.send(result);
    })



    // Manage Classes
    app.put("/classRequest/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const updatedRequest = req.body;
      console.log(updatedRequest)
      const filter = { _id: new ObjectId(id) };

      console.log("filter", filter)
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          chk: updatedRequest.chk,
        },
      };
      const result = await classes.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result)
      res.json(result);
    });

    // manage users
    app.put("/userRequest/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const updatedRequest = req.body;
      console.log(updatedRequest)
      const filter = { _id: new ObjectId(id) };

      console.log("filter", filter)
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          category: updatedRequest.category,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result)
      res.json(result);
    });


    // Delete
    app.delete("/classRequest/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classes.deleteOne(query);
      res.json(result);
    });



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
  res.send('server running');
})

app.listen(port, () => {
  console.log(`summer camp is running port ${port}`);
})