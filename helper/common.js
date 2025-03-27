const nodemailer = require('nodemailer')

function generateOTP() {
    let random = Math.random()
    let OTP = Math.floor(random * 900000) + 100000
    return OTP
}

async function sendMail(email, subject, text) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: true,
            auth: {
                user: 'Enter your email address',
                pass: 'Enter your password',
            },
        })
        let options = {
            from: 'noreply-mobiloitte@gmail.com', // Sender's email address
            to: email, // Replace with the recipient's email
            subject: subject,
            text: text,
        }
        return await transporter.sendMail(options)
    } catch (error) {
        console.log(error.message)
    }
}

const SuccessResponse = async (req, res, code = 200, message, data = null) => {
    return res.status(code).json({ status: 200, message, data, });
};

const ErrorResponse = async (req, res, code = 500, message, data = null) => {
    return res.status(code).json({ status: 400, message, data, });
};

module.exports = { generateOTP, sendMail, SuccessResponse, ErrorResponse }
