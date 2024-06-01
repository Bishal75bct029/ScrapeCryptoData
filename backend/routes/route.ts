import express from 'express'
import * as auth from '../controllers/auth';
import * as watchList from '../controllers/watchlist'
export const router = express.Router()

router.get('/auth/decodeToken', auth.decodeToken);
router.post('/auth/signup', auth.signUp);
router.post('/auth/login', auth.login);

router.get('/watchlist', watchList.index);
router.post('/watchlist', watchList.create);
router.put('/watchlist/:id', watchList.update);
router.delete('/watchlist/:id', watchList.destroy);