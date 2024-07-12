"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./core/config/env");
const server_1 = require("./server");
(() => {
    main();
})();
function main() {
    const server = new server_1.Server({
        port: env_1.envs.PORT
    });
    void server.start();
}
//# sourceMappingURL=app.js.map