var Identity = require('./models/identity');
var Linkedflight = require('./models/linkedflights');
var AWS = require('aws-sdk');
var rndm = require('rndm');
var path = require('path');
var request = require('request');

//AWS config set-up
AWS.config.update({
        accessKeyId: "YOUR AWS ACCESS KEY",
        secretAccessKey: "YOUR AWS SECRET ACCESS KEY",
        region: "us-east-1"
    });


var sns = new AWS.SNS();

module.exports = function (app) {

    //Post phone number for SMS verification purpose
    app.post('/sms/verify',function(req,res){
    	var phone = req.body.text;
    	var otpStr = rndm(16);
        var url = "http://localhost:8080/";

    	if(phone != undefined && phone != "" && /^[0-9]{8,8}$/.test(phone)){
    		//Check if identity existed
    		Identity.findOne({"phone_number": req.body.text}, function (err, identity) {
	            if (!err){
	            	//Creates one if identity is not being found
	            	if(!identity){
	            		Identity.create({
				            phone_number: req.body.text,
				            otp: otpStr
				        }, function (err, identity) {
				            if (err){
				                res.send(false);
				            }else{
                                var welcomeMsg = {
                                    Message: 'Welcome to Flight-Buddy. Please follow the link to your profile!',
                                    MessageStructure: 'text',
                                    PhoneNumber: '+65'+phone
                                };
				            	var redirectLink = {
						            Message: url+'verified?phone='+phone+'&otp='+otpStr,
						            MessageStructure: 'text',
						            PhoneNumber: '+65'+phone
						        };

                                sns.publish(welcomeMsg, function(err, data) {
                                    if (err) res.send(false); // an error occurred
                                    else {
                                        sns.publish(redirectLink, function(err, data2) {
                                            if (err) res.send(false); // an error occurred
                                            else     res.send(true);  // successful response
                                        });
                                    }  
                                });
						        
						        
				            }
				        });
	            	}else{
                        //An account has already existed. 
                        identity.otp = otpStr;

                        identity.save(function (err) {
                            if(err) {
                                res.send(false);
                            }else{
                                var welcomeMsg = {
                                    Message: 'You have been verified. Please follow the link to your profile!',
                                    MessageStructure: 'text',
                                    PhoneNumber: '+65'+phone
                                };
                                var redirectLink = {
                                    Message: url+'verified?phone='+phone+'&otp='+otpStr,
                                    MessageStructure: 'text',
                                    PhoneNumber: '+65'+phone
                                };

                                sns.publish(welcomeMsg, function(err, data) {
                                    if (err) res.send(false); // an error occurred
                                    else {
                                        sns.publish(redirectLink, function(err, data2) {
                                            if (err) res.send(false); // an error occurred
                                            else     res.send(true);  // successful response
                                        });
                                    }  
                                });
                            }
                        });
                    }
	                
	            }else{
	            	res.send(false);
	            }
	        });

    		
	    }else{
	    	res.send(false);
	    }

    });

    //Authenticates user
    app.post('/auth/user',function(req,res){
        var cred = req.body;
        Identity.findOne({"phone_number": cred.phone,"otp":cred.otp}, function (err, identity) {
            if(err){
                res.send(null);
            }
            //Check if identity existed
            if(!identity){
                res.send(null);
            }else{
                res.send(identity);
            }  
        });

    });
    //Gets all flights that are greater than date
    app.post('/flight/getAll',function(req,res){

        Linkedflight.find({"phone_number": req.body.phone,"flying_date": { $gt: new Date() }}, function (err, allFlights) {
            
            if(err){
                res.send(null);
            }else{
                res.send(allFlights);
            }
        });
    });

    //Add flight manually
    app.post('/flight/addmanual',function(req,res){
        Linkedflight.create({
                            phone_number: req.body.phone,
                            flight_no: req.body.flightNo
                        }, function (err, linkedflight) {
                             if (err){
                                res.send(false);
                            }else{
                                res.send(true);
                            }

                        });
    });

    //Add flight through Team Om's Tesseract OCR 
    app.post('/flight/addocr',function(req,res){
        //Http post call to Tesseract for OCR service
        var base64arr = req.body.base64str.split(",");

        request({
            //Change this URL to tesseract URL service
            url:"http://13.229.100.113:9292/ocr",
            json: true, 
            method:"POST",
            body:  { img_base64: base64arr[1] } },
            function (error, response, body) {

                if(error){
                    res.send(false);
                }

                if (!error && response.statusCode == 200) {
                    if(body==undefined){
                        res.send(false);
                    }else{
                        //Add to MongoDB, the flight linked to user
                        var flightArr = body.split(":");
                        var flightNo;

                        if(flightArr.length == 2){
                            flightNo =flightArr[1];
                        }else{
                            flightNo =flightArr[0];
                        }

                        Linkedflight.create({
                            phone_number: req.body.phone,
                            flight_no: flightNo
                        }, function (err, linkedflight) {
                             if (err){
                                res.send(body);
                            }else{
                                res.send(body);
                            }

                        });

                        
                    }
                    
                }
            }
        );
        
    });

    // application routes
    //By default it will go here
    app.get('/', function (req, res) {
        //res.sendFile(__dirname + '/public/index.html'); 
        res.sendFile(path.resolve('./public/index.html'));
    });

    //Re-route if users come from 
    app.get('/verified', function (req, res) {
        
        res.sendFile(path.resolve('./public/main.html'));
        
    });

};
