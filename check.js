const { exec } = require("child_process");

// The MongoDB Data API endpoint URL
const apiEndpoint =
  "https://eu-central-1.aws.data.mongodb-api.com/app/data-xwghq/endpoint/data/v1";

// Define the curl command with the -s flag (silent)
const curlCommand = `curl -s -X GET ${apiEndpoint}`;

// Execute the curl command
exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }

  try {
    // Parse the JSON response
    const responseData = JSON.parse(stdout);

    // Log specific data from the response
    console.log("Data from MongoDB Data API:");
    console.log("Field 1:", responseData);
    console.log("Field 2:", responseData.field);

    // You can access other fields in the responseData object as needed
  } catch (parseError) {
    console.error("Error parsing JSON response:", parseError.message);
  }
});
