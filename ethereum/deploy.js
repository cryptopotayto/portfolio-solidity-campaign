//describe provider
const HDWalletProvider = require('truffle-hdwallet-provider');
//declare web3 instance
const Web3 = require('web3');
//pass in compiled data
const compiledFactory = require('./build/CampaignFactory.json');
//create obj wtih mnenomic for address and infura endpoint address
const provider = new HDWalletProvider(
	'maple castle resemble bronze spare must dove review nerve tissue defense rough',
	'https://rinkeby.infura.io/v3/064f9abb13574328a55dcd73c4680944'
);
//initialze web3
const web3 = new Web3(provider);

//deploy contract to test network Rinkeby
const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	const result = await new web3.eth.Contract(
		JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ gas: '1000000', from: accounts[0]});
	console.log('contract deployed to', result.options.address);
}
deploy();