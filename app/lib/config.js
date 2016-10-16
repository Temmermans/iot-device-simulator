module.exports = {
  credentials: {
    mongodb: {
      url: process.env.MONGODB_URI || "mongodb://127.0.0.1/test"
    }
  },
  settings: {

  }
};
