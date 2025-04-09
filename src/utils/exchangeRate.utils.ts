import axios from 'axios';

interface RateExchange {
    [key: string]: number;
}

class ExchangeRateService {
    private rate: RateExchange = {};
    private readonly baseUrl: string = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_KEY}/latest/USD`;
    private lastUpadate: number = 0;
    private readonly updateInterval: number = 1000 * 60 * 60 * 24;

    async getExchangeRate() {
        const now = Date.now();
        // if the last update time is not yp to 48 hours
        if (
            now - this.lastUpadate < this.updateInterval &&
            Object.keys(this.rate).length > 0
        ) {
            return this.rate;
        }
        try {
            const response = await axios.get(this.baseUrl);
            if (response.data && response.data.conversion_rates) {
                this.rate = response.data.conversion_rates;
                this.lastUpadate = now;
                return this.rate;
            } else {
                throw new Error('Error fetching exchange rate');
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching exchange rate');
        }
    }

    async convertCurrency(
        amount: number,
        sourceWallet: string,
        targetWallet: string,
    ) {
        const rates = await this.getExchangeRate();
        // check for source and target rates
        const sourceRate = rates[sourceWallet];
        const targetRate = rates[targetWallet];

        if (!sourceRate || !targetRate) {
            throw new Error(
                `Exchange Rate for ${sourceRate} or ${targetRate} not found`,
            );
        }
        const amountInUSD = amount / sourceRate; // Convert source to USD
        return amountInUSD * targetRate; // Convert from USD to target currency
    }
}

// create a single instance ExchangeRateService
export const exchangeRateService = new ExchangeRateService();
