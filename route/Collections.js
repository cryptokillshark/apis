const Joi                       = require('joi');
const Manager                   = require('../manager/Collections');
const Response                  = require('./response').setup(Manager);

module.exports = {
    get: {
        tags: ['api', 'Collection'],
        description: 'Get Collections',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        validate: {
            params: Joi.object({
                collectionAddress: Joi.string().required(),
            }),
            query: Joi.object({
                rarity: Joi.number(),
                star: Joi.number(),
                // level: Joi.string(),
                // date: Joi.string(),
                // fromDatetime: Joi.string(),
                // toDatetime: Joi.string(),
                limit: Joi.number().default(20),
                skip: Joi.number().default(0),
                sort: Joi.string().valid('desc', 'asc').default('desc'),
            })
        }
    },
    post: {
        tags: ['api', 'Collection'],
        description: 'Post Collection',
        handler: (req, res) => {
            return Response(req, res, 'post');
        },
        validate: {
            payload: Joi.object({
                tokenId: Joi.number().min(1).required(),
            })
        }
    },
    delete: {
        tags: ['api', 'Collection'],
        description: 'Delete Collection',
        handler: (req, res) => {
            return Response(req, res, 'delete');
        }
    }
}