const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Acess-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Static File Middleware
app.use('/images', express.static(path.join(__dirname, 'images')));

// Logger Middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

// Connect to MongoDB Atlas
const MongoClient = require('mongodb').MongoClient;

const dbName = 'CourseWork2';
const uri = 'mongodb+srv://lumi:lumi@cluster0.iu6zy3v.mongodb.net/CourseWork2?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db = client.db(dbName)

// Database and collection names


// Connect to MongoDB Atlas and retrieve the collections


// REST API Routes
app.get('/lesson', async (req, res) => {
    res.json(await db.collection("lesson").find().toArray())
});

app.post('/order', async (req, res) => {
    const result = await db.collection("lesson")
    const newOrder = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      lessonId: req.body.lessonId,
      spaces: req.body.spaces,
    };
    result.insertOne(newOrder, (error, result) => {
      if (error) {
        console.error('Error saving order:', error);
        res.sendStatus(500);
        return;
      }
      res.json(result.ops[0]);
    });
});

app.put('/lesson/:id', async (req, res) => {
    const result = await db.collection("lesson");
    result.updateOne(
      { _id: req.params.id },
      { $set: req.body },
      (error, result) => {
        if (error) {
          console.error('Error updating lesson:', error);
          res.sendStatus(500);
          return;
        }
        res.json(result);
      }
    );
});

// Search
app.get('/search-lesson/:subject', async(req, res) => {
    const result = await db.collection("lesson")
    res.send(await result.find({ Subject: new RegExp(req.params.subject, 'i')}).toArray())
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
