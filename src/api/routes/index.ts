import { Request, Response, Router } from 'express';
import apiV1Router from './v1/index';
import { StatusCodes } from '@base/constants/status-code';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({
		success: true,
		message: 'Application',
	});
});

router.use(`/api/`, apiV1Router);

export default router;
