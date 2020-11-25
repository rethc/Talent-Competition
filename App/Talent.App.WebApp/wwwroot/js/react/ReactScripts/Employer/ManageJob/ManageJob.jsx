import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Header, Card } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            jobsFound: true

        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);

        //your functions go here
        this.renderJobs = this.renderJobs.bind(this);
        this.renderNoJobs = this.renderNoJobs.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        );

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://https://reth-talenttalent.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,
            },
            type: "GET",
            success: function (res) {
                this.setState({
                    loadJobs: res.myJobs
                });
                if (res.totalCount > 0) {
                    this.setState({ jobsFound: true });
                } else {
                    this.setState({ jobsFound: false });
                }
            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    renderNoJobs() {
        return <Segment basic>No Jobs Found</Segment>
    }

    renderJobs() {
        return (<Segment basic>
            <Card.Group itemsPerRow='3'>
                {this.state.loadJobs.map(job => <JobSummaryCard key={job.id} job={job} />)}
            </Card.Group>
        </Segment>)
    }


    render() {
        const filterOptions = [
            {
                key: 'Active',
                text: 'Active',
                value: 'Active'
            },
            {
                key: 'Closed',
                text: 'Closed',
                value: 'Closed'
            },
            {
                key: 'Draft',
                text: 'Draft',
                value: 'Draft'
            },
            {
                key: 'Expired',
                text: 'Expired',
                value: 'Expired'
            },
            {
                key: 'Unexpired',
                text: 'Unexpired',
                value: 'Unexpired'
            }
        ];

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <Header as='h1'>List of Jobs</Header>

                        <Icon name='filter' />Filter:
                        <Dropdown
                            text='Choose filter'
                            inline
                            options={filterOptions}
                        />
                        <Icon name='calendar alternate outline' />Sort by date:
                        <Dropdown
                            text='Newest first'
                            inline
                        >
                        </Dropdown>


                        {this.state.jobsFound ? this.renderJobs() : this.renderNoJobs()}

                        <Segment basic textAlign='center'>
                            <Pagination
                                defaultActivePage={1}
                                totalPages={1}
                            />
                        </Segment>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}