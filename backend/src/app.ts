import { getPackedSettings } from 'http2';
import { envs } from './core/config/env';
import { Server } from './server';
import { reviewGithubRepos } from './utils/githubrepo';

(() => {
	main();
})();

reviewGithubRepos('https://github.com/Okarix/react-employee-directory');

function main(): void {
	const server = new Server({
		port: envs.PORT
	});
	void server.start();
}
