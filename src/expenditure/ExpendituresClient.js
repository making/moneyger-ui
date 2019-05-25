import axios from 'axios';

class ExpendituresClient {
    loadExpenditures() {
        this.source = axios.CancelToken.source();
        return axios.get('/expenditures', {
            cancelToken: this.source.token
        });
    }

    createExpenditure(expenditure) {
        return axios.post('/expenditures', expenditure);
    }

    updateExpenditure(expenditure) {
        return axios.put(`/expenditures/${expenditure.id}`, expenditure);
    }

    deleteExpenditure(expenditureId) {
        return axios.delete(`/expenditures/${expenditureId}`);
    }

    cancel() {
        if (this.source) {
            this.source.cancel('Operation canceled by the expenditure.');
        }
    }
}

export default new ExpendituresClient();