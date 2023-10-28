import { SessionController } from "../controllers/sessionController.js"

export const checkSession = (req, res, next) => {
    if(SessionController.sessionExists(req)){
        return next();
    }else{
        console.log("Session doesn't exist. Go to login")
        return res.redirect('/');
    }
}