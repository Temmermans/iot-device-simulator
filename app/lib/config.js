module.exports = {
  credentials: {
    mongodb: {
      url: process.env.MONGODB_URI || "mongodb://127.0.0.1/test"
    },
    redis: {
      url: process.env.REDISTOGO_URL || 'redis://127.0.0.1:6379'
    }
  },
  settings: {

  }
};
