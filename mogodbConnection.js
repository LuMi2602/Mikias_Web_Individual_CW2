const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
//const connectToMongoDB = require('./db'); // Assuming you have a separate file for MongoDB connection


const app = express();

app.use(cors());
app.use((req,res,next) => {

    res.setHeader('Acess-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers","*");
    next();
})


// Middleware
app.use(bodyParser.json());
app.use(logger);

// Static File Middleware
app.use('/images', express.static(path.join(__dirname, 'images')));







// REST API Routes
// ...

// Start the server
const port = 3000; // Choose a port number that is not in use
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});








const { MongoClient } = require('mongodb');

// Connect to MongoDB Atlas
const uri = 'mongodb+srv://lumi:lumi@cluster0.iu6zy3v.mongodb.net/CourseWork2?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and collection names
const dbName = 'CourseWork2';
const lessonCollectionName = 'lesson';
const orderCollectionName = 'order';

// Connect to MongoDB Atlas and retrieve the collections
async function connectToMongoDB() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const lessonCollection = db.collection(lessonCollectionName);
    const orderCollection = db.collection(orderCollectionName);
    
 // Create text index on 'Subject' field
 await db.collection('lessonCollection').createIndex({ Subject: 'text' });
 console.log('Text index created on Subject field');

    return { lessonCollection, orderCollection };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = connectToMongoDB;
  






// Logger Middleware
function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  }
  
  // Static File Middleware
  // Serve lesson images from the 'images' directory
app.use('/images', (req, res, next) => {
  const imagePath = path.join(__dirname, 'images', req.path);
  
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Image file does not exist
      res.status(404).send('Image not found');
    } else {
      // Image file exists, serve it
      res.sendFile(imagePath);
    }
  });
});





  // REST API Routes
app.get('/lesson', async (req, res) => {
    try {
      const { lessonCollection } = await connectToMongoDB();
      const lesson = await lessonCollection.find().toArray();
      res.json(lesson);
    } catch (error) {
      console.error('Error retrieving lesson:', error);
      res.sendStatus(500);
    }
  });
  
  app.post('/order', async (req, res) => {
    try {
      const { orderCollection } = await connectToMongoDB();
      const newOrder = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        lessonId: req.body.lessonId,
        spaces: req.body.spaces
      };
      const result = await orderCollection.insertOne(newOrder);
      res.json(result.ops[0]);
    } catch (error) {
      console.error('Error saving order:', error);
      res.sendStatus(500);
    }
  });
  
  app.put('/lesson/:id', async (req, res) => {
    try {
      const { lessonCollection } = await connectToMongoDB();
      const lessonId = req.params.id; // Extract the lessonId from the URL parameter
      const updatedSpaces = req.body.spaces;
      const result = await lessonCollection.updateOne(
        { _id: lessonId }, // Use {_id: lessonId} instead of { _id: lessonId }
        { $set: { spaces: updatedSpaces } }
      );
      res.json(result);
    } catch (error) {
      console.error('Error updating lesson:', error);
      res.sendStatus(500);
    }
  });
  
  


// search
app.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    const { lessonCollection } = await connectToMongoDB();

    // Perform text search using MongoDB's $text operator
    const searchResults = await lessonCollection.find(
      { $text: { $search: query } }
    ).toArray();

    res.json(searchResults);
  } catch (error) {
    console.error('Error performing search:', error);
    res.sendStatus(500);
  }
});



// //   // Fetch Examples

// // // Retrieve all lesson with GET
// fetch('/lesson')
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log(error));

// // Save a new order with POST
// const newOrder = {
// name: 'John Doe',
// phoneNumber: '1234567890',
// lessonId: '646a6b62ddf83d022f86b040',
// spaces: 2
// };

// fetch('/order', {
// method: 'POST',
// headers: {
//   'Content-Type': 'application/json'
// },
// body: JSON.stringify(newOrder)
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.log(error));

// // Update available lesson space with PUT
// const lessonId = '646a6b62ddf83d022f86b040';
// const updatedSpaces = 5;

// fetch(`http://localhost:3000/lesson/${lessonId}`, {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({ spaces: updatedSpaces })
// })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.log(error));
