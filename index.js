
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
// const uri = "mongodb://localhost:27017"

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5acpqm.mongodb.net/?retryWrites=true&w=majority`;

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
//     await client.connect();
const database = client.db("productDB");
const productCollection = database.collection("product");
const cartCollection = database.collection("cartItem");
app.post('/product', async (req, res) => {
     const product = req.body;
     //   console.log(product);
     const result = await productCollection.insertOne(product);
     console.log(result);
     res.send(result);
   });
  // post to Cart
app.post('/cart', async (req, res) => {
     const product = req.body;
     //   console.log(product);
     const result = await cartCollection.insertOne(product);
     console.log(result);
     res.send(result);
   });
// get from cart
   app.get('/cart', async(req, res)=>{
    const cursor = cartCollection.find()
    const result = await cursor.toArray();
       res.send(result);
  });
  //delete from cart
  app.delete('/cart/:id', async(req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(query);
    res.send(result)
  
  })
   app.get('/product', async(req, res)=>{
    const cursor = productCollection.find()
    const result = await cursor.toArray();
       res.send(result);
  });

// Route to get data by brandName
app.get('/product/brand/:brandName', async (req, res) => {
  const brandName = req.params.brandName;

  try {
    const query = { brandName: brandName };
    const result = await productCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// Route to get data by id
app.get('/product/id/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = { _id: new ObjectId(id) };
    const product = await productCollection.findOne(query);
    if (!product) {
      res.status(404).json({ error: "Product not found." });
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});
 
  // delete
  app.delete('/product/:id', async(req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await productCollection.deleteOne(query);
    res.send(result)
  
  })

  // put
  app.put('/product/:id', async(req, res)=>{
    const id = req.params.id;
    const product = req.body;
    // console.log(product);
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true }
    const updatedProduct = {
      // {name, brandName, type, price, rating, details, image }
      $set: {
        name: product.name,
        brandName: product.brandName,
        type: product.type,
        price: product.price,
        rating: product.rating,
        details: product.details,
        image: product.image,
      }
    }
    const result = await productCollection.updateOne(filter, updatedProduct, options);
    res.send(result);
        })
   app.get("/", (req, res) => {
    res.send("Crud is running...");
  });
    // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  } 
}
run().catch(console.dir);


   

   app.listen(port, () => {
     console.log(`Simple Crud is Running on port ${port}`);
   });
   
      
