import { Validation } from '../middlewares/validation.js'

export class DispatcherController {

    static serveDashboard(req, res){
        return res.sendFile('/dashboard.html', {root: './views'});
    }

    static serveForgotDataForm(req, res) {
        return res.sendFile('forgotData.html', {root: './views'})
    }

    static async serveQuestionForm(req, res) {
        const { email } = req.body
        const question = await Validation.getQuestion(email)
        return res.send(`
            <html>
            <head>
                <link rel="stylesheet" href="./app.css">
            </head>
            <body>
                <form action="sendSecretAnswer" method="post">
                    <h1>${question}</h1>
                    <input type="hidden" name="email" value="${email}">
                    <input type="text" name="answer" id="answer" placeholder="Enter Secret Answer">
                    <input type="submit" value="Verify">
                    <a href="/forgotData">Back</a>
                </form>
            </body>
            </html>
        `)
    }
}