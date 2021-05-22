const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Service schema in DB
 */
const ServiceSchema = new Schema({
  _id: {
    type: String,
  },
  company: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  needsFullAccess: {
    type: Boolean,
    required: true,
  },
  accessReason: {
    type: String,
    required: true,
  },
  usesExternalService: {
    type: Boolean,
    required: true,
  },
  externalServiceName: {
    type: String,
    required: true,
  },
  externalServiceReason: {
    type: String,
    required: true,
  },
});

module.exports = Service = mongoose.model("service", ServiceSchema)