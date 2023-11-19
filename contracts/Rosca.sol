// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ROSCA {
    address[10] public members;
    uint256 public constant contribution = 1 ether;
    uint8 public currentMonth = 0;
    mapping(address => bool) public hasWithdrawn;

    event Withdrawal(address indexed member, uint256 amount);


    constructor(address[10] memory _members) {
        members = _members;
    }

    function contribute() external payable {
        require(msg.value == contribution, "Contribution must be exactly 1 ETH");
        require(!hasWithdrawn[msg.sender], "Already withdrawn");
    }

    function withdraw() external {
        require(msg.sender == members[currentMonth], "Not your turn to withdraw");
        require(address(this).balance >= 1 ether, "Not enough balance");
        (bool sent, ) = payable(msg.sender).call{value: 1 ether}("");
        require(sent, "Failed to send Ether");
        emit Withdrawal(msg.sender, 1 ether);
        hasWithdrawn[msg.sender] = true;
        currentMonth++;
    }

}
