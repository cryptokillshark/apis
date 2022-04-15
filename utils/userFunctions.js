/**
 * Created by A on 7/18/17.
 */
'use strict';

const Model = require('../model/User');
const web3 = require("../utils/Web3");
const Boom = require('boom');

const verifySignature = (signature, address, nonce) => {
    const msg = `${process.env.SIGN_MGS} ${nonce}`;

    const addressRecover = web3.eth.accounts.recover(msg, signature)

    if (addressRecover.toLowerCase() !== address.toLowerCase()) return 'Signature verification failed'
    return 1
}
const verifyCredentials = (req, res) => {
    const { signature, address } = req.payload;

    return Model.findOne({ address }).then(user => {
        if (user) {
            const verify = verifySignature(signature, address, user.nonce)

            if(verify != 1) res(Boom.badRequest(verify))
            res({user: {...user._doc, user: 1}})
        }
        res(Boom.badRequest('address not existed'))

    });
}

module.exports = {
    verifyCredentials
}