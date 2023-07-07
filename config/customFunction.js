module.exports = {
    isUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        else{
            res.redirect('/auth');
        }
    }, 

    loggedIn: (req, res, next) => {
        if(req.session.loggedin || req.session.email){
            req.session.save();
            next();
        }else{
            res.redirect('/auth');
        }
    },


    isEmpty: function(obj) {
        for (let key in obj) {
            if(obj.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    },

    // Helper function to send activation email
    sendConfirmationxxx: async function sendActivationEmail(email, activationLink) {
        var transporter = nodemailer.createTransport({
            host: 'mail.jobatrac.com.ng',
            port: 465,
            secure: true,
            auth: {
                user: 'info@jobatrac.com.ng',
                pass: 'data052gem154.com'
            }
        });

        var mailOptions = {
            from: 'esiri@leeroy.com',
            to: 'osajayabs@gmail.com, caffeinnacreatives@gmail.com',
            subject: 'Testing Mailer',
            text: 'Thank you for your testing . We are delighted by your interest and at the moment, we are looking into the information you provided to us during your application. We usually do this to verify the authenticity of prospective users and to protect our existing and future user. This process usually takes any where from one hour to three working days. Once this is done, we will notify you by mail along with instructions on how to access your Jobatrac account with all the features enabled to help you get the very best out of your recruitment process with minimal effort. In the meantime, you can reach us on +2348028910431 or hello@jobatrac.com.ng should you have any question or comment. Thanks once again and see you soon'
        };

        transporter.sendMail(mailOptions, function(err, info){
            if (err) throw err;
        })
    },
    // Helper function to send activation email
    sendConfirmation: async function sendActivationEmail(email, activationLink) {
        try {
        // Create a transporter using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'smpt.zoho.com',
            port: 465,
            secure: true,
            auth: {
            user: 'noreply@rezeet.io',
            pass: 'Rezeet321!',
            },
        });
    
        // Send email using the transporter
        await transporter.sendMail({
            from: 'noreply@rezeet.io',
            to: email,
            subject: 'Account Activation',
            html: `<p>Please click the following link to activate your account:</p><a href="${activationLink}">${activationLink}</a>`,
        });
    
        console.log('Activation email sent successfully.');
        } catch (error) {
        throw new Error('Failed to send activation email');
        }
    }

}