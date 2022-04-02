
"use strict";
require('dotenv').config()
const Model = require('../model/Order');
const web3 = require('../utils/Web3')
const Logger    = require('../utils/logging');

module.exports = {
    get: (req) => {
        const option = {}
        if(req.query.status) option.status = req.query.status
        return Model.find(option)
    },
    post: async (req) => {
        const order = await Model.findOne({buyer: req.auth.credentials.user.address.toLowerCase(), status: 'pending'})
        if(order) return Promise.reject({statusCode: 400, message: 'Order is pending', data: order})
        const model = new Model({
            buyer: req.auth.credentials.user.address.toLowerCase(),
            numOfOrder: req.payload.n,
        })
        return model.save()

    },
}


