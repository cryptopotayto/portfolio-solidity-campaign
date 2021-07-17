import React, { Component } from 'react';
import factory from '../ethereum/factory';
import 'semantic-ui-css/semantic.min.css';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes'

class CampaignIndex extends Component {
	//creates data fetching request that occurs before server side rendering
	//static makes class based functions tied to class not instance
	//returns data on 'props' property
	static async getInitialProps() {

		const campaigns = await factory.methods.getCampaigns().call();
		return { campaigns };
	}
	//create list of campaign card
	renderCampaigns() {
		//iterate over campaigns array in contract and return an object
		const items = this.props.campaigns.map(address => {
			return {
				header: address,
				description: (
				<Link route={`/campaigns/${address}`}>
					<a href="">View Campaign</a>
				</Link>
				),
				fluid: true
			}
		});
	//renders item type in semantic with items data called from contract
	return <Card.Group items={items} />;
	}

	render () {
		return ( 
			<Layout>
				<div>
					<h3>Open Campaigns</h3>
					<Link route="/campaigns/new">
						<a>
							<Button
								content="Create Campaign"
								icon="add circle"
								floated="right"
								primary
							/>
						</a>
					</Link>

				{this.renderCampaigns()}
			</div>
		</Layout>
		);
	}
}



export default CampaignIndex;