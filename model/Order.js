 'use strict';

 const mongoose  = require('mongoose');
 const Schema    = mongoose.Schema;
 const moment = require('moment')

 const schema = new Schema({
     buyer: String,
     numOfOrder: Number,
     status: {type: String, detail: 'pending'},
     guns: [],
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
 schema.index({ buyer: 1 });
 module.exports = mongoose.model('order', schema);