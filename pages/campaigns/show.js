import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import campaignInstance from '../../ethereum/campaign';
class CampaignShow extends Component {
	
	static async getInitialProps(props) {
		//generates campaign object from passed in address at url
		const campaign = campaignInstance(props.query.address);

		const summary = await campaign.methods.getSummary().call();
		return {
            minimumContribution: summary[0],
            balance: summary[1],
            numRequests: summary[2],
            approversCount: summary[3],
            manager: summary[4]

		};
	}

	render() {
		return ( 
			<Layout>
				<h3>test</h3>
			</Layout>
		);	
	}
}

export default CampaignShow;