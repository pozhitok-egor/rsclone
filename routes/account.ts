import { Router } from 'express';
import account from '../controllers/account';
import user from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = Router();

router.get('/all', extractJWT, account.getAll);
router.get('/:id', extractJWT, account.getAccount);
router.delete('/:id', extractJWT, account.deleteAccount, user.recalculate);
router.put('/:id',extractJWT, account.upgradeAccount, user.recalculate);
router.post('/', extractJWT, account.addAccount, user.recalculate);

export default router;
