import express from 'express'
import * as auth from '../controllers/auth';
import * as watchList from '../controllers/watchlist'
import { isLoggedIn } from '../middleware/middleware';
import * as coins from '../controllers/coins'

export const router = express.Router()

router.post('/auth/login', auth.login);

router.get('/me', isLoggedIn, (req, res) => {
    // @ts-ignore
    return res.json(req?.user);
});

router.get('/watchlist', isLoggedIn, watchList.index);
router.post('/watchlist', isLoggedIn, watchList.create);
router.put('/watchlist/:id', isLoggedIn, watchList.update);
router.delete('/watchlist/:id', isLoggedIn, watchList.destroy);

router.get('/coins', isLoggedIn, coins.index)