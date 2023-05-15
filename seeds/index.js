const mongoose = require('mongoose');
const Campground = require('../models/campground')

const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
})
.catch(err => {
    console.log("error")
    console.log(err)
})


const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '644aa57e6954d91578ace8f1',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora ab magnam ad fuga, illum quibusdam vero accusantium assumenda fugit, hic temporibus expedita asperiores eveniet quia maxime nobis perspiciatis cumque eum.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dkdcjy1wy/image/upload/v1683653287/YelpCamp/sukzwtrokobpnmt1paob.jpg',
                  filename: 'YelpCamp/sukzwtrokobpnmt1paob'
                },
                {
                  url: 'https://res.cloudinary.com/dkdcjy1wy/image/upload/v1683145048/YelpCamp/myo9r4x05quf99gs7qt4.jpg',
                  filename: 'YelpCamp/myo9r4x05quf99gs7qt4'
                }
              ]
        })
        await camp.save();
    }
}

seedDB();