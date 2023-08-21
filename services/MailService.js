const nodemailer = require('nodemailer')
const { SMTP_HOST, SMTP_PORT, APP_BACK, APP_ADMIN } = process.env

const SMTP_PASSWORD = 'fiepukydsxepjwtd'
const SMTP_USER = 'jdexx5005@gmail.com'

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD
            }
        })
    }

    async sendOrder(){
        try{
            await this.transporter.sendMail({
                from: SMTP_USER,
                // to: 'jdexx5005@gmail.com',
                to: SMTP_USER,
                subject: 'Order reception',
                text: '',
                html:
                    `
                    <div>
                        <h1>You have received an order/message. Pls check the admin panel</h1>
                    </div> 
                `
            })
            console.log('Success')
        }catch(err){

        }

    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: 'Account activation on svecha.am',
            text: '',
            html:
                `
                    <div>
                        <h1>To activate your account click the link</h1>
                        <a href="${APP_BACK}/api/auth/activate-email/${link}">Activate account</a>
                    </div> 
                `
        })
    }

    async sendPassForgottenMail(to, token){
        await this.transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: 'Password forgotten on svecha.am',
            text: '',
            html:
                `
                    <div>
                        <h1>To confirm your identity click the link</h1>
                        <a href="${'https://ad-saro-min.svecha.am'}/change-password/${token}">Restore Password</a>
                    </div> 
                `
        })
    }
}

module.exports = new MailService()
