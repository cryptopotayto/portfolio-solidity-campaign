const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	
	//retrieves list of accounts from ganache
	
	accounts = await web3.eth.getAccounts();
	
	//creates deployed instance of factory by parsing abi(interface)
	//and then sending bytecode (actual solidity code)
	
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
	.deploy({ data: compiledFactory.bytecode })
	.send({ from: accounts[0], gas: '1000000'});
	
	//use factory to make instance of campaign
	
	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000'
	});

	[campaignAddress] = await factory.methods.getCampaigns().call();

	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe('Campaigns', () => {
	it('deploys a campaign', () =>{
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});
	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});
	it('allows contributers and adds approvers', async () => {
		await campaign.methods.contribute().send({
			value: '200',
			from: accounts[1]
		});
		const isContributer = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributer);
	});
	it('minimum contribution', async () => {
		try {
			await campaign.methods.contribute().send({
				value: '5',
				from: accounts[1]
			});
			assert(false);
		} catch (err){
			assert(err);
		}
	});
	it('manager can make requests', async () => {
		await campaign.methods.createRequest(
			'test', '100', accounts[1])
		.send({
			from: accounts[0],
			gas: '1000000'
		});
		const request = await campaign.methods.requests(0).call();
		assert(request);
	});
	it('end to end test', async () => {
		await campaign.methods.contribute().send({
			value: '200',
			from: accounts[1]
		});
		await campaign.methods.createRequest(
			'test', '100', accounts[3])
		.send({
			from: accounts[0],
			gas: '1000000'
		});
		await campaign.methods.approveRequest(0).send({
			from: accounts[1],
			gas: '1000000'
		});
		let before = await web3.eth.getBalance(accounts[3]);
		before = web3.utils.fromWei(before, 'ether');
		await campaign.methods.processRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});
		let after = await web3.eth.getBalance(accounts[3]);
		after = web3.utils.fromWei(after, 'ether');
		const approved = await campaign.methods.requests(0).call();
		assert(after > before);
		assert(approved.complete);
	});






});
