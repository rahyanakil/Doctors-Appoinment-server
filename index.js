//require cors and express
const express = require("express");
const cors = require("cors");
const app = express();
//set port for backend port 5000
const port = process.env.PORT || 5000;
//mongo client
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// config file require to hide the pass and user
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zruwsn2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db("doctorAppoint").collection("services");
    const checkoutCollection = client
      .db("doctorAppoint")
      .collection("checkout");

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` fields in the returned document
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    });

    //Check out portion in server side
    app.get("/checkout", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await checkoutCollection.find(query).toArray();
      res.send(result);
    });

    //(post method ==creating )insert a document in server side
    app.post("/checkout", async (req, res) => {
      const checkout = req.body;
      console.log(checkout);
      const result = await checkoutCollection.insertOne(checkout);
      res.send(result);
    });
    
    //api for updation with patch method
    app.patch('/checkout/:id',async(req,res)=>{
      const id =req.params.id;
      const filter ={_id: new ObjectId(id)};
      const updateCheckout =req.body;
      console.log(updateCheckout);
      const updateDoc = {
        $set: {
          status: updateCheckout.status
        },
      };
      const result =await checkoutCollection.updateOne(filter,updateDoc);
      res.send(result);
    })
//api for delete operation for delete in checkout part
    app.delete('/checkout/:id',async(req,res)=>{
      const id =req.params.id;
      const query ={_id:new ObjectId(id)}
      const result =await checkoutCollection.deleteOne(query);
      res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("doctor is running");
});

app.listen(port, () => {
  console.log(`Car Doctor Server is running on port ${port}`);
});
