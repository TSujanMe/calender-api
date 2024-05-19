import { StatusCodes } from '@base/constants/status-code';
import { Request, Response, Router } from 'express';
import { routes } from './routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({
		success: true,
		message: 'Application',
	});
});

routes.map((route) => {
	router.use(`/v1/${route.prefex}`, route.router);
});

export default router;
