const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Block schema in DB
 */
const BlockSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  prevHash: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
  data: {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    bloom: {
      type: String,
      required: true,
    }
  },
  hash: {
    type: String,
    required: true,
  }
});

module.exports = Block = mongoose.model("block", BlockSchema);
