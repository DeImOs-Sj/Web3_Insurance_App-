// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract InsurancePolicy {
    struct Policy {
        address policyholder;
        uint premium;
        uint coverage;
        uint expirationDate;
        bool active;
    }

    mapping(uint => Policy) public policies;
    mapping(address => uint[]) public policyholderPortfolios;
    uint public policyCounter;

    event PolicyCreated(
        uint indexed policyId,
        address indexed policyholder,
        uint premium,
        uint coverage,
        uint expirationDate
    );
    event ClaimFiled(
        uint indexed policyId,
        address indexed policyholder,
        uint amount
    );

    constructor() {
        policyCounter = 0;
    }

    function createPolicy(
        uint premium,
        uint coverage,
        uint duration
    ) external returns (uint) {
        require(coverage <= premium, "Coverage cannot exceed premium amount");

        uint expirationDate = block.timestamp + duration;

        Policy memory policy = Policy({
            policyholder: msg.sender,
            premium: premium,
            coverage: coverage,
            expirationDate: expirationDate,
            active: true
        });

        policies[policyCounter] = policy;

        emit PolicyCreated(
            policyCounter,
            msg.sender,
            premium,
            coverage,
            expirationDate
        );

        policyholderPortfolios[msg.sender].push(policyCounter);

        uint createdPolicyId = policyCounter;
        policyCounter++;

        return createdPolicyId;
    }

    function fileClaim(uint policyId) external {
        Policy storage policy = policies[policyId];
        require(policy.active, "Policy is not active");
        require(
            policy.policyholder == msg.sender,
            "Only policyholder can file a claim"
        );

        // Perform claim processing logic here

        // For demonstration purposes, we emit an event with the claimed coverage amount
        emit ClaimFiled(policyId, msg.sender, policy.coverage);

        // Mark the policy as inactive (claimed)
        policy.active = false;
    }

    function getPolicyholderPortfolio(
        address policyholder
    ) external view returns (uint[] memory) {
        return policyholderPortfolios[policyholder];
    }
}
