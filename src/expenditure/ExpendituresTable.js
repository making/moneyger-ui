import React, {Component} from 'react';
import {DangerButton, PrimaryButton} from 'pivotal-ui/react/buttons';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {Form} from 'pivotal-ui/react/forms';
import {Divider} from 'pivotal-ui/react/dividers';
import {Input} from 'pivotal-ui/react/inputs';
import {SortableTable, withRenderTdChildren} from 'pivotal-ui/react/table';
import expendituresClient from './ExpendituresClient';

export default class ExpendituresTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenditures: []
        };
    }

    render() {
        const Table = withRenderTdChildren(SortableTable);
        const formatter = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        });

        return (
            <div>
                <Form {...{
                    onSubmit: ({initial, current}) => {
                        return expendituresClient.createExpenditure({
                            expenditureDate: current.expenditureDate,
                            expenditureName: current.expenditureName,
                            unitPrice: current.unitPrice,
                            quantity: current.quantity
                        })
                            .then(res => {
                                const expenditures = this.state.expenditures;
                                expenditures.push(res.data);
                                this.setState({expenditures: expenditures});
                            })
                            .catch(function (error) {
                                const response = error.response;
                                if (response.status === 400) {
                                    throw response.data;
                                } else if (response.data && response.data.message) {
                                    alert(response.data.message);
                                    console.error(error);
                                    throw [];
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
                        expenditureDate: {
                            label: 'Expenditure Date',
                            children: <Input type="date"/>
                        },
                        expenditureName: {
                            initialValue: '',
                            label: 'Expenditure Name'
                        },
                        unitPrice: {
                            label: 'Unit Price',
                            children: <Input type="number"/>
                        },
                        quantity: {
                            label: 'Quantity',
                            initialValue: 1,
                            children: <Input type="number"/>
                        }
                    }
                }}>
                    {({fields, canSubmit}) => {
                        return (
                            <div>
                                <Grid>
                                    <FlexCol>{fields.expenditureDate}</FlexCol>
                                    <FlexCol>{fields.expenditureName}</FlexCol>
                                </Grid>
                                <Grid>
                                    <FlexCol>{fields.unitPrice}</FlexCol>
                                    <FlexCol>{fields.quantity}</FlexCol>
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
                    attribute: 'expenditureDate',
                    displayName: 'Expenditure Date',
                    sortable: true
                }, {
                    attribute: 'expenditureName',
                    displayName: 'Expenditure Name',
                    sortable: true
                }, {
                    attribute: 'unitPrice',
                    displayName: 'Unit Price',
                    sortable: true,
                    renderTdChildren: expenditure => formatter.format(expenditure.unitPrice)
                }, {
                    attribute: 'quantity',
                    displayName: 'Quantity',
                    sortable: true
                }, {
                    attribute: 'expenditureId',
                    displayName: 'Delete',
                    renderTdChildren: expenditure => (<DangerButton onClick={this.deleteExpenditure(expenditure)}>
                        Delete
                    </DangerButton>)

                }]} data={this.state.expenditures}/>
                <p>
                    Total: {formatter.format(this.totalExpenditure())}
                </p>
            </div>
        );
    }

    deleteExpenditure(expenditure) {
        return () => {
            if (window.confirm("Delete " + expenditure.expenditureName + '?')) {
                const expenditureId = expenditure.expenditureId;
                expendituresClient
                    .deleteExpenditure(expenditureId)
                    .then(() => {
                        this.setState({
                            expenditures: this.state.expenditures.filter(x => x.expenditureId !== expenditureId)
                        });
                    });
            }
        };
    }

    totalExpenditure() {
        return this.state.expenditures
            .map(x => x.unitPrice * x.quantity)
            .reduce((x, y) => x + y, 0);
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
    }
}