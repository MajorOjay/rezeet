const mysql = require('mysql');
const {connection, pool} = require('../config/config');
const nodemailer = require('nodemailer');
const path = require('path');
const multiparty = require('multiparty');
const { json } = require('body-parser');
const util = require('util');
const crypto = require("crypto");
const rand = crypto.randomBytes(4).toString("base64");
const bcrypt = require('bcryptjs');
const {sendConfirmation} = require('../config/customFunction');
const { v4: uuidv4 } = require('uuid');

module.exports  = {

    
    signup: (req, res) => {
            res.render('default/sign-up');
    },
    
    index: (req, res) => {
            res.render('default/home');
    },
    
    register: (req, res) => {
            pool.getConnection((err, connection) =>{
                
            const activationToken = uuidv4();
                if (err) throw err;
                    const mer_id = req.body.business_name +"-" + rand;
                    const merchant = {
                        merchant_id: mer_id,
                        merchant_name: req.body.business_name,
                        status: "Pending",
                        city: req.body.city,
                        address: req.body.address,
                        country: req.body.country,
                        email: req.body.bus_email,
                        phone: req.body.bus_phone,

                    }
                        const newUser = {
                            activation_code: activationToken,
                            first_name: req.body.firstName,
                            last_name: req.body.lastName,
                            email: req.body.email,
                            password: req.body.password,
                            user_type: 'Merchant',
                            status: "Pending",
                            merchant_id: mer_id,
                            merchant_name: req.body.business_name,
                            activation: 'false'
                        };                 
                        console.log("God is Awesome. I got form")
         
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                newUser.password = hash;
                                connection.query('INSERT INTO merchant SET?', merchant, (err, saved) =>{
                                    if (!err){
                                        throw err;
                                    }else{
                                        throw err;
                                    }
                                }) 

                                connection.query('INSERT INTO merchant_users SET?', newUser, (err, saved) =>{
                                    connection.release()
                                    if (!err){
                                        throw err;
                                    }else{
                                        throw err;
                                    }
                                })
                            });
                        });
                        // Create activation link
                        const activationLink = `http://localhost:5000/activate?token=${activationToken}`;
                        

                    const email = req.body.bus_email;
                    console.log(activationLink + " email is: "+email)
                        // Send activation email
                        sendConfirmation(email, activationLink)
                            .then(() => {
                            // Return response to the client
                            res.redirect('complete')
                            })
                            
                            .catch((error) => {
                            console.error('Error sending activation email:', error);
                            res.status(500).json({ message: 'it Failed to send activation email.' });
                            });
            })
        
        
                
           
    },
    
    confirm: (req, res) =>{
        res.render('default/registration/confirm')
    },
    
    complete: (req, res) =>{
        res.render('default/registration/complete')
    },
    
    invalid: (req, res) =>{
        res.render('default/registration/invalid')
    },

    
    success: (req, res) => {
        res.render('default/jobs/submit-success')
    },


    

 

// User registration route


activate: (req, res) => {
pool.getConnection((err, connection) => {
    if (err) throw err;

    const { token } = req.query;
  
    // Find user with the provided activation token in the database
    connection.query('SELECT * FROM merchant_users WHERE activation_code = ?', [token], (error, results) => {
      if (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Failed to find user.' });
      }
  
      if (results.length === 0) {
        return res.redirect('invalid')
        // Handle invalid or expired activation token
       // return res.status(400).json({ message: 'Invalid activation token.' });
      }
  
      const user = results[0];
      console.log(user.id)
      
      connection.query('UPDATE merchant_users SET activation = "true" WHERE id = ?', [user.id], (error, result) => { 
        if (error) {
            console.error('Error activating user:', error);
            return res.redirect('invalid')
          }
      });
  
      // Return response to the client
      res.redirect('complete');
    });


})
 
},

// Activation 
activateJwt: (req, res) => {
    const { code } = req.query;

  // Verify and decode the activation code using JWT
  jwt.verify(code, activationCodeSecret, (error, decoded) => {
    if (error) {
      console.error('Error decoding activation code:', error);
      return res.status(400).json({ message: 'Invalid activation code.' });
    }

    const { email } = decoded;

    // Find user with the provided email in the database
    pool.query('SELECT * FROM all_users WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Failed to find user.' });
      }

      if (results.length === 0) {
        // Handle user not found
        return res.status(400).json({ message: 'User not found.' });
      }

      const user = results[0];

      // Update user status to "activated" in the database
      // For example: pool.query('UPDATE all_users SET status = "activated" WHERE id = ?', [user.id], (error) => { ... });

      // Return response to the client
      res.json({ message: 'Account activated successfully.' });
    });
  });


},








//Initiated qr option for receipt

    qrInitiated: (req, res) => {
        const form = {
            merchant: "Walmart",
            merchant_id: 12,
            address: "45 lacre, 1st shoindede",
            date: Date.now(),
            total: 240,
            base: 2360,
            tax: 4,
            receipt_id: "#2112240",
            items: {
                1: {
                    prod: "bag",
                    unit: 2,
                    unit_price: "$22",
                    total_price: "$44",
                },
                2: {
                    prod: "shoe",
                    unit: 1,
                    unit_price: "$12",
                    total_price: "$24",
                },

            },
            scanned: "No"
        }

        const query = 'INSERT INTO orders (merchant, merchant_id, address, items, scanned) VALUES (?, ?, ?, ?, ?)';
        const values = [form.merchant, form.merchant_id, form.address, JSON.stringify(form.items), form.scanned, form.total, form.base, form.tax, form.date, form.receipt_id];

        connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving form input:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const recordId = result.insertId;
        const recordUrl = `http://localhost:7000/qr/${recordId}`;
        const updateQuery = 'UPDATE orders SET url = ? WHERE id = ?';
        connection.query(updateQuery, [recordUrl, recordId], (updateErr) => {
        if (updateErr) {
            console.error('Error updating record URL:', updateErr);
            return res.status(500).json({ error: 'Internal server error' });
        }
        })    


        // Generate QR code
        const qrCode = qr.imageSync(recordUrl, { type: 'svg' });

        return res.send({qrCode});
        });

    },


}