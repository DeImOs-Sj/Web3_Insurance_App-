import React from 'react';

const PolicyList = ({ policies }) => {
    return (
        <ul className="space-y-2">
            {policies.map((policy) => (
                <li key={policy.policyId}>
                    Policy ID: {policy.policyId} - Coverage: {policy.coverage} wei
                </li>
            ))}
        </ul>
    );
};

export default PolicyList;
