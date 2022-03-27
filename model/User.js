 'use strict';

 const mongoose  = require('mongoose');
 const Schema    = mongoose.Schema;
 const moment = require('moment')

 const schema = new Schema({
     address: String,
     nonce: {
         type: String,
         default: Math.floor(Math.random() * 1000000) // Initialize with a random nonce
     },
     role: {type: String, default: 'user'},
     status: {type: String, default: 'success'},
     updatedAt: String,
     updatedBy: String,
     createdAt: String,
 });

 schema.pre("save", function (next) {
     const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
     if (!this.createdAt) {
         this.createdAt = now;
     }
     next();
 });
 schema.pre("updateOne", function (next) {
     this.updatedBy = moment.utc().format('YYYY-MM-DD HH:mm:ss');
     next();
 });
 schema.index({ address: 1 }, { unique: true });
 schema.index({ username: 1 });
 module.exports = mongoose.model('user', schema);