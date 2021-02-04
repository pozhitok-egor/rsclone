import { Router } from 'express';
import transaction from '../controllers/transaction';
import account from '../controllers/account';
import extractJWT from '../middleware/extractJWT';
import user from '../controllers/user';

const router = Router();

router.get('/all', extractJWT, transaction.getAll);
router.get('/:id', extractJWT, transaction.getTransaction);
router.get('/account/:id', extractJWT, transaction.getAllFromAccount);
router.delete('/:id', extractJWT, transaction.deleteTransaction, account.recalculate, user.recalculate);
router.put('/:id', extractJWT, transaction.upgradeTransaction, account.recalculate, user.recalculate);
router.post('/', extractJWT, transaction.addTransaction, account.recalculate, user.recalculate);

export default router;
