const TopSellersService = require('../services/TopSellersService')

class TopSellersController{
    async checkIdentity(req, res, next){
        try{
            const {svechaUserIdentityCookie} = req.cookies
            let cookie = svechaUserIdentityCookie || ''
            let {ls, product_id} = req.body

            const result = await TopSellersService.checkIdentity({cookie, ls, product_id})

            if(result.cookie){
                res.cookie('svechaUserIdentityCookie', result.cookie, {
                    maxAge: 2147483647000,
                    httpOnly: true,
                    secure: true,
                })
            }


            return res.json({ls: result.ls})
        }catch(err){
            next(err)
        }
    }
}

module.exports = new TopSellersController()