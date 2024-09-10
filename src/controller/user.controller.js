const httpStatus = require("http-status");
const { User } = require("../model");
const { generateRandomPassword } = require("../utils/password");
const { credentialEmail } = require("../utils/email");
const { generateAuthTokens } = require("../middlewares/auth");
const { uploadFileFun, getFile } = require("./file.controller");

const signup = async (request, response) => {
  try {
    const { firstName, lastName, email, phone } = request.body;
    if (!firstName || !lastName || !email || !phone) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response
        .status(httpStatus.CONFLICT)
        .send({ message: "Email already exists" });
    }

    const userExistsPhone = await User.findOne({ phone });
    if (userExistsPhone) {
      return response
        .status(httpStatus.CONFLICT)
        .send({ message: "Phone number already exists" });
    }

    const password = generateRandomPassword(firstName, lastName, phone);

    const newUser = new User({ firstName, lastName, email, phone, password });
    await newUser.save();

    // Send email with the generated password
    await credentialEmail(email, firstName, lastName, phone, password);

    response
      .status(httpStatus.CREATED)
      .send({ message: "User created successfully" });
  } catch (error) {
    response.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const login = async (request, response) => {
  try {
    const { firstName, password } = request.body;
    if (!firstName || !password) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ firstName });
    if (!user || !user.validatePassword(password)) {
      return response
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Invalid first name or password" });
    }
    let profilePic
    if(user.profilePicture){
        profilePic = await getFile("profile-pic", user.profilePicture, true)
    }

    const { access, refresh } = await generateAuthTokens(user);
    response.send({ access, refresh, user, profilePic});
  } catch (error) {
    response.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error });
  }
};

const updateUserDetail = async (request, response) => {
  try {
    const { firstName, lastName, email, phone, bio, profilePicture } = request.body;
    const userId = request.params.id;

    if (request.user.id !== userId) {
      return response
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized to update this user" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phone, bio, profilePicture },
      { new: true }
    );

    if (!user) {
      return response
        .status(httpStatus.NOT_FOUND)
        .send({ message: "User not found" });
    }

    response.send(user);
  } catch (error) {
    response.status(httpStatus.BAD_REQUEST).send({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  updateUserDetail,
};
