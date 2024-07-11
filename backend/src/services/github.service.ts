import axios, { AxiosResponse } from 'axios';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import fs from 'fs';
import path from 'path';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface Repository {
	full_name: string;
	html_url: string;
	owner: {
		login: string;
	};
}

interface FileContent {
	type: string;
	name: string;
	path: string;
	download_url: string;
}

const searchRepositories = async (repoName: string): Promise<Repository[]> => {
	try {
		const response: AxiosResponse<{ items: Repository[] }> = await axios.get(
			`${GITHUB_API_BASE_URL}/search/repositories`,
			{
				params: {
					q: repoName,
					sort: 'stars',
					order: 'desc'
				},
				headers: {
					Authorization: `token ${GITHUB_TOKEN}`
				}
			}
		);

		return response.data.items;
	} catch (error) {
		console.error('Error searching repositories:', error);
		throw error;
	}
};

const fetchRepoContents = async (repoFullName: string, path: string = ''): Promise<FileContent[]> => {
	try {
		const response: AxiosResponse<FileContent[]> = await axios.get(
			`${GITHUB_API_BASE_URL}/repos/${repoFullName}/contents/${path}`,
			{
				headers: {
					Authorization: `token ${GITHUB_TOKEN}`
				}
			}
		);

		return response.data;
	} catch (error: any) {
		console.error(`Error fetching contents for ${repoFullName} at path "${path}":`, error.message);
		throw error;
	}
};

const compareRepoCode = async (repoFullName: string, targetCode: string, path: string = ''): Promise<number[]> => {
	let similarities: number[] = [];

	try {
		const repoFiles = await fetchRepoContents(repoFullName, path);

		for (const file of repoFiles) {
			if (file.type === 'file' && file.name.endsWith('.js')) {
				const fileResponse: AxiosResponse<string> = await axios.get(file.download_url);
				const fileContent = fileResponse.data;

				const similarity = compareCodeSimilarity(fileContent, targetCode);
				similarities.push(similarity);
			} else if (file.type === 'dir') {
				const dirSimilarities = await compareRepoCode(repoFullName, targetCode, file.path);
				similarities = similarities.concat(dirSimilarities);
			}
		}
	} catch (error: any) {
		console.error(`Error comparing code for ${repoFullName}:`, error.message);
	}

	return similarities;
};

const compareCodeSimilarity = (code1: string, code2: string): number => {
	const minLength = Math.min(code1.length, code2.length);
	let commonChars = 0;

	for (let i = 0; i < minLength; i++) {
		if (code1[i] === code2[i]) {
			commonChars++;
		}
	}

	const similarityPercentage = (commonChars / minLength) * 100;
	return similarityPercentage;
};

const extractRepoInfoFromUrl = (url: string) => {
	const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
	if (match) {
		return {
			username: match[1],
			repoName: match[2]
		};
	}
	throw new Error('Invalid GitHub URL');
};

const analyzeRepository = async (username: string, repoName: string) => {
	const loader = new GithubRepoLoader(`https://github.com/${username}/${repoName}`, {
		accessToken: GITHUB_TOKEN,
		branch: 'main',
		recursive: true,
		unknown: 'warn',
		ignorePaths: [
			'.*',
			'*.md',
			'node_modules/**',
			'package-lock.json',
			'yarn.lock',
			'jest.config.ts',
			'eslint.config.mjs',
			'package.json',
			'tsconfig.json',
			'data.json'
		]
	});

	const documents = await loader.load();
	return documents;
};

const generateReport = (documents: any) => {
	let report = 'Report Summary:\n\n';

	documents.forEach((doc: any) => {
		report += `Document from ${doc.metadata.source}:\n${doc.pageContent}\n\n`;
	});

	return report;
};

const saveReportToFile = (report: string, filePath: string) => {
	const directory = path.dirname(filePath);
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
	fs.writeFileSync(filePath, report, 'utf8');
	console.log(`Report saved to ${filePath}`);
};

export const reviewGithubRepos = async (url: string, limit: number = 10) => {
	try {
		const { username, repoName } = extractRepoInfoFromUrl(url);
		const documents = await analyzeRepository(username, repoName);
		const report = generateReport(documents);
		const filePath = `./reports/${username}_report.txt`;
		saveReportToFile(report, filePath);
		const targetCode = fs.readFileSync(filePath, 'utf8');

		const repos = await searchRepositories(repoName);

		if (repos.length === 0) {
			console.log('No repositories found with the name:', repoName);
			return [];
		}

		console.log(`Found ${repos.length} repositories with the name ${repoName}:`);

		const limitedRepos = repos.slice(0, limit);

		limitedRepos.forEach((repo) => {
			console.log(`- ${repo.full_name}: ${repo.html_url}`);
		});

		const result = [];

		for (const repo of limitedRepos) {
			if (repo.owner.login !== username) {
				console.log(`\nComparing code for repository: ${repo.full_name}`);
				const similarities = await compareRepoCode(repo.full_name, targetCode);

				const totalSimilarity = similarities.length
					? (similarities.reduce((a, b) => a + b, 0) / similarities.length).toFixed(2)
					: '0.00';

				result.push({
					repoName: repo.full_name,
					repoLink: repo.html_url,
					repoSimilarity: `${totalSimilarity}%`
				});
			}
		}

		return result;
	} catch (error: any) {
		console.error('Error:', error.message);
		throw error;
	}
};
