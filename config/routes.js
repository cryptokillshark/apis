/**
 * Created by A on 7/18/17.
 */
'use strict';
const Pac = require('../package.json');
const Collections = require('../route/Collections');
const User = require('../route/User');

module.exports = [
    { method: 'GET',
        path: '/',
        config : {
            tags: ['api', 'Home'],
            description: 'access home',
            handler: (req, res) => {
                res('Welcome to '+Pac.name+' !!!').code(200);
            },
        },
    },
    { method: 'GET', path: '/user-nonce', config : User.getNonce},
    { method: 'POST', path: '/users', config : User.post},
    { method: 'POST', path: '/user/authenticate', config : User.postAuthenticate},

    { method: 'POST', path: '/collections/{collectionAddress}', config : Collections.post},
    { method: 'DELETE', path: '/collections/{collectionAddress}/{tokenId}', config : Collections.delete},
    { method: 'GET', path: '/collections/{collectionAddress}', config : Collections.get},
];
