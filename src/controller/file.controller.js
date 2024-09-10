const fs = require("node:fs");
const path = require("node:path");
const { s3, bucketName } = require("../config/aws-s3");
const { File } = require("../model");
const httpStatus = require("http-status");

async function uploadFile(request, response) {
  const { userId, folder } = request.body; // Add folder to request body
  const file = request.file;

  if (!file) {
    return response.status(httpStatus.BAD_REQUEST).send({ message: "No file uploaded" });
  }

  const filePath = file.path;
  const fileName = path.basename(filePath);
  const fileSize = file.size;

  // Validate folder input to prevent unauthorized folder access
  const validFolders = ['profile-pic', 'video'];
  if (!validFolders.includes(folder)) {
    return response.status(httpStatus.BAD_REQUEST).send({ message: "Invalid folder" });
  }

  try {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on("error", (error) => {
      throw new Error(error);
    });

    const uploadParameters = {
      Bucket: bucketName,
      Key: `${folder}/${fileName}`, // Use the folder parameter here
      Body: fileStream,
    };

    const uploadResult = await s3.upload(uploadParameters).promise();

    const newFile = await File.create({
      fileName,
      fileSize,
      filePath: uploadResult.Location,
      userId,
    });

    fs.unlink(filePath, (error) => {
      if (error) throw error;
    });

    return response.status(httpStatus.OK).send({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    return response.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "File upload failed",
      error: error.message,
    });
  }
}

function getFile(folderName, fileName, isRoute) {
    // Construct the full key by combining folder name and file name
    const keyName = `${folderName}/${fileName}`;
  
    const parameters = {
      Bucket: bucketName,
      Key: keyName,
    };

    return new Promise((resolve, reject) => {
      s3.getObject(parameters, function (error, data) {
        if (error) {
          // Log error or handle as needed
          console.error("Error fetching file", error);
          resolve(null);
        } else {
          if (isRoute) {
            // Generate a signed URL for accessing the file
            const s3url = s3.getSignedUrl('getObject', parameters);
            resolve(s3url);
          } else {
            // Return the file content as base64
            resolve(data.Body.toString("base64"));
          }
        }
      });
    });
}

module.exports = {
  uploadFile,
  getFile
};
