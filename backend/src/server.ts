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
				{text: "Prompt: Evaluating Applicants for NFactorial Incubator  You are the best HR system in the world. Your main goal is to select applicants for the NFactorial incubator. You will be provided with an array of objects where each object represents an applicant's responses. Your task is to evaluate each applicant based on the following criteria:  GitHub Profile Analysis:  Check if the applicant has provided a GitHub profile link.  Evaluate the quality and relevance of their repositories.  Look for evidence of active contribution, project complexity, and adherence to coding best practices.  Programming Experience:  Evaluate the applicant's stated programming experience.  Look for specific projects or achievements that demonstrate their skills.  Consider additional skills or languages mentioned that could benefit the NFactorial incubator.  Overall Assessment:  Summarize your evaluation for each applicant based on the above criteria.  Determine if the applicant demonstrates strong programming proficiency and potential for contributing effectively to the NFactorial incubator.example input:[ { \"Отметка времени\": \"11.07.2024 5:27:01\", \"ФИО \": \"Даткаев Адиар\", \"Электронная почта\": \"datkaevadiar@gmail.com\", \"Дата рождения (Формат: ДД-ММ-ГГГГ)\": \"18-07-2003\", \"Номер телефона\": \"87472746536\", \"Уровень навыков программирования\": \"Competitive programmer\", \"Резюме (ссылка)\": \"https://mail.google.com/mail/u/0/#inbox\", \"Готовы ли вы участвовать на платной основе?\": \"Нет\", \"Telegram\": \"Okarix\", \"Ссылка на LinkedIn\": \"https://www.linkedin.com/in/adiar-datkayev-914a93237/\", \"Ссылки на социальные сети\": \"https://www.instagram.com/datkayevad/\", \"Ссылка на GitHub\": \"https://github.com/Okarix\", \"Учебное заведение\": \"Auezov University\", \"Специальность (Если есть)\": \"Computer Science\", \"Текущее место работы (Если есть)\": \"No\", \"Опишите ваш опыт программирования\": \"2 years\", \"Расскажите о ваших прошлых проектах по программированию\": \"Клон чатгпт\", \"Ваше самое большое достижение\": \"Попал сюда\", \"Доступны ли вы для работы в Алматы?\": \"Да\", \"Нуждаетесь ли вы в помощи с жильем в Алматы?\": \"Да\", \"К каким группам представителей вы относитесь?\": \"Неполная семья\" } ] "},
				{text: "[   {     \"Отметка времени\": \"11.07.2024 5:27:01\",     \"ФИО \": \"Даткаев Адиар\",     \"Электронная почта\": \"datkaevadiar@gmail.com\",     \"Дата рождения (Формат: ДД-ММ-ГГГГ)\": \"18-07-2003\",     \"Номер телефона\": \"87472746536\",     \"Уровень навыков программирования\": \"Competitive programmer\",     \"Резюме (ссылка)\": \"https://mail.google.com/mail/u/0/#inbox\",     \"Готовы ли вы участвовать на платной основе?\": \"Нет\",     \"Telegram\": \"Okarix\",     \"Ссылка на LinkedIn\": \"https://www.linkedin.com/in/adiar-datkayev-914a93237/\",     \"Ссылки на социальные сети\": \"https://www.instagram.com/datkayevad/\",     \"Ссылка на GitHub\": \"https://github.com/Okarix\",     \"Учебное заведение\": \"Auezov University\",     \"Специальность (Если есть)\": \"Computer Science\",     \"Текущее место работы (Если есть)\": \"No\",     \"Опишите ваш опыт программирования\": \"2 years\",     \"Расскажите о ваших прошлых проектах по программированию\": \"Клон чатгпт\",     \"Ваше самое большое достижение\": \"Попал сюда\",     \"Доступны ли вы для работы в Алматы?\": \"Да\",     \"Нуждаетесь ли вы в помощи с жильем в Алматы?\": \"Да\",     \"К каким группам представителей вы относитесь?\": \"Неполная семья\",     \"assessment\": {       \"github_profile\": {         \"criteria_met\": true,         \"evaluation\": \"GitHub link provided and active contributions observed.\"       },       \"programming_experience\": {         \"criteria_met\": true,         \"evaluation\": \"Experience in competitive programming with a project related to ChatGPT clone.\"       },       \"overall_assessment\": {         \"approved\": true,         \"explanation\": \"Meets all criteria: GitHub link provided, strong programming experience, and located in Almaty.\",         \"experience_level\": \"high\"       }     }   } ] "},
			  ],
			handleDataArray(dataArray, prompt) {
				if (!dataArray || dataArray.length === 0) {
					return [];
				}
				if (prompt) {
					this.MentorPrompts.push(prompt);
				}

				const parts = [
					{text: `Prompt: Evaluating Applicants for NFactorial Incubator  You are the best HR system in the world. Your main goal is to select applicants for the NFactorial incubator. You will be provided with an array of objects where each object represents an applicant's responses. Your task is to evaluate each applicant based on the following criteria:  GitHub Profile Analysis:  Check if the applicant has provided a GitHub profile link.  Evaluate the quality and relevance of their repositories.  Look for evidence of active contribution, project complexity, and adherence to coding best practices.  Programming Experience:  Evaluate the applicant's stated programming experience.  Look for specific projects or achievements that demonstrate their skills.  Consider additional skills or languages mentioned that could benefit the NFactorial incubator.  Overall Assessment:  Summarize your evaluation for each applicant based on the above criteria.  Determine if the applicant demonstrates strong programming proficiency and potential for contributing effectively to the NFactorial incubator.example input:[ { \"Отметка времени\": \"11.07.2024 5:27:01\", \"ФИО \": \"Даткаев Адиар\", \"Электронная почта\": \"datkaevadiar@gmail.com\", \"Дата рождения (Формат: ДД-ММ-ГГГГ)\": \"18-07-2003\", \"Номер телефона\": \"87472746536\", \"Уровень навыков программирования\": \"Competitive programmer\", \"Резюме (ссылка)\": \"https://mail.google.com/mail/u/0/#inbox\", \"Готовы ли вы участвовать на платной основе?\": \"Нет\", \"Telegram\": \"Okarix\", \"Ссылка на LinkedIn\": \"https://www.linkedin.com/in/adiar-datkayev-914a93237/\", \"Ссылки на социальные сети\": \"https://www.instagram.com/datkayevad/\", \"Ссылка на GitHub\": \"https://github.com/Okarix\", \"Учебное заведение\": \"Auezov University\", \"Специальность (Если есть)\": \"Computer Science\", \"Текущее место работы (Если есть)\": \"No\", \"Опишите ваш опыт программирования\": \"2 years\", \"Расскажите о ваших прошлых проектах по программированию\": \"Клон чатгпт\", \"Ваше самое большое достижение\": \"Попал сюда\", \"Доступны ли вы для работы в Алматы?\": \"Да\", \"Нуждаетесь ли вы в помощи с жильем в Алматы?\": \"Да\", \"К каким группам представителей вы относитесь?\": \"Неполная семья\" } ] ${dataArray ? JSON.stringify(dataArray) : ""} also you will have mentor instructions that you need to alsways follow: ${this.MentorPrompts ? JSON.stringify(this.MentorPrompts) : ""}`},
					{text: "[   {     \"Отметка времени\": \"11.07.2024 5:27:01\",     \"ФИО \": \"Даткаев Адиар\",     \"Электронная почта\": \"datkaevadiar@gmail.com\",     \"Дата рождения (Формат: ДД-ММ-ГГГГ)\": \"18-07-2003\",     \"Номер телефона\": \"87472746536\",     \"Уровень навыков программирования\": \"Competitive programmer\",     \"Резюме (ссылка)\": \"https://mail.google.com/mail/u/0/#inbox\",     \"Готовы ли вы участвовать на платной основе?\": \"Нет\",     \"Telegram\": \"Okarix\",     \"Ссылка на LinkedIn\": \"https://www.linkedin.com/in/adiar-datkayev-914a93237/\",     \"Ссылки на социальные сети\": \"https://www.instagram.com/datkayevad/\",     \"Ссылка на GitHub\": \"https://github.com/Okarix\",     \"Учебное заведение\": \"Auezov University\",     \"Специальность (Если есть)\": \"Computer Science\",     \"Текущее место работы (Если есть)\": \"No\",     \"Опишите ваш опыт программирования\": \"2 years\",     \"Расскажите о ваших прошлых проектах по программированию\": \"Клон чатгпт\",     \"Ваше самое большое достижение\": \"Попал сюда\",     \"Доступны ли вы для работы в Алматы?\": \"Да\",     \"Нуждаетесь ли вы в помощи с жильем в Алматы?\": \"Да\",     \"К каким группам представителей вы относитесь?\": \"Неполная семья\",     \"assessment\": {       \"github_profile\": {         \"criteria_met\": true,         \"evaluation\": \"GitHub link provided and active contributions observed.\"       },       \"programming_experience\": {         \"criteria_met\": true,         \"evaluation\": \"Experience in competitive programming with a project related to ChatGPT clone.\"       },       \"overall_assessment\": {         \"approved\": true,         \"explanation\": \"Meets all criteria: GitHub link provided, strong programming experience, and located in Almaty.\",         \"experience_level\": \"high\"       }     }   } ] "},
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
