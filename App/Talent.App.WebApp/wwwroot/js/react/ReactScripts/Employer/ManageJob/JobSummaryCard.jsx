import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    render() {
        return (
            <Card>
                <Card.Content>
                    <Card.Header>Test Header</Card.Header>
                </Card.Content>
            </Card>
        )
    }
}