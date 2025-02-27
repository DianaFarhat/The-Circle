const mongoose =require ("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
