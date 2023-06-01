const BrandService = require('../services/BrandService')

class BrandController{
    async getBrands(req, res, next){
        try{
            const data = await BrandService.getBrands()
            return res.json(data)
        }catch(err){
            next(err)
        }
    }
}

module.exports = new BrandController()