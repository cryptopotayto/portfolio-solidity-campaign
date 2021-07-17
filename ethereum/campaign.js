import web3 from './web3';
import Campaign from './build/Campaign.json';
//this file captures contract address for usage in multiple contexts

const campaignInstance = (address) => {
	return new web3.eth.Contract(
		JSON.parse(Campaign.interface),
		address
	);
}

export default campaignInstance;