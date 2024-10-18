# Rule Engine Application

## Description
A rule engine that allows users to create, combine, and evaluate rules based on user data.

## Installation Instructions
1. Clone the repository: `https://github.com/priya-nb695/rule-engine-app.git`
2. Navigate to the root directory and install dependencies: 
   
    cd rule-engine-app
    npm install

3. Navigate to the frontend directory and install dependencies
   
   cd frontend
   npm install

4. Start the backend server:
   
   npm start

5. Start the frontend app:

   cd frontend
   npm start


# Usage Instructions
Use the UI to enter rules and evaluate them.
Example rule: 

     ((age > 30 AND department == 'Sales') OR (spend > 2000)) AND department == 'Marketing'

    -- Enter this  above  Example input in Enter Rule field in UI and  click on Create Rule 
     
      age > 44 AND department == 'marketing"
    -- Add this kind of inputs in Add Rule Section and  again click on Create Rule then click on Combine Rules

        {
           "age": 40,
           "department": "Marketing",
           "spend": 2500
         }

      --Add this example data input in test Evaluation and test the Rule

# API Endpoints
POST /api/createRule: Create a new rule.
POST /api/evaluateRule: Evaluate a rule against provided data.
POST /api/combineRules: Combine multiple rules into one.

# Security Considerations
Input validation implemented to prevent injection attacks.
HTTPS should be used in production.

# Performance Considerations
Efficient parsing and evaluation of rules.
API responses are optimized to send only the necessary data.
Displays the success alert to user when creation succesful.

# Contributing
Feel free to submit pull requests or report issues.

# Technologies Used:
Javascript,React, Node.js, Express, MongoDB.

# Future Improvements
Add user authentication.
Enhance the UI for better usability.
Introduce additional rule types.

# Error Handling: 
App handles common errors usin try catch logic.
Provides  the alert messages for users about the errors.

