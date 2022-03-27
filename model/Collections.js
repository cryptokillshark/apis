 'use strict';

 const mongoose  = require('mongoose');
 const Schema    = mongoose.Schema;
 const moment = require('moment')

 const schema = new Schema({
     tokenId: Number,
     collectionAddress: String,
     name: String,
     description: String,
     image: String,
     image2: String,
     image3: String,
     image4: String,
     rarity: Number,
     bg_color: String,
     collector: String,
     percent: Number,
     attributes: {},
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
 schema.index({ tokenId: 1, collectionAddress: 1 }, { unique: true });
 schema.index({ rarity: 1 });
 module.exports = mongoose.model('collection', schema);