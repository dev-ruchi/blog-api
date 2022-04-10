const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  body: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
});

const Post = mongoose.model('Post', schema);

module.exports = Post
