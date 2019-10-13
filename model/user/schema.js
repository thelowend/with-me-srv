const mongoose = require('mongoose')
const Schema = mongoose.Schema
const feedSchema = require('../feed/schema')
const historySchema = require('../history/schema')

const userSchema = new Schema({
  tenant: { type: String, select: false },
  client_id: { type: String, select: false },
  connection: { type: String, select: false },
  email: { type: String, required: true },
  email_verified: { type: Boolean, select: false },
  password: { type: String, required: true, select: false },
  request_language: { type: String, select: false },
  user_metadata: {
    age: { type: Number, required: true },
    age_category: { type: String, required: true },
    name: { type: String, required: false },
    role: { type: String, required: true },
    contact_number: { type: String, required: true },
    threshold: { type: Number },
    fb_id: { type: String },
    fb_sync: Boolean,
    tw_id: { type: String },
    tw_sync: Boolean,
    ig_id: { type: String },
    ig_sync: Boolean,
    profile_complete: Boolean
  },
  feed: { type: [feedSchema], select: false },
  history: { type: [historySchema], select: false },
})

module.exports = userSchema
