const {verifyCredentials }       = require('../utils/userFunctions');
const createToken               = require('../utils/token');
const Joi                       = require('joi');
const Manager                   = require('../manager/User');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getNonce: {
        tags: ['api', 'General'],
        description: 'Get nonce from user\'s address',
        handler: (req, res) => {
            Response(req, res, 'getNonce');
        },
        validate: {
            query: Joi.object({
                address: Joi.string().required(),
            })
        }
    },
    post: {
        tags: ['api', 'User'],
        description: 'User Register',
        handler: (req, res) => {
            Response(req, res, 'post');
        },
        validate: {
            payload: Joi.object({
                signature: Joi.string().required(),
                address: Joi.string().required(),
                nonce: Joi.string().required(),
                referBy: Joi.string().required(),
            })
        }
    },
    postAuthenticate: {
        tags: ['api', 'User'],
        description: 'Authenticate',
        pre: [
            { method: verifyCredentials, assign: 'user' }
        ],
        handler: (req, res) => {
            if(req.pre.user.statusCode) return res.response(req.pre.user).code(req.pre.user.statusCode);
            return res.response({ token: createToken(req.pre.user), user: req.pre.user.user }).code(200);
        },
        validate: {
            payload: Joi.object({
                signature: Joi.string().required(),
                address: Joi.string().required(),
            })
        }
    }
}