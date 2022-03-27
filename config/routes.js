/**
 * Created by A on 7/18/17.
 */
'use strict';
const Pac = require('../package.json');
// const Address = require('../route/Addresses');
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
    // { method: 'GET', path: '/txs-daily-count', config : Transactions.getDailyCount },
    //
    // { method: 'GET', path: '/addresses', config : Address.get },
    // { method: 'GET', path: '/addresses-count', config : Address.getCount },
    // { method: 'GET', path: '/addresses-count-balance', config : Address.getCountBalance },
    // { method: 'GET', path: '/master-node', config : MasterNode.get },
    // { method: 'GET', path: '/eth-balance/{address}', config : MasterNode.getBalance }
];
