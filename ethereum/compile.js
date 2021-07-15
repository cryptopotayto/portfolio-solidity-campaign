const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

//find build folder path

const buildPath = path.resolve(__dirname, 'build');

//delete build folder and all contents

fs.removeSync(buildPath);
console.log('remove done');
//read in smart contract information

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

//contains un-parsed data from smart contract

const source = fs.readFileSync(campaignPath, 'UTF-8');

//pull off contracts property from compiler and assign to output
//output now has contracts modifier

const output = solc.compile(source, 1).contracts;

//create new build directory

fs.ensureDirSync(buildPath);
console.log('build done');
//for each contract containt in the output

for (let contract in output) {
	//writes object to JSON file (creates new file if not existing)
	fs.outputJsonSync(
		//pass in path and name as input
		path.resolve(buildPath, contract.replace(':', '') + '.json'),
		//output is the compiled information from each contract
		output[contract]
	);
}
