const connection = require('../../database/connection')
const String = require('../../functions/string-prototypes')

var fs = require('fs')
const md5 = require('md5')
var uniqid = require('uniqid');
const { prototype } = require('events');

require("dotenv-safe").config()

module.exports = {
    async register(request, response) {
        const {name, description, price, store_id, category, name_file} = request.body
        
        if (name == "" || description == "") {
            return response.json({ isEmpty: true })
        }

        const register = await connection('product').insert({
            store_id: store_id,
            category_id: category.value,
            name: name,
            description: description,
            price: price,
            image: name_file,
            reviews: 0
        })

        return response.json( true )
    },

    async uploadImage (req, res, next) {
        const {image, store_id} = req.body

        var product_name = req.body.product_name

        product_name = createSlug(product_name)
        
        var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        var nomePasta = store_id + '_' + product_name;
        
        var dir = 'src/images/product/' + nomePasta;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        var nameFile = uniqid() + '.png'

        var fullPath = dir + '/' + nameFile

        fs.writeFile(fullPath, response.data,  
            function(err, data) {
                if (err) {
                    console.log('err', err);
                }
        });

        return res.json({ name_file: nameFile})
    }
}