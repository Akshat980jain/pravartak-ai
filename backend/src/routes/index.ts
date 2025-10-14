import { Router } from 'express';
import schemes from './schemes.js';
import applications from './applications.js';
import grievances from './grievances.js';
import contact from './contact.js';
import reports from './reports.js';
import dev from './dev.js';

const router = Router();

router.use('/schemes', schemes);
router.use('/applications', applications);
router.use('/grievances', grievances);
router.use('/contact', contact);
router.use('/reports', reports);
if (process.env.NODE_ENV !== 'production') {
  router.use('/dev', dev);
}

export default router;


