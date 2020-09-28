const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
});

SnippetSchema.index({ "description": "text" });

module.exports = Snippet = mongoose.model('snippet', SnippetSchema);
