import { SessionController } from "../controllers/sessionController.js"
import { pool } from "../components/db/postgresPool.js"
import { passwordGenerator } from "../components/passwordGenerator.js"
import { sendMail } from "../components/sendMailer.js"
import { Methods } from "../BO/Methods.js"
import { verifyBlockedQuery, resetAttemptsQuery, reduceAttemptsQuery,
    getUserAttemptsQuery, setBlockedQuery, userExistsQuery,
    passwordTestQuery, verifyEmailQuery, getQuestionQuery,
    verifySecretAnswerQuery
} from "../Queries.js"

export class Validation{
    
    async resetAttempts(username){
        try {
            await pool.query(resetAttemptsQuery, [username])
        } catch (error) {
            return console.log("query error at resetAttempts", error)
        }
    }

    async reduceAttempts(username){
        try {
            await pool.query(reduceAttemptsQuery, [username])
            const data = await pool.query(getUserAttemptsQuery, [username])
            const attempts = data.rows[0].attempts
            console.log(`User ${username} will be blocked in ${attempts} attempts.`)
            if (attempts === 0) await this.setBlocked(username)
        } catch (error) {
            return console.log("query error at reduceAttempts", error)
        }
    }

    async setBlocked(username){
        try{
            await pool.query(setBlockedQuery, [username])
        }catch(error){
            return console.log("query error at setBlocked", error)
        }
    }

    async userExists(username){
        try {
            const data = await pool.query(userExistsQuery, [username])
            if (data.rows[0] === undefined) return false
            else return true
        } catch (error) {
            return console.log("query error at userExists", error)
        }
    }

    static async authUserLogin (req, res, next){
        if(req.body.username && req.body.password){
            const { username, password } = req.body
            const v = new Validation() 
            if(await v.userExists(username)){ 
                try {
                    const blockedStatus = await pool.query(verifyBlockedQuery, [username])
                    if(!blockedStatus.rows[0].blocked){
                        try {
                            const passwordTest = await pool.query(passwordTestQuery, [username, password])
                            if(passwordTest.rowCount > 0){
                                await v.resetAttempts(username)
                                SessionController.createSession({req, infoUser: passwordTest.rows[0]})
                                next();
                            }else{
                                await v.reduceAttempts(username) 
                                return res.status(401).send(`Wrong password for <strong>${username}</strong>. <a href=\'/\'>Go back and try again</a>`)
                            }
                        } catch (error) {
                            return console.log("query error at paswordTest", error)
                        }
                    }else{
                        return res.status(403).send(`User ${username} is blocked`)
                    }
                } catch (error) {
                    console.log("query error at verifyBlocked", error)
                    return
                }
            }else{
                return res.status(404).send(`User <strong>${username}</strong> does not exist. <a href=\'/\'>Go back and try again</a>`)
            }
        }else{
            return res.status(400).send(`User and password needed. <a href=\'/\'>Go back and try again</a>`)
        }
    }

    static async verifyEmail (req, res, next){
        if (req.body.email){
            const { email } = req.body
            const v = new Validation()
            try {
                const data = await pool.query(verifyEmailQuery, [email])
                if (data.rowCount > 0){
                    next()
                }else{
                    return res.status(404).send(`Email <strong>${email}</strong> does not exist. <a href=\'/forgotData\'>Go back and try again</a>`)
                }
            } catch (error) {
                console.log("query error at verifyEmail", error)
                return
            }
        }else{
            return res.status(406).send(`Email needed. <a href=\'/forgotData\'>Go back and try again</a>`)
        }
    }

    static async verifySecretAnswer(req, res){
        if(req.body.answer && req.body.email){
            const { answer, email } = req.body
            try {
                const data = await pool.query(verifySecretAnswerQuery, [email, answer])
                if (data.rowCount > 0){
                    const newPassword = passwordGenerator()
                    await sendMail({to: email, password: newPassword})
                    await Methods.changePassword([data.rows[0].no_user, newPassword])
                    return res.sendFile('PasswordSent.html', {root: './views'})
                }else{
                    return res.status(401).send(`Wrong answer. <a href=\'/forgotData\'>Go back and try again</a>`)
                }
            } catch (error) {
                console.log("query error at verifySecretAnswer", error)
                return
            }
        }else{
            return res.status(406).send(`Secret answer needed. <a href=\'/forgotData\'>Go back and try again</a>`)
        }
    }

    static async getQuestion(email){
        try {
            const data = await pool.query(getQuestionQuery, [email])
            const question = data.rows[0].secret_question
            return question
        } catch (error) {
            console.log("query error at getQuestion", error)
            return
        }
    }
}