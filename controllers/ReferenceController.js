const ReferenceService = require('../services/ReferenceService')

class ReferenceController{
    async updateReference(req, res, next){
        try{
            const {ref_id} = req.params
            await ReferenceService.updateReference({...req.body, ref_id})
            return res.json({message: "Reference successfully updated"})
        }catch(err){
            next(err)
        }
    }
    async deleteReference(req, res, next){
        try{
            const {ref_id} = req.params
            await ReferenceService.deleteReference(ref_id)
            return res.json({message: "Reference successfully deleted"})
        }catch(err){
            next(err)
        }
    }
}

module.exports = new ReferenceController()