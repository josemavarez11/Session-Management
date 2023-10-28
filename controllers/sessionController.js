export class SessionController{

    static sessionExists(req){
        return (req.session && req.session.no_user && req.session.email_user) ? true : false
    }

    static async closeSession(req, res){
        req.session.destroy((err) => {
            if(err){
                return console.log(err);
            }
            return res.redirect('/');
        });
    }

    static createSession({req, infoUser}){
        if(this.sessionExists(req)) return false
        
        for(const key in infoUser){
            req.session[key] = infoUser[key]
        }
        console.log('--------------------------------------------------------')
        console.log(`session started for user: ${req.session.no_user}`)
        console.log('--------------------------------------------------------')
        return true;
    }
}