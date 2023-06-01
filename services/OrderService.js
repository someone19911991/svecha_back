const ApiError = require('../exceptions/ApiError')
const db = require('../db')

class OrderService{
    async orderProduct(data){
        try{
            let product_ids = ''
            const ordersToAdd = []
            const {phone, order} = data
            order.forEach(productItem => {
                const {product_id, product_type, count} = productItem
                product_ids += `${product_id}, `
                ordersToAdd.push([product_id, product_type, count])
            })
            product_ids = product_ids.slice(0, -2)
            const sql = `SELECT * FROM products WHERE product_id IN (${product_ids})`
            const result = await db.promise().query(sql)
            let finalPrice = 0
            const updateSqls = []
            if(result[0].length){
                result[0].forEach(productItem => {
                    // console.log({productItem})
                    // return true
                    order.forEach(async(orderedProduct, index) => {
                        if(orderedProduct.product_id === productItem.product_id){
                            const productType = orderedProduct.product_type
                            let productPrice = productItem[productType === 'original' ? 'price_original' : 'price_copy'] * orderedProduct.count
                            if(productItem.discount){
                                const priceToSubtract = parseInt(productItem.discount / 100 * productPrice)
                                productPrice -= priceToSubtract
                            }
                            ordersToAdd[index] = [...ordersToAdd[index], phone, productItem.category_name, productItem[productType === 'original' ? 'price_original' : 'price_copy'], productItem.discount, productPrice]
                            finalPrice += productPrice
                            const sql = `UPDATE products SET ${productType === 'original' ? 'count_original' : 'count_copy'} = ${productItem[productType === 'original' ? 'count_original' : 'count_copy'] - orderedProduct.count} WHERE product_id = ${productItem.product_id}`
                            updateSqls.push(await db.promise().query(sql))
                        }
                    })
                })
            }

            await Promise.all(updateSqls)
            await db.promise().query(`INSERT INTO ordered_products(product_id, product_type, count, phone, category, product_price, discount, sum) VALUES ?`, [ordersToAdd])

            return finalPrice
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }
    async onOrder(data){
        const {name, phone, message} = data
        try{
            let sql = `INSERT INTO onorder(name, phone, message) VALUES("${name}", "${phone}", "${message}")`
            await db.promise().query(sql)
            return true
        }catch(err){
            console.log(err)
            throw ApiError.ServerError(err.message)
        }
    }

    async getNotifications(status){
        try{
            let sql = `SELECT COUNT(phone) as phone_count, phone from ordered_products WHERE status = "${status}" GROUP BY(phone)`
            let phoneCount = await db.promise().query(sql)
            phoneCount = phoneCount[0]
            sql = `SELECT o.product_id, o.product_type, o.count, o.phone, o.product_price, o.discount, o.sum, o.status, o.created_at, p.model from ordered_products as o INNER JOIN products as p ON o.product_id = p.product_id WHERE status = "${status}"`
            let orderedProducts = await db.promise().query(sql)
            orderedProducts = orderedProducts[0]
            return {orderedProducts, phoneCount}
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }

    async getMessages(status){
        try{
            let sql = `SELECT * FROM onorder WHERE status = "${status}"`
            let result = await db.promise().query(sql)
            return result[0]
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }

    async markAsSold(data){
        const {status, items} = data
        try{
            let soldItemsPhones = items.reduce((acc, item) => {
                acc += `"${item}", `
                return acc
            }, "(")
            soldItemsPhones = soldItemsPhones.slice(0, -2)
            soldItemsPhones += ")"
            let sql = ''
            if(status === 'pending'){
                sql = `UPDATE ordered_products SET status = "sold" WHERE phone IN ${soldItemsPhones}`
            }else{
                sql = `DELETE FROM ordered_products WHERE phone IN ${soldItemsPhones}`
            }

            await db.promise().query(sql)
            return true
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }

    async markAsAccepted(data){
        const {status, items} = data
        try{
            let acceptedOrders = items.reduce((acc, item) => {
                acc += `"${item}", `
                return acc
            }, "(")
            acceptedOrders = acceptedOrders.slice(0, -2)
            acceptedOrders += ")"
            let sql = ''
            if(status === 'pending'){
                sql = `UPDATE onorder SET status = "accepted" WHERE phone IN ${acceptedOrders}`
            }else{
                sql = `DELETE FROM onorder WHERE phone IN ${acceptedOrders}`
            }
            await db.promise().query(sql)
            return true
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }

    async getAnalytic(date){
        const {dateFrom, dateTo} = date
        try{
            let sql = `SELECT SUM(sum) as sum, SUM(count) as count, category
                        FROM ordered_products where created_at between '${dateFrom}' and '${dateTo}'
                        GROUP BY category`
            const result = await db.promise().query(sql)
            const finalData = []
            const spark_plugs = result[0].filter(item => item.category === 'spark_plugs')
            const ignition_coils = result[0].filter(item => item.category === 'ignition_coils')
            const airbag_cables = result[0].filter(item => item.category === 'airbag_cables')
            const crankshaft_sensors = result[0].filter(item => item.category === 'crankshaft_sensors')
            const camshaft_sensors = result[0].filter(item => item.category === 'camshaft_sensors')
            const ignition_coil_mouthpieces = result[0].filter(item => item.category === 'ignition_coil_mouthpieces')

            finalData[0] = spark_plugs.length ? spark_plugs[0] : {category: 'spark_plugs', sum: 0, count: 0}
            finalData[1] = ignition_coils.length ? ignition_coils[0] : {category: 'ignition_coils', sum: 0, count: 0}
            finalData[2] = airbag_cables.length ? airbag_cables[0] : {category: 'airbag_cables', sum: 0, count: 0}
            finalData[3] = crankshaft_sensors.length ? crankshaft_sensors[0] : {category: 'crankshaft_sensors', sum: 0, count: 0}
            finalData[4] = camshaft_sensors.length ? camshaft_sensors[0] : {category: 'camshaft_sensors', sum: 0, count: 0}
            finalData[5] = ignition_coil_mouthpieces.length ? ignition_coil_mouthpieces[0] : {category: 'ignition_coil_mouthpieces', sum: 0, count: 0}
            return finalData
        }catch(err){
            throw ApiError.ServerError(err.message)
        }
    }
}

module.exports = new OrderService()