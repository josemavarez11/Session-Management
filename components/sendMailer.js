import { transporter } from "./mailerTransport.js";

export const sendMail = async (mailOptions) => {
    transporter.sendMail({
        from: '"Forgot Password" <donotreply@sessioncomponent.com>', // sender address
        to: mailOptions.to,
        subject: "New Password",
        html: `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #000000;
                        text-align: center;
                        padding: 20px;
                    }
                    .container {
                        background-color: #ECECF5;
                        border-radius: 5px;
                        padding: 20px;
                        margin: 0 auto;
                        max-width: 400px;
                    }
                    h1 {color: #3498DB; text-align: center;}
                    p {font-size: 16px;}
                    .password {
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                        background-color: #3498DB;
                        color: #FFFFFF;
                        border-radius: 5px;
                        padding: 10px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>New Password</h1>
                    <p>Hey, ${mailOptions.to}!</p>
                    <p>you seem to have forgotten your password, so here's a new one for you</p>
                    <div class="password">${mailOptions.password}</div>
                    <p>keep it save and don't share it with anyone</p>
                </div>
            </body>
        </html>
        `,
    })
}