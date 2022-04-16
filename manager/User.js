
"use strict";
require('dotenv').config()
const Model = require('../model/User');
const web3 = require('../utils/Web3')
const createToken = require("../utils/token");
const Logger    = require('../utils/logging');

const sign = async () => {
    const account = '0x2076A228E6eB670fd1C604DE574d555476520DB7'
    const oldUser = await Model.findOne({address: account})
    const msg = `${process.env.SIGN_MGS} ${oldUser.nonce}`;
    const signature = web3.eth.accounts.sign(msg, process.env.PKEY)
    Logger.info(process.env.PKEY, signature)
}
// sign()
module.exports = {
    getTopRefer: (req) => {
        const limit = req.query.limit || 100
        return Model.find({refered: {$gt: 0}}, {signature: 0}).sort({refered: -1}).limit(limit)
    },
    getMe: (req) => {
        return Promise.all([
            Model.findOne({_id: req.auth.credentials.user._id}),
            Model.count({referBy: req.auth.credentials.user._id})
        ]).then(rs => {
            // console.log(rs)
            return {
                ...rs[0],
                referred: rs[1]
            }
        })
    },
    getNonce: (req) => {
        return Model.findOne({address: req.query.address}, {nonce: 1}).then(user => {
            if(!user) return Promise.reject({statusCode: 400, message: 'Address not existed'})
            return user
        })
    },
    post: async (req) => {
        if(!web3.utils.isAddress(req.payload.address)) return Promise.reject({statusCode: 400, message: 'Invalid Address'})
        try {
            const msg = `${process.env.SIGN_MGS} ${req.payload.nonce}`;

            const address = web3.eth.accounts.recover(msg, req.payload.signature)

            // console.log(address)
            if (address.toLowerCase() !== req.payload.address.toLowerCase()) return Promise.reject({statusCode: 400, errorCode: 'SIGNATURE_VERIFY_FAILED', message: 'Signature verification failed'})
            const oldUser = await Model.findOne({address: req.payload.address}, {signature: 0})
            // console.log(oldUser)
            if(oldUser) {
                oldUser.nonce = Math.floor(Math.random() * 1000000)
                return oldUser.save().then(() => {
                    const u = oldUser._doc ? oldUser._doc : oldUser
                    return {
                        token: createToken({user: {...u, user: 1}}),
                        user: oldUser
                    }
                })
            }
            const user = new Model({...req.payload})
            return user.save().then(async newUser => {
                if(req.payload.referBy != '') {
                    const parent = await Model.findOne({_id: req.payload.referBy}, {signature: 0})
                    if(parent) await Model.findOneAndUpdate({_id: req.payload.referBy}, {$set: {refered: parent.refered + 1}})
                }
                return {
                    token: createToken({user: {...req.payload, _id: newUser._id, user: 1}}),
                    user
                }
            }).catch(console.log)

        } catch (e) {
            return Promise.reject({statusCode: 400, message: e.toString()})
        }

    },
}


