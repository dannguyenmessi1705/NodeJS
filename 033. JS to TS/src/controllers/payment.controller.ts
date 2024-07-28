import { HydratedDocument } from 'mongoose';
import  {UserTypes} from '../models/users';
import moment from 'moment';
import crypto from 'crypto';
import convertCurrency from '../util/convertCurrency';
import {Err, codeError} from '../util/statusCode'
const CODE = new codeError();
import querystring from 'qs';
const config: any = {
    vnp_TmnCode: process.env.TMNCODE_PAYMENT as string,
    vnp_HashSecret: process.env.HASH_SECRET_PAYMENT as string,
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    vnp_ReturnUrl: "http://localhost:3000/payment/vnpay_return"
};

export const getPayment = async (req: any, res: any, next: any) => {
    try {
        const userId: string = req.params.userId;
        const User = req.user as HydratedDocument<UserTypes>;
        if(userId !== User._id.toString()){
            return res.status(CODE.UNAUTHORIZED).json({
                message: "Unauthorized"
            })
        }
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let ipAddess = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        let returnUrl = req.protocol + '://' + req.get('host') + '/payment/vnpay_return/';
        let orderId = moment(date).format('DDHHmmss');
        let amount = parseFloat(req.body.amount);
        let bankCode = req.body.bankCode;
        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let amountVND = await convertCurrency(amount, 'USD', 'VND') as number;
        let currCode = "VND";
        let vnp_Params: any = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params["vnp_OrderInfo"] = 'Thanh toán cho mã đơn hàng: ' + orderId;
        vnp_Params["vnp_OrderType"] = 'billpayment';
        vnp_Params['vnp_Amount'] = amountVND;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddess;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);
        let signData: any = querystring.stringify(vnp_Params, {encode: false})
        let hmac: any = crypto.createHmac('sha512', secretKey);
        let signature = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        next(error);
    }
}

function sortObject(obj: any) {
    let sorted: any = {};
    let str: any[] = [];
    let key: any;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)){
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}