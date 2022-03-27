
"use strict";
require('dotenv').config()
const Model = require('../model/Collections');
const rq = require("request-promise");
const web3 = require("../utils/Web3");
const ERC721ABI = require("../utils/ERC721ABI.json");
const ERC721NFTMarketABI = require("../utils/ERC721NFTMarketABI.json");
const net = process.env.NET || 'testnet'
const whiteList = require('../utils/whiteListNFTContract.json')[net]

module.exports = {
    get: async (req) => {
        const limit = req.query.limit || 20
        const skip = req.query.skip || 0
        const sort = req.query.sort || 'asc'
        const {collectionAddress} = req.params
        const options = {collectionAddress: web3.utils.toChecksumAddress(collectionAddress).toLowerCase()}
        const data = await Model.find(options).limit(100)
        // console.log(process.env.ERC721NFTMARKETV2)
        const contract = new web3.eth.Contract(ERC721NFTMarketABI, process.env.ERC721NFTMARKET)
        data.map(async (d) => {
            const askDetails = await contract.methods._askDetails(collectionAddress, d.tokenId).call()

            if(askDetails.seller == '0x0000000000000000000000000000000000000000') Model.remove({_id: d._id}).then(console.log)
        })

        if(req.query.star) options.$and = [{'attributes.trait_type': 'Star'}, {'attributes.value': req.query.star}]
        if(req.query.type) options.$and = [{'attributes.trait_type': 'Type'}, {'attributes.value': req.query.type}]
        // console.log(req.query, options)
        return Model.find(options).limit(limit).skip(skip).sort(sort).catch(e => console.log(e.toString()))
    },
    post: async (req) => {
        const {collectionAddress} = req.params
        const {tokenId} = req.payload
        const foundCT = whiteList.find(x => x.name == 'GUN' && x.address.toLowerCase() == collectionAddress.toLowerCase())
        if(!foundCT)  return {statusCode: 400, errorCode: 'NOT_SUPPORT_NFT', message: 'Not support this NFT'}
        const coll = await Model.findOne({tokenId, collectionAddress})
        if(coll) return coll
        const contract = new web3.eth.Contract(ERC721ABI, collectionAddress)
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const tokenInfo = await rq({
            uri: tokenURI,
            json: true
        })
        const model = new Model({...tokenInfo, tokenId, collectionAddress: collectionAddress.toLowerCase()})
        return model.save()
    },
    delete: async (req) => {
        const {collectionAddress, tokenId} = req.params
        const foundCT = whiteList.find(x => x.name == 'GUN' && x.address.toLowerCase() == collectionAddress.toLowerCase())
        if(!foundCT) return {statusCode: 400, errorCode: 'NOT_SUPPORT_NFT', message: 'Not support this NFT'}
        const coll = await Model.findOne({tokenId, collectionAddress})
        if(!coll) return 1
        const contract = new web3.eth.Contract(ERC721NFTMarketABI, process.env.ERC721NFTMARKET)
        const _askDetails = await contract.methods._askDetails(collectionAddress, tokenId).call();
        if(_askDetails.seller.toLowerCase() != '0x0000000000000000000000000000000000000000') return {statusCode: 400, errorCode: 'TOKEN_ON_SALE', message: 'Token on sale'}
        return  Model.remove({tokenId, collectionAddress})
    },
    getById: (req) => {
        return Model.findOne({_id: req.params.id})
    }
}

