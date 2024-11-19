# Jerrod's Sample DataIO Extension App

## Overview
This is a simple Node.js project used to build a proof of concept DataIO extension app

https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/data-io/

## Installation
1. Clone the repository
2. Run 'npm install' to install dependencies
3. Run 'npm run dev' to start a local server (default port 3000)
4. Use tunnelmole (or similar tool) to give your local server a public url
5. Update the endpoints in your manifest with your public url

## Notes
This project uses simulated authentication only intended for development purposes. 

In some cases, a mock result is returned instead of an error, to workaround limitations of Maestro's current error handling ability

The schemaGenerator is a rudimentary javascript function to convert our sample dataset (data.json) into the Concerto metamodel format required for Maesto extension apps. There is a CLI available here for converting more complicated datasets. 

https://concerto.accordproject.org/docs/tools/ref-concerto-cli