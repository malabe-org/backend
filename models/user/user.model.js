const mongoose = require("mongoose");
const validator = require('validator').default;
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
    gender: {
        type: String,
        enum: ["M", "Mme"],
        required: true,
        index: true,
        default: "M",
        validate(value) {
            if (!(value.toLowerCase() == "m" || value.toLowerCase() == "mme")) {
                throw new Error("Gender should be M or Mme")
            }
        }
    },
    isFirstConnection: {
        type: Boolean,
        index: true,
        default: true
    },
    hasAccess: {
        type: Boolean,
        default: false
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

userSchema.statics.findByCredentials = async(phone, password) => {
    const user = await User.findOne({ phone: phone })
    if (!user) {
        throw new Error('Invalid phone number')
    }
    const isMatch = await validatePassword(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid passwword')
    }
    return user
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