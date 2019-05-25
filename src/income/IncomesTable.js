import React, {Component} from 'react';
import {DangerButton, PrimaryButton} from 'pivotal-ui/react/buttons';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {Form} from 'pivotal-ui/react/forms';
import {Divider} from 'pivotal-ui/react/dividers';
import {Input} from 'pivotal-ui/react/inputs';
import {SortableTable, withRenderTdChildren} from 'pivotal-ui/react/table';
import incomesClient from './IncomesClient';

export default class IncomesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incomes: []
        };
    }

    render() {
        const Table = withRenderTdChildren(SortableTable);

        return (
            <div>
                <Form {...{
                    onSubmit: ({initial, current}) => {
                        return incomesClient.createIncomes({
                            incomeDate: current.incomeDate,
                            incomeName: current.incomeName,
                            amount: current.amount
                        })
                            .then(res => {
                                const incomes = this.state.incomes;
                                incomes.push(res.data);
                                this.setState({incomes: incomes});
                            })
                            .catch(function (error) {
                                const response = error.response;
                                if (response.status === 400) {
                                    throw response.data;
                                } else {
                                    alert("Unexpected Error!");
                                    console.error(error);
                                    throw [];
                                }
                            });
                    },
                    onSubmitError: errors => errors.details,
                    resetOnSubmit: true,
                    fields: {
                        incomeDate: {
                            label: 'Income Date',
                            children: <Input type="date"/>
                        },
                        incomeName: {
                            initialValue: '',
                            label: 'Income Name'
                        },
                        unitPrice: {
                            label: 'Amount',
                            children: <Input type="number"/>
                        }
                    }
                }}>
                    {({fields, canSubmit}) => {
                        return (
                            <div>
                                <Grid>
                                    <FlexCol>{fields.incomeDate}</FlexCol>
                                    <FlexCol>{fields.incomeName}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.amount}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol className="mtxxxl" fixed><PrimaryButton type="submit">Submit</PrimaryButton></FlexCol>
                                </Grid>
                            </div>
                        );
                    }}
                </Form>
                <Divider/>
                <Table columns={[{
                    attribute: 'incomeDate',
                    displayName: 'Income Date',
                    sortable: true
                }, {
                    attribute: 'incomeName',
                    displayName: 'Income Name',
                    sortable: true
                }, {
                    attribute: 'amount',
                    displayName: 'Amount',
                    sortable: true
                }, {
                    attribute: 'incomeId',
                    displayName: 'Delete',
                    renderTdChildren: income => (<DangerButton onClick={this.deleteIncome(income)}>
                        Delete
                    </DangerButton>)

                }]} data={this.state.incomes}/>
                <p>
                    Total: {this.totalIncome()} JPY
                </p>
            </div>
        );
    }

    deleteIncome(income) {
        return () => {
            if (window.confirm("Delete " + income.incomeName + '?')) {
                const incomeId = income.incomeId;
                incomesClient
                    .deleteIncome(incomeId)
                    .then(() => {
                        this.setState({
                            incomes: this.state.incomes.filter(x => x.incomeId !== incomeId)
                        });
                    });
            }
        };
    }

    totalIncome() {
        return this.state.incomes
            .map(x => x.amount)
            .reduce((x, y) => x + y, 0);
    }

    componentDidMount() {
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