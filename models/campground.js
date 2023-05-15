const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


// https://res.cloudinary.com/dkdcjy1wy/image/upload/v1683145136/YelpCamp/sccfzxmq3rjpff8wqmvq.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() { // A virtual is a property that is not stored in MongoDB, in this case that property is 'thumbnail'
    return this.url.replace('/upload', '/upload/w_200/') // Set the thumbnail width to 200px
})

const options = { toJSON: {virtuals: true} }; // Allows virtuals to show up as properties in our schema

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema], // Used to be a String, changed to array because we might want multiple images
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'geometry.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, options);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() { // 'properties' now shows because we added 'options' to 'CampgroundSchema'
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);

