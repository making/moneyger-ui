import axios from 'axios';

class IncomesClient {
    loadIncomes() {
        this.source = axios.CancelToken.source();
        return axios.get('/incomes', {
            cancelToken: this.source.token
        });
    }

    createIncome(incomes) {
        return axios.post('/incomes', incomes);
    }

    updateIncome(incomes) {
        return axios.put(`/incomes/${incomes.id}`, incomes);
    }

    deleteIncome(incomesId) {
        return axios.delete(`/incomes/${incomesId}`);
    }

    cancel() {
        if (this.source) {
            this.source.cancel('Operation canceled by the incomes.');
        }
    }
}

export default new IncomesClient();