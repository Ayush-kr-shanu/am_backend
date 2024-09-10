const dotenv = require("dotenv");
const path = require("node:path");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  email: {
    SMTP: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    FROM: process.env.EMAIL_FROM,
  },
  // aws credentials
  s3: {
    accessKeyId: process.env.ACESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
  },
  bucketName: process.env.BUCKET_NAME,
  //Jwt credentials
  JWT_SECRET: process.env.JWT_SECRET
};
