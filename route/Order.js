const Joi                       = require('joi');
const Manager                   = require('../manager/Order');
const Response                  = require('./response').setup(Manager);

module.exports = {
    get: {
        tags: ['api', 'Orders'],
        description: 'User get orders',
        handler: (req, res) => {
            Response(req, res, 'get');
        },
        auth: {
            strategy: 'jwt'
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            query: Joi.object({
                status: Joi.string().valid('pending', 'opening', 'claimed'),
            })
        }
    },
    post: {
        tags: ['api', 'Orders'],
        description: 'User Buy GUN',
        handler: (req, res) => {
            Response(req, res, 'post');
        },
        auth: {
            strategy: 'jwt'
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            payload: Joi.object({
                n: Joi.number().min(1).required(),
            })
        }
    },
}