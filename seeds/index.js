const mongoose = require("mongoose");
const axios = require("axios");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "q2YYkmVHCtz1EXNbM786cLvBN4tYGBJicDaFi8WqnhY",
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const camp = new Campground({
      location: `${sample(cities).city}, ${sample(cities).state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      price: Math.floor(Math.random() * 100) + 10,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
