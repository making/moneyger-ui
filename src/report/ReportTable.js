import React, {Component} from 'react';
import {Table} from 'pivotal-ui/react/table';
import expendituresClient from '../expenditure/ExpendituresClient';
import incomesClient from '../income/IncomesClient';

export default class ReportTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenditures: [],
            incomes: []
        };
    }

    render() {
        const expenditure = this.totalExpenditure();
        const income = this.totalIncome();
        const balance = income - expenditure;
        return (
            <div>
                <Table columns={[{
                    attribute: 'income',
                    displayName: 'Income',
                }, {
                    attribute: 'expenditure',
                    displayName: 'Expenditure',
                    sortable: true
                }, {
                    attribute: 'balance',
                    displayName: 'Balance',
                }]} data={[{
                    income: income,
                    expenditure: expenditure,
                    balance: balance

                }]}/>
            </div>
        );
    }

    totalExpenditure() {
        return this.state.expenditures
            .map(x => x.unitPrice * x.quantity)
            .reduce((x, y) => x + y, 0);
    }

    totalIncome() {
        return this.state.incomes
            .map(x => x.amount)
            .reduce((x, y) => x + y, 0);
    }

    balance() {
        return this.totalIncome() - this.totalExpenditure();
    }

    componentDidMount() {
        expendituresClient.loadExpenditures()
            .then(res => {
                const expenditures = res.data;
                this.setState({
                    expenditures: expenditures
                });
            })
            .catch(function (error) {
                console.error(error);
            });
        incomesClient.loadIncomes()
            .then(res => {
                const incomes = res.data;
                this.setState({
                    incomes: incomes
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    }
}