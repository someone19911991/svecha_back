const db = require('../db')

class ClientsCountController {
    async getClientsCount(req, res){
        let clients_count = await db.query(`SELECT count FROM clients_count WHERE id = 1`)
        if(clients_count?.[0]?.[0]){
            return res.json(clients_count?.[0]?.[0].count)
        }
    }
}

module.exports = new ClientsCountController()