const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  keywords: {
    type: String, // Comma separated SEO keywords
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    name: String,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  originalTitle: String,
  originalDescription: String,
  category: {
    type: String,
    default: 'technology',
  },
}, { timestamps: true });

module.exports = mongoose.model('News', NewsSchema);
