import { Router } from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = Router();

router.get('/', extractJWT, controller.getUser);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.put('/', extractJWT, controller.update)
router.get('/all', controller.getAllUsers);
router.get('/recalculate', extractJWT, controller.recalculate);

export default router;
