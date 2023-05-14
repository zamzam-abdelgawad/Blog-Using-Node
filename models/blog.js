const mongoose = require('mongoose');

const blogSchema =mongoose.Schema({
  title: {
    type: String,
    // required: true
  },
  body: {
    type: String,
    // required: true
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  tags: {
    type : Array,
        default:[]
  }, CreatedDate: {
    type: Date,
    default: Date.now,
  
}},
{
  strict:false,
  versionKey:false
});

const blog = mongoose.model('blog', blogSchema);

module.exports = blog;

