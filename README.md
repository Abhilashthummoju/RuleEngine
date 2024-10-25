# RuleEngine

1. Overview

This project implements a rule engine that determines user eligibility based on various attributes such as age, department, income, and spend. The system uses an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic rule creation, modification, and evaluation.

2. Features

AST Representation: Rules are represented as ASTs with nodes for operators (AND, OR) and operands (conditions).
Dynamic Rule Modification: Supports changes to the rules via a flexible data structure.
Rule Evaluation: Evaluates rules against user data to determine eligibility.
Combining Rules: Allows for efficient combination of multiple rules to form complex logic.
Error Handling and Validations: Includes error handling for invalid rules and data formats.
Technologies
Frontend: React.js
Backend: Node.js with Express
Database: SQLite for storing rules and application metadata


3. clone the repository

git clone https://github.com/yourusername/rule-engine.git
cd rule-engine

4. Install dependencies

cd backend
npm install

run the backend server -> node server.js

5. frontend

cd frontend
npm install

run the frontend server -> npm start
