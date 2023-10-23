import express from 'express'
const app = express()

// Thiết lập các biến môi trường
import 'dotenv/config'

// Dùng helmet để bảo mật ứng dụng Express bằng cách sử dụng các HTTP header
import helmet from 'helmet'
app.use(helmet());

// Thêm Content Security Policy (CSP) để cho phép các tài nguyên nào được load từ đâu (VD: dùng google maps)
app.use(
    helmet.contentSecurityPolicy({ // CSP là một HTTP header cho phép bạn kiểm soát các nguồn tài nguyên nào được load trên trang web của bạn
      directives: { // Các directives cho phép bạn chỉ định các nguồn tài nguyên nào được load trên trang web của bạn
        defaultSrc: ["'self'"], // Chỉ cho phép load các nguồn tài nguyên từ chính domain của bạn
        frameSrc: ["'self'", 'https://www.google.com/'], // Chỉ cho phép load các nguồn tài nguyên từ chính domain của bạn và từ https://www.google.com/ (ví dụ: iframe)
        formAction: ["'self'", "https://sandbox.vnpayment.vn/"], // Chỉ cho phép load các nguồn tài nguyên từ chính domain của bạn và từ https://sandbox.vnpayment.vn/ (ví dụ: form)
        connectSrc: ["'self'", "https://sandbox.vnpayment.vn/"], // Chỉ cho phép load các nguồn tài nguyên từ chính domain của bạn và từ https://sandbox.vnpayment.vn/ (ví dụ: fetch, xhr, websocket)
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
      },
    })
);