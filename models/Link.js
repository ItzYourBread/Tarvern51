const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    directUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['OF-Models', 'Leaks-Vids', 'Amateur', 'NSFW'],
      default: 'NSFW',
      trim: true
    }
  },
  { timestamps: true }
);

LinkSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('Link', LinkSchema);

