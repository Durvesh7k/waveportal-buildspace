//SPDX-License-Identifier:MIT
pragma solidity 0.8.17;

import "hardhat/console.sol";

contract Waveportal{
    uint256 totalWaves;
    uint256 private seed;

    constructor() payable {
        console.log("Hey Im smart contract");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    mapping(address=>uint256) public lastWaved;

    event NewWave(address indexed from, string msessage,uint256 timestamp);

    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] public waves;

    function wave(string memory _message) public {
        totalWaves+=1;
        console.log("The total number of waves %d" , totalWaves);

        waves.push(Wave(
            msg.sender,
            _message,
            block.timestamp
        ));

        require(
            lastWaved[msg.sender] + 15 seconds < block.timestamp,
            "wait 15 seconds"
        );

        lastWaved[msg.sender] = block.timestamp;
         
        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("Randomly generated number %s: ", seed);

        if(seed <=50){
            uint prizeAmount = 0.001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money"
            );

            (bool sucess,)  = (msg.sender).call{value : prizeAmount}("");
            require(
                sucess,
                "Failed to send money from the contract"
            );
        }

        emit NewWave(msg.sender, _message,block.timestamp);
    }

    function getTotalWaves() public view returns(uint256){
        return totalWaves;
    }

    function getAllWaves() public view returns(Wave[] memory){
        return waves;
    }

}
