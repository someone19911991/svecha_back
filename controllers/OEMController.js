const OEMService = require('../services/OEMService')
const ReferenceService = require("../services/ReferenceService");

class OEMController {
    async updateOEM(req, res, next) {
        try {
            const { oem_id } = req.params
            await OEMService.updateOEM({oem_id, ...req.body})
            return res.json({message: "OEM successfully updated"})
        } catch (err) {
            next(err)
        }
    }

    async deleteOEM(req, res, next){
        try{
            const {oem_id} = req.params
            await OEMService.deleteOEM(oem_id)
            return res.json({message: "OEM successfully deleted"})
        }catch(err){
            next(err)
        }
    }
}

module.exports = new OEMController()
