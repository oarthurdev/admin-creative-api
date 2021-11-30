const connection = require('../database/connection')
const { json } = require('body-parser')

module.exports = {
    getRoleName : (res, role_id) => {
        const role_name =  connection('role')
                        .select(['role_id', 
                                'name',
                                ])
                        .where('role_id', role_id)
                        .first()

        return json(role_name)
    }
}