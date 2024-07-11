import express, { type Request, type Response } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import GoogleApiRoute from './routes/googleapi.route';
import cors from 'cors';
import { HttpCode, ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants/index';
import { logger } from './logger';
import GithubApiRoute from './routes/github.route';
interface ServerOptions {
	port: number;
}

export class Server {
	private readonly app = express();
	private readonly port: number;
	constructor(options: ServerOptions) {
		const { port } = options;
		this.port = port;
	}

	async start(): Promise<void> {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(compression());
		this.app.use(cors());
		this.app.use(logger);
		global.__GLOBAL_VAR__ = {
			Prompt: [
				{
					text: `input:ystem Prompt:You are the best HR system in the world. Your main goal is to select applicants for the NFactorial incubator. You will be provided with an array of objects where each object represents an applicant's responses. Your task is to evaluate each applicant based on the following criteria:Each applicant must have a GitHub link.Each applicant must provide a description of their programming experience.Each applicant must be located in Almaty.Additionally, evaluate the level of programming experience based on the description provided:If the experience is less than 1 year, classify it as \"small\".If the experience is between 1 and 3 years, classify it as \"middle\".If the experience is more than 3 years, classify it as \"high\".For each applicant, follow these steps:If all criteria are met, append a key approved with the value true to their JSON object.If any criteria are not met, append a key approved with the value false to their JSON object.Append a key explanation with a detailed explanation of your decision for each applicant, outlining which criteria were met or not met.Append a key experience_level with the value small, middle, or high based on the provided programming experience.The input will be an array of JSON objects, and the output should be the same array with the additional approved, explanation, and experience_level keys for each applicant.Example Input:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\"     } ]  Example Output:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\",         \"approved\": true,         \"explanation\": \"All criteria met: GitHub link provided, programming experience described, and located in Almaty.\",         \"experience_level\": \"high\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\",         \"approved\": false,         \"explanation\": \"Criteria not met: No GitHub link provided, located in Astana.\",         \"experience_level\": \"middle\"     } ] `
				},
				{
					text: ' example output:   [     {         "name": "John Doe",         "github": "https://github.com/johndoe",         "experience": "3 years of web development",         "location": "Almaty",         "approved": true,         "explanation": "All criteria met: GitHub link provided, programming experience described, and located in Almaty."     },     {         "name": "Jane Smith",         "github": "",         "experience": "2 years of data science",         "location": "Astana",         "approved": false,         "explanation": "Criteria not met: No GitHub link provided, located in Astana."     } '
				}
			],
			handleDataArray(dataArray, prompt) {
				if (!dataArray || dataArray.length === 0) {
					return [];
				}
				if (prompt) {
					this.MentorPrompts.push(prompt);
				}

				const parts = [
					{
						text: `input:ystem Prompt:You are the best HR system in the world. Your main goal is to select applicants for the NFactorial incubator. You will be provided with an array of objects where each object represents an applicant's responses. Your task is to evaluate each applicant based on the following criteria:Each applicant must have a GitHub link.Each applicant must provide a description of their programming experience.Each applicant must be located in Almaty.Additionally, evaluate the level of programming experience based on the description provided:If the experience is less than 1 year, classify it as \"small\".If the experience is between 1 and 3 years, classify it as \"middle\".If the experience is more than 3 years, classify it as \"high\".For each applicant, follow these steps:If all criteria are met, append a key approved with the value true to their JSON object.If any criteria are not met, append a key approved with the value false to their JSON object.Append a key explanation with a detailed explanation of your decision for each applicant, outlining which criteria were met or not met.Append a key experience_level with the value small, middle, or high based on the provided programming experience.The input will be an array of JSON objects, and the output should be the same array with the additional approved, explanation, and experience_level keys for each applicant.Example Input:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\"     } ]  Example Output:  [     {         \"name\": \"John Doe\",         \"github\": \"https://github.com/johndoe\",         \"experience\": \"3 years of web development\",         \"location\": \"Almaty\",         \"approved\": true,         \"explanation\": \"All criteria met: GitHub link provided, programming experience described, and located in Almaty.\",         \"experience_level\": \"high\"     },     {         \"name\": \"Jane Smith\",         \"github\": \"\",         \"experience\": \"2 years of data science\",         \"location\": \"Astana\",         \"approved\": false,         \"explanation\": \"Criteria not met: No GitHub link provided, located in Astana.\",         \"experience_level\": \"middle\"     } ] ${
							dataArray ? JSON.stringify(dataArray) : ''
						} there will be additional instructions from mentor that you need to ALWAYS follow: ${
							this.MentorPrompts.length > 0 ? JSON.stringify(this.MentorPrompts) : ''
						}`
					},
					{
						text: ' example output:   [     {         "name": "John Doe",         "github": "https://github.com/johndoe",         "experience": "3 years of web development",         "location": "Almaty",         "approved": true,         "explanation": "All criteria met: GitHub link provided, programming experience described, and located in Almaty."     },     {         "name": "Jane Smith",         "github": "",         "experience": "2 years of data science",         "location": "Astana",         "approved": false,         "explanation": "Criteria not met: No GitHub link provided, located in Astana."     } '
					}
				];
				this.Prompt = parts;
			},
			MentorPrompts: []
		};
		this.app.use('/google', GoogleApiRoute);
		this.app.use('/github', GithubApiRoute);
		this.app.get('/health', (_req: Request, res: Response) => {
			return res.status(HttpCode.OK).send({
				message: globalThis.__GLOBAL_VAR__.Prompt
			});
		});

		this.app.get('/error', (_req: Request, res: Response) => {
			return res.status(HttpCode.INTERNAL_SERVER_ERROR).send({
				message: 'Internal Server Error'
			});
		});

		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}...`);
		});
	}
}
