import web3 from './web3';
//imporst abi from build dir
import CampaignFactory from './build/CampaignFactory.json';
//create obj containing deployed contract information for easy access
const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0xA8ca050735ab8D7970CAd6f66ff397541be5ADe2'
);

export default instance;