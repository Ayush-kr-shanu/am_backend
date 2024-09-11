const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const https = require('https');
const dbConnection = require("./config/db");
const config = require("./config/config");
const router = require("./routes")
const { sendEmail } = require("./utils/email")

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (request, response) => {
    response.send("Welcome to the API!");
})

app.use("/api", router);


// app.listen(config.PORT, () => {
//     try {
//         dbConnection()
//         console.log(`Server is running on port ${config.PORT}`);
//     } catch (error) {
        
//     }
// })

const keyPath = path.resolve(__dirname, '../selfsigned.key');
const certPath = path.resolve(__dirname, '../selfsigned.crt');

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

https.createServer(options, app).listen(config.PORT, () => {
    console.log(`Server running with SSL on port: ${config.PORT}`);

    // Connect to the database after server starts
    dbConnection();
});