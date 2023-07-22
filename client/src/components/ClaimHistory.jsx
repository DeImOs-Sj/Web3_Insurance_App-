import React from 'react';

const ClaimHistory = ({ claims }) => {
    return (
        <ul className="space-y-2">
            {claims.map((claim) => (
                <li key={claim.policyId}>
                    Policy ID: {claim.policyId} - Claim Amount: {claim.amount} wei
                </li>
            ))}
        </ul>
    );
};

export default ClaimHistory;
