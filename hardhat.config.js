require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli:{
      url: `${process.env.REACT_APP_GOERLI_URL}`,
      accounts: [process.env.REACT_APP_PRIVATE_KEY]
    },
  },
};