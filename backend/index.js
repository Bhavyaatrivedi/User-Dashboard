const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const Parent = require('./model/parentSchema')
const bodyParser= require('body-parser')


const app = express();

app.use(bodyParser.json({
  limit: '50mb', 
  extended: true
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));
// app.use(helmet());




global.__basedir = __dirname;
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
     
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  })
);



app.listen(8000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server Started Successfully.');
  }
});

mongoose
  .connect('mongodb+srv://bhavyaa:bhavyaauser@cluster0.nsu1yqn.mongodb.net/LOGIN?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successfull');
  })
  .catch((err) => {
    console.log(err.message);
  });

  app.use('/Images', express.static(path.join(__dirname, 'Images')));

  app.post('/parents', async (req, res) => {
    try {
      const newParent = new Parent(req.body);
      console.log(req.body)
      const savedParent = await newParent.save();
      res.status(201).json(savedParent);
    } catch (err) {
      console.error(err);
      res.status(400).send('Error creating parent');
    }
  });

app.use(cookieParser());

app.use(express.json());
 app.use('/', authRoutes);
