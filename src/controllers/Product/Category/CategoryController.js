const connection = require('../../../database/connection')
const md5 = require('md5')

require("dotenv-safe").config()
const jwt = require('jsonwebtoken')

module.exports = {
    async getCategory (req, res, next) {
        var categoryReturn = []

        try {
            const category = await connection('category')
            .select('name')

            category.forEach(element => {
                categoryReturn.push(element.name)
            })

            return res.json(categoryReturn)
        } catch (e) {
            res.status(500).send({code: 500, message: 'Failed to get category.' });
        }
    }
}