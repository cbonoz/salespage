import axios from "axios"


// Example reply:
// {"BTC":0.0000417,"ETH":0.0005293,"SOL":0.02293,"MATIC":1.06}
export function getRates() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH,SOL,MATIC'
    return axios.get(url)
}
