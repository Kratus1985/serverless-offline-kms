const Hapi = require('@hapi/hapi');

class KmsOffline {
    constructor(serverless, options) {
        this.service = serverless.service;
        this.options =  options;
        this.serverless = serverless;
        this.serverlessLog = serverless.cli.log.bind(serverless.cli);

        this.hooks = {
            'before:offline:start:init': this.start.bind(this)
        };
    }

    start() {
        this.buildServer();
    }

    log(message) {
        this.serverlessLog(message);
    }

    buildServer() {
        this.server = Hapi.Server({port: 4001, host: 'localhost'});

        this.server.route({
            method: 'POST',
            path: '/',
            config: {
                handler: (req) => {
                    return new Promise((resolve) => {
                        const request = req.raw.req;

                        let body = '';
                        request.on('data', (chunk) => {
                            body += chunk;
                        });

                        request.on('end', () => {
                            const payload = JSON.parse(body);
                            resolve({
                                Plaintext: payload.CiphertextBlob
                            });
                        });
                    });
                },
                payload: {
                    output: 'stream',
                    parse: true
                }
            }
        });
        this.server.start();
    }
}

module.exports = KmsOffline;