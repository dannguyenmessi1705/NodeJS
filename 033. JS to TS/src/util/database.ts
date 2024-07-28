const URLMongo = process.env.URL_MONGO as string;
const dbname:string = "shop"
const URL:string = URLMongo?.replace(/\?retryWrites=true/i, dbname+"?retryWrites=true");
export default URL;
