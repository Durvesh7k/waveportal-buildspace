const main = async() => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();
  
  const wavePortalContract = await hre.ethers.getContractFactory('Waveportal')
  const waveContract = await wavePortalContract.deploy({
    value: hre.ethers.utils.parseEther('0.01'),
  })
  await waveContract.deployed();

  console.log('The contract is deployed by this address: ', deployer.address);
  console.log('The account balance of the deployer is : ', accountBalance.toString());
  console.log('The address of the contract is: ', waveContract.address);


  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log('The contract balance is : ', hre.ethers.utils.formatEther(contractBalance))

  let waveTx = await waveContract.wave('This is the first wave');
  await waveTx.wait();

  // let waveTx2 = await waveContract.wave('This is the second wave');
  // await waveTx2.wait();

  // let waveTx3 = await waveContract.wave('This is the third wave');
  // await waveTx3.wait();


  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log('The contract balance is : ', hre.ethers.utils.formatEther(contractBalance))

  const totalWaves = await waveContract.getTotalWaves();
  console.log('The total number of waves are: ', totalWaves.toNumber());
  console.log(await waveContract.getAllWaves());

  saveFrontendFiles(waveContract, 'Waveportal')
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);
  
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}


const runMain = async() => {
  try{
    await main();
    process.exit(1);
  }catch(e){
    console.log(e);
    process.exit(1);
  }
}

runMain();