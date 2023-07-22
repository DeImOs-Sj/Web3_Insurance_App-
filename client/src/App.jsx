import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import Web3 from 'web3';
import InsurancePolicyContract from './contracts/InsurancePolicy.json';
import img1 from './components/image.jpg'
import Navbar from './components/Navbar';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [premium, setPremium] = useState('');
  const [coverage, setCoverage] = useState('');
  const [duration, setDuration] = useState('');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  // Load the smart contract
  useEffect(() => {
    const loadBlockchain = async () => {
      try {
        // Connect to the MetaMask provider
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        }

        // Load the contract
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = InsurancePolicyContract.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          InsurancePolicyContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      } catch (error) {
        console.error('Error loading blockchain data', error);
      }
      setLoading(false);
    };

    loadBlockchain();
  }, [web3]);

  // Load existing policies for the current account
  const loadPolicies = useCallback(async (excludedPolicyId) => {
    if (contract) {
      const policyIds = await contract.methods.getPolicyholderPortfolio(account).call();
      const policyPromises = policyIds.map(async (id) => {
        const policy = await contract.methods.policies(id).call();
        // Convert relevant properties to strings
        return {
          id,
          premium: policy.premium.toString(),
          coverage: policy.coverage.toString(),
          expirationDate: policy.expirationDate.toString(),
          active: policy.active
        };
      });
      const loadedPolicies = await Promise.all(policyPromises);

      // Filter out the claimed policy and the selected policy from the list
      const filteredPolicies = loadedPolicies.filter(policy => policy.active && policy.id !== excludedPolicyId);

      setPolicies(filteredPolicies);
    }
  }, [contract, account]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  // Handle policy creation
  const handleCreatePolicy = async () => {
    try {
      if (!contract || !premium || !coverage || !duration) {
        alert("Please fill in all fields before creating a policy.");
        return;
      }

      setLoading(true);

      // Convert premium and coverage to wei (assuming they are in Ether units)
      const premiumWei = web3.utils.toWei(premium.toString(), 'ether');
      const coverageWei = web3.utils.toWei(coverage.toString(), 'ether');

      // Call the smart contract method to create a new policy
      await contract.methods.createPolicy(premiumWei, coverageWei, duration).send({ from: account });

      // After the policy is created, reload the policies
      loadPolicies();

      // Clear the input fields
      setPremium('');
      setCoverage('');
      setDuration('');
    } catch (error) {
      console.error('Error creating policy', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPolicy = async (policyId) => {
    try {
      if (!contract || !policyId) {
        alert("Please select a policy to claim.");
        return;
      }

      setLoading(true);

      // Call the smart contract method to file a claim
      await contract.methods.fileClaim(policyId).send({ from: account });

      // Store the current selected policy ID
      const currentSelectedPolicyId = selectedPolicyId;

      // Clear the selected policy
      setSelectedPolicyId(null);

      // After the claim is filed, reload the policies (without the claimed policy)
      loadPolicies(currentSelectedPolicyId);
    } catch (error) {
      console.error('Error claiming policy', error);
    } finally {
      setLoading(false);
    }
  };

  const weiToEther = (wei) => {
    const etherValue = web3.utils.fromWei(wei, 'ether');
    return parseFloat(etherValue).toFixed(18);
  };


  return (
    <>
      <Navbar />
      <div className="container mx-auto  p-4 mt-[100px]  " id="create-policy-section">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" >
          <path fill="#000b76" fill-opacity="1" d="M0,160L34.3,144C68.6,128,137,96,206,101.3C274.3,107,343,149,411,160C480,171,549,149,617,133.3C685.7,117,754,107,823,112C891.4,117,960,139,1029,138.7C1097.1,139,1166,117,1234,96C1302.9,75,1371,53,1406,42.7L1440,32L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
        </svg>

        <h1 className="text-2xl te  font-bold mb-4">Insurance For Everyone</h1>
        <form
          className="mb-4 border border-gray-300 p-4  shadow-xl rounded-md"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePolicy();
          }}
        >
          <h2 className="text-2xl  text-white-700 font-bold mb-2">Create a new policy</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="premium" className='text-gray-500 text-xl font-bold'>Premium Amount (wei)</label>
              <input
                type="number"
                id="premium"
                className="block w-full border text-gray-700  border-gray-300 rounded-md p-2 mt-1"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="coverage" className='text-gray-500 text-xl font-bold'>Coverage Amount (wei)</label>
              <input
                type="number"
                id="coverage"
                className="block w-full border border-gray-300 rounded-md p-2 mt-1"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="duration" className='text-gray-500 text-xl font-bold'>Duration (seconds)</label>
              <input
                type="number"
                id="duration"
                className="block w-full border border-gray-300 rounded-md p-2 mt-1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4  bg-purple-600 hover:bg-purple-700  text-black font-semibold px-4 py-2 rounded"
          >
            Create Policy
          </button>
        </form >
        <div>
          <h2 className="text- font-bold mb-2" id="your-policies-section" >Your Policies</h2>
          <div className="grid grid-cols-2 gap-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="border border-black-200 p-4 rounded-md shadow-lg"
              >
                <p>
                  Policy ID: {policy.id}, Premium: {weiToEther(policy.premium)} Ether,
                  Coverage: {weiToEther(policy.coverage)} Ether, Expiration Date:{' '}
                  {new Date(policy.expirationDate * 1000).toLocaleDateString()}
                </p>
                <button
                  className="mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded"
                  onClick={() => handleClaimPolicy(policy.id)}
                >
                  Claim Policy
                </button>
              </div>
            ))}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#000b76" fill-opacity="1" d="M0,160L34.3,144C68.6,128,137,96,206,101.3C274.3,107,343,149,411,160C480,171,549,149,617,133.3C685.7,117,754,107,823,112C891.4,117,960,139,1029,138.7C1097.1,139,1166,117,1234,96C1302.9,75,1371,53,1406,42.7L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
        </svg>
      </div>
    </>
  );
}

export default App;
