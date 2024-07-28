import {Err, codeError} from './statusCode';
const CODE = new codeError();
const accessKey = process.env.CURRENCY_LAYER as string;
export default async function convertCurrency(amount: number, from: string, to: string) {
    const baseUrl: string = 'http://apilayer.net/api/live';
    const currency: string = to;
    const source: string = from;
    const format: number = amount;
    const url: string = `${baseUrl}?access_key=${accessKey}&currencies=${currency}&source=${source}&format=${format}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        return Math.ceil(result.quotes[from+to] * 100);
    } catch (err: any) {
        return new Err(err, CODE.INTERNALSERVERERROR);
    }
}