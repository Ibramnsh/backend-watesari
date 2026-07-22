const mongoose = require('mongoose');

const beritaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  kategori: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Berita', beritaSchema);
