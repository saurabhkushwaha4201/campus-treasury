// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ClubTreasury {
    struct Expense {
        uint256 amount;
        string purpose;
        uint256 timestamp;
    }

    address public owner;
    mapping(address => uint256) private contributions;

    Expense[] private expenses;

    event ContributionReceived(address indexed contributor, uint256 amount);
    event ExpenseRecorded(
        address indexed recipient,
        uint256 amount,
        string purpose,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "ClubTreasury: only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        _recordContribution(msg.sender, msg.value);
    }

    function contribute() external payable {
        _recordContribution(msg.sender, msg.value);
    }

    function withdraw(uint256 amount, string calldata purpose) external onlyOwner {
        require(amount > 0, "ClubTreasury: amount required");
        require(bytes(purpose).length > 0, "ClubTreasury: purpose required");
        require(address(this).balance >= amount, "ClubTreasury: insufficient balance");

        expenses.push(
            Expense({
                amount: amount,
                purpose: purpose,
                timestamp: block.timestamp
            })
        );

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "ClubTreasury: transfer failed");

        emit ExpenseRecorded(owner, amount, purpose, block.timestamp);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getContribution(address contributor) external view returns (uint256) {
        return contributions[contributor];
    }

    function getExpenses() external view returns (Expense[] memory) {
        return expenses;
    }

    function _recordContribution(address contributor, uint256 amount) internal {
        require(amount > 0, "ClubTreasury: amount required");

        contributions[contributor] += amount;
        emit ContributionReceived(contributor, amount);
    }
}
