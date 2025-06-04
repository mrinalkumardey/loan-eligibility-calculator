document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const proposedLoanAmount = parseFloat(document.getElementById('proposed-loan-amount').value);
    const loanTenure = parseInt(document.getElementById('loan-tenure').value);
    const businessDays = parseInt(document.getElementById('business-days').value);
    const dailySale = parseFloat(document.getElementById('daily-sale').value);
    const margin = parseFloat(document.getElementById('margin').value) / 100;
    const secondaryIncome1 = parseFloat(document.getElementById('secondary-income-1').value);
    const secondaryIncome2 = parseFloat(document.getElementById('secondary-income-2').value);
    const existingEMI = parseFloat(document.getElementById('existing-emi').value);
    const hasCreditHistory = document.getElementById('credit-history').checked;

    // Validate inputs
    if (loanTenure > 36) {
        alert('Loan tenure cannot exceed 36 months.');
        return;
    }
    if (proposedLoanAmount <= 0) {
        alert('Proposed loan amount must be greater than zero.');
        return;
    }

    // Calculate Primary Income
    const primaryIncome = businessDays * dailySale * margin;

    // Calculate Total Secondary Income (40% considered)
    const totalSecondaryIncome = secondaryIncome1 + secondaryIncome2;
    const consideredSecondaryIncome = 0.4 * totalSecondaryIncome;

    // Calculate Total Income
    const totalIncome = primaryIncome + consideredSecondaryIncome;

    // Apply FOIR
    const foirLimit = hasCreditHistory ? 0.5 : 0.4;
    const maxAllowableEMI = totalIncome * foirLimit;

    // Calculate EMI for Proposed Loan Amount
    const monthlyRate = 0.2245 / 12; // 22.45% annual interest rate
    const proposedEMI = proposedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure) /
                        (Math.pow(1 + monthlyRate, loanTenure) - 1);

    // Check eligibility for proposed loan
    const totalEMI = proposedEMI + existingEMI;
    const isEligible = totalEMI <= maxAllowableEMI;

    // Calculate Maximum Loan Amount (for reference)
    const availableEMICapacity = maxAllowableEMI - existingEMI;
    const maxLoanAmount = availableEMICapacity * (1 - Math.pow(1 + monthlyRate, -loanTenure)) / monthlyRate;

    // Display result
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.className = isEligible ? 'eligible' : 'not-eligible';

    if (isEligible) {
        resultDiv.innerHTML = `
            <h3>Eligible for Proposed Loan!</h3>
            <p>Proposed Loan Amount: ₹${proposedLoanAmount.toFixed(2)}</p>
            <p>Proposed Monthly EMI: ₹${proposedEMI.toFixed(2)}</p>
            <p>Loan Tenure: ${loanTenure} months</p>
            <p>Primary Income: ₹${primaryIncome.toFixed(2)}</p>
            <p>Considered Secondary Income (40%): ₹${consideredSecondaryIncome.toFixed(2)}</p>
            <p>Total Income: ₹${totalIncome.toFixed(2)}</p>
            <p>FOIR: ${(totalEMI / totalIncome * 100).toFixed(2)}% (Limit: ${(foirLimit * 100).toFixed(0)}%)</p>
            <p>Available EMI Capacity: ₹${availableEMICapacity.toFixed(2)}</p>
            <p>Maximum Loan Amount (for reference): ₹${maxLoanAmount.toFixed(2)}</p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h3>Not Eligible for Proposed Loan</h3>
            <p>Proposed Loan Amount: ₹${proposedLoanAmount.toFixed(2)}</p>
            <p>Proposed Monthly EMI: ₹${proposedEMI.toFixed(2)}</p>
            <p>Loan Tenure: ${loanTenure} months</p>
            <p>Primary Income: ₹${primaryIncome.toFixed(2)}</p>
            <p>Considered Secondary Income (40%): ₹${consideredSecondaryIncome.toFixed(2)}</p>
            <p>Total Income: ₹${totalIncome.toFixed(2)}</p>
            <p>FOIR: ${(totalEMI / totalIncome * 100).toFixed(2)}% (Limit: ${(foirLimit * 100).toFixed(0)}%)</p>
            <p>Available EMI Capacity: ₹${availableEMICapacity.toFixed(2)}</p>
            <p>Maximum Loan Amount (for reference): ₹${maxLoanAmount.toFixed(2)}</p>
            <p>Your total EMI exceeds the FOIR limit. Consider a lower loan amount or longer tenure.</p>
        `;
    }
});

// Reset button functionality
document.getElementById('reset-button').addEventListener('click', function() {
    document.getElementById('loan-form').reset();
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
});