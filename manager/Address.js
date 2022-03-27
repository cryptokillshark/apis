/**
 * Created by A on 7/18/17.
 */
'use strict';

const knex          = require('../config/postgresdb')

module.exports = {
    get : (req) => {
        return knex('addresses').limit(50)
    },
    getCount: async (req) => {
        return {
            data: {
                wallets: await knex('addresses').count({wallets: '*'}).where('fetched_coin_balance', '>', 0).then(rs => rs[0].wallets),
                tokens: await knex('tokens').count({tokens: '*'}).then(rs => rs[0].tokens),
            }
        }
    },
    getCountBalance: (req) => {
        return knex('addresses').count({wallets: '*'}).where('fetched_coin_balance', '>', 0).then(rs => rs[0])
    },
};

