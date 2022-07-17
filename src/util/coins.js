import axios from "axios"

// {
//     "BTC": 0.05556,
//     "USD": 1159.16,
//     "EUR": 1138.07
// }
export function getRates() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH,EUR,MATIC'
    return axios.get(url)
}
