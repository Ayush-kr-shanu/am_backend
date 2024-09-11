# am_backend

# Backend API

## Overview

This backend API is built with Node.js and Express, designed to handle various functionalities required by your application. It provides endpoints for user authentication, CRUD operations, file management, and more.

## Features

- **User Authentication**: Secure login and registration.
- **CRUD Operations**: Manage resources like posts, users, etc.
- **File Management**: Upload and retrieve files.

## Technologies

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB, providing schema and validation.
- **AWS S3**: Cloud storage for file uploads (if applicable).
- **PM2**: Process manager for Node.js applications.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-backend-repo.git
   cd your-backend-repo
   ```

2. **Install the dependencies:**
   
   ```bash
   npm install
   ```

3. **Enviroment Variables:**
    PORT  = Any port
    MONGODB_URI = your mongo url

    # Token secret
    JWT_SECRET = Your secret key


    # Mail jet secrets
    SMTP_HOST=email host
    SMTP_PORT= email port
    SMTP_USERNAME= email username
    SMTP_PASSWORD= password or secretkey
    EMAIL_FROM= sender email


    # s3 keys
    ACESS_KEY = your s3 acess key
    SECRET_KEY = your s3 secret key
    REGION = aws region
    BUCKET_NAME = bucket name

4. **To start the server:**
    Command: 
    ```bash
     npm run dev
   ```