const httpStatus = require("http-status");
const { User } = require("../model");
const { generateRandomPassword } = require("../utils/password");
const { credentialEmail } = require("../utils/email");

const signup = async (request, response) => {
    try {
        const { firstName, lastName, email, phone } = request.body
        if (!firstName ||!lastName ||!email ||!phone) {
            return response.status(httpStatus.BAD_REQUEST).send({ message: "All fields are required" })
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return response.status(httpStatus.CONFLICT).send({ message: "Email already exists" })
        }

        const userExistsPhone = await User.findOne({ phone })
        if (userExistsPhone) {
            return response.status(httpStatus.CONFLICT).send({ message: "Phone number already exists" })
        }

        const password = generateRandomPassword(firstName, lastName, phone)

        const newUser = new User({ firstName, lastName, email, phone, password })
        await newUser.save()

        // Send email with the generated password
        await credentialEmail(email, firstName, lastName, phone, password)

        response.status(httpStatus.CREATED).send({ message: "User created successfully" })
    } catch (error) {
        response.status(httpStatus.BAD_REQUEST).json({ message: error.message })
    }
}

const login = async (request, response) => {
    try {
        const { firstName, password } = request.body
        if (!firstName ||!password) {
            return response.status(httpStatus.BAD_REQUEST).send({ message: "Email and password are required" })
        }

        const user = await User.findOne({ firstName })
        if (!user ||!user.validatePassword(password)) {
            return response.status(httpStatus.UNAUTHORIZED).send({ message: "Invalid email or password" })
        }

        response.send({ message: "Logged in successfully" })
    } catch (error) {
        response.status(httpStatus.BAD_REQUEST).send({ message: error.message })
    }
}

module.exports = {
    signup,
    login
}