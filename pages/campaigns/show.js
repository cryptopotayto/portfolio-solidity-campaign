import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message, Card, Grid } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import campaignInstance from '../../ethereum/campaign';
import ContributeForm from '../../components/Contribute';
import { Link } from '../../routes';


class CampaignShow extends Component {
	
	static async getInitialProps(props) {
		//generates campaign object from passed in address at url
		const campaign = campaignInstance(props.query.address);
		//returns object containg called information
		const summary = await campaign.methods.getSummary().call();
		//interpreting abstraction layer from obj back out to indv var
		return {
            minimumContribution: summary[0],
            balance: summary[1],
            numRequests: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address
		};
	}

	renderCards() {

		const {
			minimumContribution,
			manager,
			balance,
			numRequests,
			approversCount
		} = this.props;

		const items = [
			{
				header: manager,
				meta: 'Address of Manager',
				description: 'This is the creator of this campaign',
				style: { overflowWrap: 'break-word'}
			},
			{
				header: minimumContribution,
				meta: 'Minimum Contribution (wei)',
				description: 'You must contribute at least this much wei to become a backer',
				style: { overflowWrap: 'break-word'}
			},			
			{
				header: numRequests,
				meta: 'Number of Active Requests',
				description: 'This is the number of active requests waiting to be approved',
				style: { overflowWrap: 'break-word'}
			},		
			{
				header: web3.utils.fromWei(balance, 'ether'),
				meta: 'Current Contract Balance (ether)',
				description: 'This is the current balance availabe to the campaign',
				style: { overflowWrap: 'break-word'}
			},
			{
				header: approversCount,
				meta: 'Current Backers',
				description: 'This is the list of all current backers',
				style: { overflowWrap: 'break-word'}
			},			
		]

		return <Card.Group items={items}	/>;
	}

	render() {
		return ( 
			<Layout>
			<h3>Campaign Home</h3>
			<Grid>
				<Grid.Column width={10}>
					{this.renderCards()}
					<Link route={`/campaigns/${this.props.adddress}/requests`}>
						<a>
							<Button style={{ marginTop: '10px'}} primary>View Requests</Button>
						</a>
					</Link>				
				</Grid.Column>
				<Grid.Column width={6}>
					<ContributeForm address={this.props.address}/>				
				</Grid.Column>
			</Grid>
			</Layout>
		);	
	}
}

export default CampaignShow;