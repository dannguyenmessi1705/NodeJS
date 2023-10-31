const URL_DB = process.env.URL_MONGODB;
const dbname = 'ftp';
const URL = URL_DB.replace(/\?retryWrites=true/i, dbname+"?retryWrites=true"); // đổi tên cho database
module.exports = URL;