import multer from "multer";
export const fileStorage = multer.diskStorage({
    destination(req: any, file: any, cb: any) {
        if (req.originalUrl.includes("profile") && req.session?.user) {
            cb(null, 'images/avatar');
        } else {
            cb(null, 'images');
        }
    },
    filename(req: any, file: any, cb: any) {
        let userId: string = '';
        let formatedDate: string = '';
        if (req.originalUrl.includes("profile") && req.session?.user) {
            userId = req.session.user._id;
            cb(null, userId + '.' + file.originalname.split('.')[1]);
        } else {
            const date = new Date();
            formatedDate = date.toISOString().replace(/:/g, '_').replace(/\./g, '');
            cb(null, formatedDate + file.originalname);
        }
    }
});

export const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}