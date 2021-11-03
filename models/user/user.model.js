const mongoose = require("mongoose");
const validator = require('validator').default;
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../../config');
const { userRoles } = require('../../config/role')
const { hashPassword, validatePassword } = require('../../utils/helpers');

const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        index: true,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        index: true,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain password word')
            }
        }
    },
    cni: {
        type: String,
        index: true,
    },
    role: {
        type: String,
        index: true,
        enum: [userRoles.SEEKER, userRoles.PHUSER, userRoles.DHUSER, userRoles.ADMIN],
        default: userRoles.SEEKER,
    },
    address: [{
        region: {
            type: String,
            index: true,
        },
        department: {
            type: String,
            index: true,
        },
        city: {
            type: String,
            index: true,
        },

    }],
    dhHub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DhHub"
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
        index: true,
        default: "Male",
        validate(value) {
            if (!(value.toLowerCase() == "male" || value.toLowerCase() == "female")) {
                throw new Error("Gender should be Male or Female")
            }
        }
    },
    isFirstConnection: {
        type: Boolean,
        index: true,
        default: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    hasAccess: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    localisation: String,
    birthday: Date,
    matricule: String,
    created_at: {
        type: Date,
        default: Date
    },
    updated_at: {
        type: Date,
        default: Date
    },
})

userSchema.statics.findByCredentials = async(phone, email, password) => {
    const user = await User.findOne({ $or: [{ email: email }, { phone: phone }] })
    if (!user) {
        throw new Error('Invalid user information')
    }
    const isMatch = await validatePassword(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid passwword')
    }
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, jwtSecretKey, { expiresIn: '24d' })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.userProfile = function() {
    const { tokens, __v, ...user } = this._doc;
    return user;
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await hashPassword(user.password)
    }
    next()
})


const User = mongoose.model("User", userSchema);

module.exports = User;