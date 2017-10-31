# Flight Buddy (A Prototype)

A Node app built with MongoDB, Angular, AWS SNS and interfacing with Tesseract, OpenOCR Project. 

Presently, Tesseract can recognise various types of images, pdf and text across 100+ languages.
(You will have to manually setup the tesseract API service)

## Requirements

- [Node and npm](http://nodejs.org)
- MongoDB: Make sure you have your own local  `config/database.js`

## Installation

1. Clone the repository (Put in your Tesseract service URL, AWS SNS Account ID and Secret Key)
2. Install the application: `npm install`
3. Place your own MongoDB URI in `config/database.js`
3. Start the server: `node server.js`
4. View in browser at `http://localhost:8080`
5. After sms has been received. Use the link to access(Alternative,flightbuddy db for Identities collection)
   Will look something like:  `http://localhost:8080/verified?phone={phone number}&otp={otp sent}` 
6. OCR test images could be found in this respository.

## Screenshots

Screenshots are being stored inside `flightbuddy_screenshots` folder.

