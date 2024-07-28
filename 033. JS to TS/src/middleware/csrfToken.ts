import Tokens from 'csrf'
const csrf = new Tokens()
const secret = process.env.SECRET_KEY_CSRF as string
let csrfToken:string
export const CreateCSRFTOKEN = (req:any, res:any, next:any) => {
    csrfToken = csrf.create(process.env.SECRET_KEY_CSRF as string)
    req.session.csrfToken = csrfToken;
    res.locals.authenicate = req.session.isLogin
    res.locals.csrfToken = csrfToken
    next()
}

export const verifyCSRFTOKEN = (req:any, res:any, next:any) => {
    const token = req.get('X-CSRF-Token')
    if (!csrf.verify(process.env.SECRET_KEY_CSRF as string, token)) {
        const err = new Error('Invalid CSRF Token')
        return next(err)
    } 
    next()
}

export const getCSRFTOKEN = () => {
    return csrfToken
}