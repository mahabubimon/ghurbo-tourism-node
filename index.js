// Require Packages
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

// App Create
const app = express();
const port = process.env.PORT || 5000;

// Middle Wire
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@randomdb.rfcve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Create Client in MongoDB
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Server Run Function
const run = async () => {
  try {
    await client.connect();
    const database = client.db("ghurbo-tourism");
    const toursCollection = database.collection("tours");
    const ordersCollection = database.collection("orders");

    // Post API - Tours
    app.post("/tours", async (req, res) => {
      const tour = req.body;
      const result = await toursCollection.insertOne(tour);

      res.json(result);
    });

    // Get API - Tours
    app.get("/tours", async (req, res) => {
      const cursor = toursCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    // Post API - Orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    // Get API Orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // Delete API - Order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      res.json(result);
    });
  } catch {
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Ghurbo Tourism Server Successfully.....");
});

app.listen(port, () => {
  console.log("Running Ghurbo Tourism Server Successfully on port: ", port);
});
