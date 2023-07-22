import React, { useState } from 'react';

const PolicyForm = ({ contract, account }) => {
    const [premium, setPremium] = useState('');
    const [coverage, setCoverage] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tx = await contract.methods.createPolicy(
            Number(premium),
            Number(coverage),
            Number(duration)
        ).send({ from: account });
        // Log the transaction details if required
        console.log('Transaction:', tx);
        setPremium('');
        setCoverage('');
        setDuration('');
    };

    return (
        <form className="space-y-2" onSubmit={handleSubmit}>
            {/* Same as before */}
        </form>
    );
};

export default PolicyForm;
