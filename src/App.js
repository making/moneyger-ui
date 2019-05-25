import React, {Component} from 'react';
import {Tab, Tabs} from 'pivotal-ui/react/tabs';
import ExpendituresTable from './expenditure/ExpendituresTable';
import IncomesTable from "./income/IncomesTable";
import ReportTable from "./report/ReportTable";
import 'pivotal-ui/css/alignment';
import 'pivotal-ui/css/vertical-alignment';
import 'pivotal-ui/css/typography';
import 'pivotal-ui/css/whitespace';
import 'pivotal-ui/css/border';
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Moneyger</h2>
                <Tabs defaultActiveKey={1} responsiveBreakpoint="md">
                    <Tab eventKey={1} title="Expenditures">
                        <ExpendituresTable/>
                    </Tab>
                    <Tab eventKey={2} title="Incomes">
                        <IncomesTable/>
                    </Tab>
                    <Tab eventKey={3} title="Report">
                        <ReportTable/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
};
