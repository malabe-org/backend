require("dotenv").config({
    path: require("path").resolve(__dirname, "./.env"),
});
module.exports = {
    port: process.env.PORT || 3001,
    mongoUrl: process.env.MONGODB_URL
};