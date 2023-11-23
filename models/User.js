const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  username: {
    type: String,
    required: [true, "Please provide your username"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  },
  address: {
    street: {
      type: String,
    },
    suite: {
      type: String,
    },
    city: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    geo: {
      lat: {
        type: String,
      },
      lng: {
        type: String,
      },
    },
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  company: {
    name: {
      type: String,
    },
    catchPhrase: {
      type: String,
    },
    bs: {
      type: String,
    },
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
