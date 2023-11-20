// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ROSCA {
    uint256 public constant contribution = 1 ether;
    uint8 public currentMonth = 0;
    address[] public members;
    mapping(address => bool) public hasDeposited;
    mapping(address => bool) public hasWithdrawn;

    event Withdrawal(address indexed member, uint256 amount);

    function contribute() external payable {
        require(msg.value == contribution, "Contribution must be exactly 1 ETH");
        require(!hasWithdrawn[msg.sender], "Already withdrawn");

        if (!hasDeposited[msg.sender]) {
            members.push(msg.sender);
            hasDeposited[msg.sender] = true;
        }
    }

    function withdraw() external {
        require(hasDeposited[msg.sender], "Not a member or didn't contribute");
        require(!hasWithdrawn[msg.sender], "Already withdrawn");
        require(currentMonth < members.length, "All withdrawals done");

        address member = members[currentMonth];
        require(msg.sender == member, "Not your turn to withdraw");

        (bool sent, ) = payable(member).call{value: 1 ether}("");
        require(sent, "Failed to send Ether");

        hasWithdrawn[member] = true;
        currentMonth++;

        emit Withdrawal(msg.sender, 1 ether);
    }

    function getMembers() external view returns (address[] memory) {
        return members;

    }

}
