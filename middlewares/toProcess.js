import { Methods } from "../BO/Methods.js";
import { SecurityController } from "../controllers/securityController.js";

export const toProcess = async (req, res) => {
    const { method, object, params, module } = req.body;
    const sc = new SecurityController(req.session.no_user);
    const userProfile = await sc.getProfile();
    const requestKey = `${userProfile}_${method}_${object}_${module}`;
    if(sc.userPermissionsMap.has(requestKey)){
        Methods[method](params)
        .then(() => {
            return res.status(200).send(`Method ${method} executed.`)
        })
        .catch(err => {
            return res.status(500).send(`Error in the execution of the ${method} method: ${err}`)
        })
    }else{
        return res.status(401).send(`User ${req.session.no_user} has no access to the method ${method}.`)
    }
}