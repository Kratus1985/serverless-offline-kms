const Hapi = require('hapi');

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
        this.server = new Hapi.Server();
        this.server.connection({port: 4001, host: 'localhost'});

        this.server.route({
            method: 'POST',
            path: '/',
            config: {
                handler: (req, reply) => {
                    const { payload } = req;

                    let body = '';
                    payload.on('data', (chunk) => {
                        body += chunk;
                    });

                    payload.on('end', () => {
                        const payload = JSON.parse(body);
                        reply({
                            Plaintext: payload.CiphertextBlob
                        });
                    });
                },
                payload: {
                    output: 'stream',
                    parse: false
                }
            }
        });

        this.server.start().then(() => this.log(`Offline Kms Server listening on ${this.server.info.uri}`));
    }
}

module.exports = KmsOffline;