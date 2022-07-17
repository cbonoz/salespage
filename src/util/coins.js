import axios from "axios"

// {
//     "BTC": 0.05556,
//     "USD": 1159.16,
//     "EUR": 1138.07
// }
export function getRates() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR'
    return axios.get(url)
}

const getConvertUSDToEth = async (amountUsd) => {
    const res = await getRates()
    const conversion = res.data.USD
    return amountUsd / conversion
}