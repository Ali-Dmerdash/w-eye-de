exports.detectFraud = async (data) => {
  return { fraud: Math.random() > 0.5, details: "Fraud detection executed." };
};

exports.getFraudHistory = async () => {
  return [
    { id: 1, status: "Fraud detected" },
    { id: 2, status: "No fraud" },
  ];
};
