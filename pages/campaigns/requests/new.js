import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Message, Form, Input  } from 'semantic-ui-react';
import { Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import campaignInstance from '../../../ethereum/campaign';
import { Router } from '../../../routes';




class NewRequest extends Component {

static async getInitialProps(props) {
		//generates campaign object from passed in address at url
		const { address } = props.query;
		return {address};
	}


	state = {
		requestCost: '',
		description: '',
		recipient: '',
		errorMessage:'',
		loading: false
	}

	onSubmit = async (event) => {
		//set state to loading whenever the user clicks on the create button
		event.preventDefault();
		const campaign = campaignInstance(this.props.address);
		const {
			description,
			requestCost,
			recipient
		} = this.state;

		this.setState({ loading: true, errorMessage: ''});
		try {
			const accounts = await web3.eth.getAccounts();

			await campaign.methods.createRequest(description, web3.utils.toWei(requestCost, 'ether'), recipient).send({
				from: accounts[0]
			});
			Router.pushRoute(`/campaigns/${this.props.address}/requests`);
		} catch  (err) {
			this.setState({ errorMessage: err.message });
		}
		this.setState({ loading: false});
	}

	render () {
		return (
			<Layout>
				<h3>Create a New Request</h3>

				<Form onSubmit={this.onSubmit} error={this.state.errorMessage}>
					<Form.Field>
						<label>Payment Proposal</label>
						<Input 
							placeholder="enter proposal here"
							value = {this.state.description}
							onChange={event => 
								this.setState({
									description: event.target.value
								})}						
						/>
					</Form.Field>
					<Form.Field>
						<label>Request Cost</label>
						<Input 
							label="ether" 
							labelPosition="right" 
							placeholder="amount in Ether"
							value = {this.state.requestCost}
							onChange={event => 
								this.setState({
									requestCost: event.target.value
								})}
						 />
					</Form.Field>
					<Form.Field>
						<label>Recipient</label>
						<Input 
							placeholder="recipient address"
							value = {this.state.recipient}
							onChange={event => 
								this.setState({
									recipient: event.target.value
								})}
						/>
					</Form.Field>

					<Message error header="Oops!" content={this.state.errorMessage} />

					<Button loading={this.state.loading} primary>Create</Button>
				</Form>
			</Layout>
		);
	}
}

export default NewRequest;