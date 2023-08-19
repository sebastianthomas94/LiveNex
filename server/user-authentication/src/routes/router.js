
import {Router} from"express";
import { login } from "../services/loginServices.js";
import { signup } from "../services/signupService.js";
const router = Router();
router.post('/login',login);
router.post('/signup',signup);



export default router;