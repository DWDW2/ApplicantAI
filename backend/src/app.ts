import { getPackedSettings } from 'http2';
import { envs } from './core/config/env';
import { Server } from './server';
import { mainFunc } from './utils/githubrepo';

(() => {
	main();
})();

mainFunc();

function main(): void {
	const server = new Server({
		port: envs.PORT
	});
	void server.start();
}
