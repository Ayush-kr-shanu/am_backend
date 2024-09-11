const express = require("express");
const cors = require("cors");
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


app.listen(config.PORT, () => {
    try {
        dbConnection()
        console.log(`Server is running on port ${config.PORT}`);
    } catch (error) {
        
    }
})