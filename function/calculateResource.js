const axios = require('axios');
const { logError } = require('../function/logError')

const hydrapanel = {
    url: process.env.PANEL_URL,
    key: process.env.PANEL_KEY
};

async function calculateResource(userID, resource) {
  let retries = 5; // Number of retry attempts
  let delay = 1000; // Initial delay in milliseconds
  
  const retryDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  while (retries > 0) {
      try {
          console.log("Starting resource calculation for user:", userID);
  
          const response = await axios.post(`${hydrapanel.url}/api/getUserInstance`, {
              userId: userID
          }, {
              headers: {
                  'x-api-key': `${hydrapanel.key}`,
                  'Content-Type': 'application/json'
              }
          });
  
          if (!response.data || !Array.isArray(response.data)) {
              throw new Error('Invalid response data format');
          }
  
          // Calculate total resources
          let totalResources = 0;
          response.data.forEach(server => {
              if (server[resource] !== undefined) {
                  let resourceValue = server[resource];
                  if (resource === 'Cpu') {
                      resourceValue *= 100;
                  }
                  totalResources += resourceValue;
              } else {
              }
          });
  
          return totalResources;
      } catch (err) {
          if (err.response && err.response.status === 429) {
              console.warn(`Rate limit reached. Retrying in ${delay / 1000} seconds...`);
              await retryDelay(delay);
              retries--;
              delay *= 2; // Exponential backoff
          } else {
              // Log errors to a file
              const errorMessage = `[LOG] Failed to calculate resources for user ${userID}. Error: ${err.message}\n`;
              logError('Failed to calculate resources for user', errorMessage);
              throw err;
          }
      }
  }
  
  throw new Error(`Failed to calculate resources for user ${userID} after multiple retries.`);
}

module.exports = { calculateResource };