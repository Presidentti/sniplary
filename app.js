const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Init middleware
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/snippet', require('./routes/api/snippet'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
