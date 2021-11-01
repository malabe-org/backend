const bcrypt = require("bcrypt");

exports.hashPassword = async(password) => {
    return await bcrypt.hash(password, 10);
};

exports.validatePassword = async(plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.getOneElement = async(userArray) => {
    const list = [...userArray]
    return list[Math.floor(Math.random() * list.length)];
}