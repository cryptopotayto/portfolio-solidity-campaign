import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Grid, Card, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';


class RequestIndex extends Component {
	
	static async getInitialProps(props) {
		//generates campaign object from passed in address at url
		const { address } = props.query;
		const campaign = Campaign(address);
		const requestCount = await campaign.methods.getRequestsCount().call();
		const approversCount = await campaign.methods.approversCount().call();
		//calls all requests from contract and returns in a numbered obj
		const requests = await Promise.all(
			Array(parseInt(requestCount)).fill().map((element, index) => {
				return campaign.methods.requests(index).call()
			})
		);

		return {address, requests, requestCount, approversCount};
	}

	renderRow() {
		return this.props.requests.map((request, index) => {
			return <RequestRow
				key={index}
				request ={request}
				address={this.props.address}
				id={index}
				approversCount={this.props.approversCount}
			 />;
		})
	}

	render () {

		const { Header, Row, HeaderCell, Body } = Table;

		return(
		<Layout>
			<h3>Requests</h3>
			<Grid.Row>
				<Grid.Column width={16}>
					<Table>
						<Header>
							<Row>
								<HeaderCell>ID</HeaderCell>
								<HeaderCell>Description</HeaderCell>
								<HeaderCell>Amount</HeaderCell>
								<HeaderCell>Recipient</HeaderCell>
								<HeaderCell>ApproverCount</HeaderCell>
								<HeaderCell>Approve</HeaderCell>
								<HeaderCell>Finalize</HeaderCell>
							</Row>
						</Header>
						<Body>
							{this.renderRow()}
						</Body>
					</Table>
				</Grid.Column>
			</Grid.Row>
			<Link route={`/campaigns/${this.props.address}/requests/new`}>
				<a>
					<Button floated="right" style={{ marginTop: '10px'}} primary>Add Request</Button>
				</a>
			</Link>
		</Layout>
		);
	}
}

export default RequestIndex;