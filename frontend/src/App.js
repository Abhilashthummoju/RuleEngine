import React, { useState, useEffect } from 'react';

const App = () => {
  const [rule, setRule] = useState('');
  const [rules, setRules] = useState([]); // To hold fetched rules
  const [selectedRuleIds, setSelectedRuleIds] = useState(['']); // For dropdowns
  const [selectedOperators, setSelectedOperators] = useState([]); // New state for operators
  const [age, setAge] = useState('');
  const [department, setDepartment] = useState('');
  const [income, setIncome] = useState('');
  const [result, setResult] = useState('');
  const [selectedEvaluationRuleId, setSelectedEvaluationRuleId] = useState(''); // New state for selected rule in evaluation

  // Fetch rules from the backend when the component mounts
  const fetchRules = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/rules/getRules');
      const data = await res.json();
      setRules(data);
    } catch (error) {
      console.log("NETWORK ERROR");
    }
  };

  useEffect(() => {
    fetchRules(); // Fetch rules on component mount
  }, []);

  const createRule = async () => {
    const res = await fetch('http://localhost:3001/api/rules/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rule })
    });

    const data = await res.json();

    if (res.ok) { // Check if the response is successful
      alert(`Rule created with ID: ${data.id}`);
      setRule(''); // Clear the input field after creation
      fetchRules(); // Fetch updated rules
    } else {
      alert(`Error: ${data.error}`); // Show an error if creation failed
    }
  };

  const combineRules = async () => {
    const ids = selectedRuleIds.map(Number); // Convert selected rule IDs to numbers
    const operators = selectedOperators; // Get selected operators

    const res = await fetch('http://localhost:3001/api/rules/combine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleIds: ids, operators }) // Include operators in the request
    });

    const data = await res.json();
    console.log(data.combinedAST);
  };

  const evaluateRule = async () => {
    const evaluationData = { age: parseInt(age), department, income: parseInt(income) };
    const res = await fetch(`http://localhost:3001/api/rules/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId: selectedEvaluationRuleId, data: evaluationData }) // Use selected ruleId
    });
    const data = await res.json();
    setResult(data.result ? 'True' : 'False');
  };

  // Function to handle adding a new dropdown
  const addDropdown = () => {
    setSelectedRuleIds([...selectedRuleIds, '']); // Add a new empty string for the new dropdown
    setSelectedOperators([...selectedOperators, 'AND']); // Default operator for new dropdown
  };

  // Function to handle rule selection from dropdowns
  const handleRuleChange = (index, value) => {
    const updatedIds = [...selectedRuleIds];
    updatedIds[index] = value; // Update the specific index
    setSelectedRuleIds(updatedIds);
  };

  // Function to handle operator selection from radio buttons
  const handleOperatorChange = (index, value) => {
    const updatedOperators = [...selectedOperators];
    updatedOperators[index] = value; // Update the specific index
    setSelectedOperators(updatedOperators);
    console.log('Updated Operators:', updatedOperators); // Debugging line
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '50px auto',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
      fontSize: '2rem',
    },
    section: {
      marginBottom: '30px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    button: {
      display: 'inline-block',
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginRight: '10px',
    },
    result: {
      marginTop: '10px',
      fontSize: '1.25rem',
      color: '#333',
    },
    dropdown: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    operatorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    operator: {
      marginRight: '10px',
      fontSize: '1rem',
    },
    radioButton: {
      marginRight: '5px',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Rule Engine</h1>

      <div style={styles.section}>
        <h2>Create Rule</h2>
        <input
          value={rule}
          onChange={e => setRule(e.target.value)}
          placeholder="Enter rule string"
          style={styles.input}
        />
        <button onClick={createRule} style={styles.button}>Create</button>
      </div>

      <div style={styles.section}>
        <h2>Combine Rules</h2>
        {selectedRuleIds.map((ruleId, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <select
              value={ruleId}
              onChange={e => handleRuleChange(index, e.target.value)}
              style={styles.dropdown}
            >
              <option value="">Select a rule</option>
              {rules.map(rule => (
                <option key={rule.id} value={rule.id}>
                  {rule.name} (ID: {rule.id})
                </option>
              ))}
            </select>

            {/* Radio Buttons for Operators */}
            {index < selectedRuleIds.length - 1 && (
              <div style={styles.operatorContainer}>
                <label style={styles.operator}>
                  <input
                    type="radio"
                    name={`operator-${index}`}
                    value="AND"
                    checked={selectedOperators[index] === 'AND'}
                    onChange={() => handleOperatorChange(index, 'AND')}
                    style={styles.radioButton}
                  />
                  AND
                </label>
                <label style={styles.operator}>
                  <input
                    type="radio"
                    name={`operator-${index}`}
                    value="OR"
                    checked={selectedOperators[index] === 'OR'}
                    onChange={() => handleOperatorChange(index, 'OR')}
                    style={styles.radioButton}
                  />
                  OR
                </label>
              </div>
            )}
          </div>
        ))}
        <button onClick={addDropdown} style={styles.button}>+</button>
        <button onClick={combineRules} style={styles.button}>Combine</button>
      </div>

      <div style={styles.section}>
        <h2>Evaluate Rule</h2>
        <select
          value={selectedEvaluationRuleId}
          onChange={e => setSelectedEvaluationRuleId(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">Select a rule to evaluate</option>
          {rules.map(rule => (
            <option key={rule.id} value={rule.id}>
              {rule.name} (ID: {rule.id})
            </option>
          ))}
        </select>
        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="Enter age"
          style={styles.input}
        />
        <input
          value={department}
          onChange={e => setDepartment(e.target.value)}
          placeholder="Enter department"
          style={styles.input}
        />
        <input
          type="number"
          value={income}
          onChange={e => setIncome(e.target.value)}
          placeholder="Enter income"
          style={styles.input}
        />
        <button onClick={evaluateRule} style={styles.button}>Evaluate</button>
        <p style={styles.result}>Result: {result}</p>
      </div>
    </div>
  );
};

export default App;
