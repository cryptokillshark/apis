/**
 * Created by A on 7/18/17.
 */
'use strict';
const Manager                   = require('../manager/Address');
// const Joi                       = require('joi');
const Response                  = require('./response').setup(Manager);

module.exports = {
    get : {
        tags: ['api', 'Addresses'],
        description: 'get Addresses',
        handler: (req, res) => {
            Response(req, res, 'get');
        }
    },
    getCount : {
        tags: ['api', 'Addresses'],
        description: 'get count Addresses',
        handler: (req, res) => {
            Response(req, res, 'getCount');
        }
    },
    getCountBalance : {
        tags: ['api', 'Addresses'],
        description: 'get count Addresses have balance greathan 0',
        handler: (req, res) => {
            Response(req, res, 'getCountBalance');
        }
    }
}