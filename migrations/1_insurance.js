const InsurancePolicy = artifacts.require("./InsurancePolicy.sol");

module.exports = function (deployer) {
    // Deploy the contract
    deployer.deploy(InsurancePolicy);

    // Additional migration steps or deployments can be added here
};
