const connection = require('../database/connection')
var fs = require('fs')
var uniqid = require('uniqid')
const md5 = require('md5')
const StaffFunction = require('../functions/staff')
module.exports = {
    async getRoleName(role_id) {
        
    },
    async getAll (req, res, next) {
        try {
            let userJwt = getHeaders(req.headers.authorization)
                               
            const staff = await connection('user')
                                 .select(['user_id',
                                          'email', 
                                          'nickname',
                                          'image',
                                          'activated',
                                          'role.name as role_name'
                                         ])
                                 .join('role', 'user.role_id', '=', 'role.role_id')

            return res.json({ staff: staff })
        } catch (e) {
            res.status(500).send({ code: 404, message: 'Failed to get staff members' });
        }
    },

    async getImage (req, res, next) {
        let userJwt = getHeaders(req.headers.authorization)
        const store_id = req.body.store_id
        try {

            const lounge = await connection('store')
                            .where('store_id', store_id)
                            .select(['image', 'name'])
                            .whereNotNull("image")
                            .groupBy("store_id")
                            .havingNotNull('image')
                            .limit(6)
            return res.json({ lounge })
        } catch (e) {
            res.status(404).send({ code: 404, message: 'Failed to get the image of lounge.' });
        }
    },

    async uploadImage (req, res, next) {
        const {image, store_id} = req.body

        console.log(req.body)
        var store_name = req.body.store_name

        store_name = createSlug(store_name)
        
        
        var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        var nomePasta = store_name;
        
        var dir = 'src/images/lounge/' + nomePasta;

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

        return res.json({ name_file: nameFile, nome_pasta: nomePasta})
    },
    
    async register(request, response) {
        const userJwt = getHeaders(request.headers.authorization)

        const user = await connection('user')
        .where('email', request.body.email)
        .first()

        if (!user) {
            const role = await connection('role')
                                .where('name', request.body.role)
                                .select(['role_id'])
                                .first()

            // try {
                const register = await connection('user').insert({
                                role_id: role.role_id,
                                email: request.body.email,
                                password: md5(request.body.password),
                                name: request.body.name,
                                nickname: request.body.nickname,
                                image: 'default.jpg',
                                activated: true,
                                token: null,
                })
                return response.json({ success: true })
            // } catch (e) {
            //     return response.json({ error: true })
            // }
        } else {
            return response.json({ exist: true })
        }
    },

    async update(request, response) {
        const {name_file, store_id, store_update} = request.body

        // let userJwt = getHeaders(request.headers.authorization)

        try {
            await connection('store')
                            .where('store_id', store_id)
                            .update({
                                description: store_update.description,
                                phone: store_update.phone,
                                zipcode: store_update.address.cep,
                                street: store_update.address.street,
                                number: store_update.address.numero,
                                complement: store_update.address.complement,
                                neighborhood: store_update.address.bairro,
                                city: store_update.address.cidade,
                                state: store_update.address.estado,
                                phone: store_update.phone
                            })
            return response.json({success: true})
        } catch (e) {
            return response.json({error: true})
        }
    },

    async delete(request, response) {
        const staff_id = request.body.staff_id

        const selectStaff = await connection('user')
                                .where('user_id', staff_id)
                                .select('name')
                                .first()

        const delStore = await connection('user')
                                .where('user_id', staff_id)
                                .del()

        if(delStore) {
            return response.json(selectStaff)
        } else {
            return response.json({ error: true })
        }
    }
}