const express = require('express');
const app = express();
const port = 3020; // Example port, change as needed
const Route = require('./Routes/Routes.js')
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
const dotenv = require('dotenv')
dotenv.config()
const DB = require('./Config/ConnectDB.js')
DB()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) 

app.use("/api", Route)

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
