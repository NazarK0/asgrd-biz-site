const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const googleRoutes = require('./routes/googleRoutes');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use("/", [authRoutes, googleRoutes]);

app.listen(PORT, () => console.log(`Server running on ${PORT} port`))