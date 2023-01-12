const Razorpay = require('razorpay');
const { dbConn } = require('../bootstrap');

module.exports = {

    getDashboardData : async (dbConn,from,to)=> {
        let rzdata = await module.exports.getDataFromRzpApi(dbConn,from,to);
        let orders = await module.exports.getOrders(dbConn,rzdata);
        // let reconData = await module.exports.getReconsileData(dbConn,rzdata,orders);

        return {"status":true,"data":orders};
    },

    getDataFromRzpApi : async(dbConn,from,to)=> {
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

        let data = await instance.payments
        .all({
            from: from,
            to: to,
        });
        
        return data;
    },
    getOrders : (dbConn,rzdata)=> {
        return new Promise(function(resolve, reject) {

            
            let paymentIds = rzdata.items.map(function(item, index, array) {
                return item.id;
            });
            let paymentIdsText =paymentIds.join("','");
            let sql = `select * from razorpay_sales_order where rzp_payment_id in ('${paymentIdsText}')`;
            dbConn.query(sql,(error, results, fields)=>{
                if(error){
                    reject(error);
                }
                let pending_orders = [];
                let sucessfull_orders = [];

                results.forEach(element => {
                    if(element.order_placed==0){
                        pending_orders.push(element);
                    }else{
                        sucessfull_orders.push(element);
                    }
                });

                let finalData = {'pending_orders': pending_orders ,'sucessfull_orders':sucessfull_orders};
                resolve(finalData);
            });
        });
    },
    getReconsileData : async(dbConn,rzdata,orders) => {

    }

}