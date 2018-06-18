let fs = require("fs");
const solc = require('solc');
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
let accouts;
const getAccounts = async () => {
    try {
        const myAccounts = await web3.eth.getAccounts();
        console.log(myAccounts)
        accouts = myAccounts;

    } catch (err) {
        console.log(err);
    }
}

// web3.eth.getAccounts().then(e => {accouts = e[0];})
accouts = getAccounts()
	
// setTimeout(() => {accouts = getAccounts()}, 1);
console.log(accouts);
// setTimeout(() => {console.log(accouts);}, 100);