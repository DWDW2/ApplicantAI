import { Router } from 'express';
import { reviewRepos } from '../controllers/github.controller';

const router = Router();

router.post('/review', reviewRepos);

export default router;
