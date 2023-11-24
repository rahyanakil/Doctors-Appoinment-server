//require cors and express
const express =require('express');
const cors =require('cors');
const app = express();
//set port for backend port 5000
const port = process.env.PORT || 5000;
//mongo client
const { MongoClient, ServerApiVersion } = require('mongodb');
// config file require to hide the pass and user
require('dotenv').config()



//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zruwsn2.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('doctor is running')
})

app.listen(port,()=>{
    console.log(`Car Doctor Server is running on port ${port}`);
})