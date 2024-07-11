import { Request, Response } from 'express';
import { reviewGithubRepos } from '../services/github.service';

export const reviewRepos = async (req: Request, res: Response) => {
	const { url, limit } = req.body;

	try {
		const result = await reviewGithubRepos(url, limit);
		res.status(200).json(result);
	} catch (error: any) {
		console.error('Error in controller:', error.message);
		res.status(500).send('Internal Server Error');
	}
};
