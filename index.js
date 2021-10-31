const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

require("dotenv").config();

// App Create
const app = express();
const port = process.env.PORT || 5000;

// Middle Wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@randomdb.rfcve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("ghurbo-tourism");
    const toursCollection = database.collection("tours");
    const ordersCollection = database.collection("orders");

    // Post API Tours
    app.post("/tours", async (req, res) => {
      const tour = req.body;
      console.log("hit the post api", tour);

      const result = await toursCollection.insertOne(tour);
      res.json(result);
    });

    // Get API Tours
    app.get("/tours", async (req, res) => {
      const cursor = toursCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    // Add Orders API
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

    // DELETE API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
      console.log(result);
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
