import { Router } from "express";
import { Validation } from "./middlewares/validation.js";
import { SessionController } from "./controllers/sessionController.js";
import { DispatcherController } from "./controllers/dispatcherController.js";
import { toProcess } from "./middlewares/toProcess.js";
import { checkSession } from "./middlewares/checkSession.js";

export const router = Router();

router.post('/dashboard', Validation.authUserLogin, DispatcherController.serveDashboard)
router.get('/dashboard', (req, res) => res.redirect('/'))
router.get('/logout', SessionController.closeSession)
router.get('/forgotData', DispatcherController.serveForgotDataForm)
router.post('/sendEmail', Validation.verifyEmail, DispatcherController.serveQuestionForm)
router.post('/sendSecretAnswer', Validation.verifySecretAnswer)
router.post('/toProcess', checkSession, toProcess)
