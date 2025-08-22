const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylneatr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// --------- MIDDLEWARE ---------
app.use(cors());          // Enable CORS for all routes
app.use(express.json());  // Parse JSON request body
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    db = client.db("shoeCollection");
    app.post("/shoes", async (req, res) => {
      try {
        const shoeData = req.body;

        const result = await db.collection("shoes").insertOne(shoeData);
        res.status(201).json({ message: "Shoe added successfully", data: result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add shoe" });
      }
    });
    app.get("/display/shoes", async (req, res) => {
      try {
        const shoes = await db.collection("shoes").find({}).toArray();
        res.status(200).json({ data: shoes });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch shoes" });
      }
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

// --------- ROUTES ---------
app.get("/", (req, res) => {
  res.send("Urban Kicks Express Server");
});


// --------- START SERVER ---------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

