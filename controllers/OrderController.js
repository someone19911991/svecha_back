const OrderService = require('../services/OrderService')

class OrderController{
    async orderProduct(req, res, next){
        try{
            const result = await OrderService.orderProduct(req.body)
            return res.json({result})
        }catch(err){
            next(err)
        }
    }
    async onOrder(req, res, next){
        try{
            await OrderService.onOrder(req.body)
            return res.json({message: 'Order placed successfully'})
        }catch(err){
            next(err)
        }
    }

    async getNotifications(req, res, next){
        try{
            const {status} = req.params
            let result = await OrderService.getNotifications(status)
            return res.json(result)
        }catch(err){
            next(err)
        }
    }

    async getMessages(req, res, next){
        try{
            const {status} = req.params
            let result = await OrderService.getMessages(status)
            return res.json(result)
        }catch(err){
            next(err)
        }
    }

    async markAsSold(req, res, next){
        try{
            await OrderService.markAsSold(req.body)
            return res.json({message: "Marked as sold"})
        }catch(err){
            next(err)
        }
    }

    async markAsAccepted(req, res, next){
        try{
            await OrderService.markAsAccepted(req.body)
            return res.json({message: "Marked as sold"})
        }catch(err){
            next(err)
        }
    }

    async getAnalytic(req, res, next){
        try{
            const result = await OrderService.getAnalytic(req.body)
            return res.json(result)
        }catch(err){
            next(err)
        }
    }
}

module.exports = new OrderController()