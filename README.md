# Project forked from https://github.com/marconi1992/serverless-offline-lambda

# serverless-offline-kms

This [Serverless](https://github.com/serverless/serverless) plugin extends [serverless-offline](https://github.com/dherault/serverless-offline) to emulates [AWS KMS](https://aws.amazon.com/kms) Invocations on your local machine to speed up your development cycles. To do so, it starts an HTTP server to invoke KMS using the [AWS SDK](https://github.com/aws/aws-sdk-js).
This going to return the same value that you pass as parameter.

## Installation

First, add Serverless Plugin to your project:

`npm install serverless-offline-kms --save-dev`

Then inside your project's `serverless.yml` file add following entry to the plugins section: `serverless-offline-lamda`. If there is no plugin section you will need to add it to the file.

It should look something like this:

```YAML
plugins:
  - serverless-offline-kms
  - serverless-offline
```

## Example

Run Serverless Offline
```
sls offline start
```

Invoke KMS using [AWS SDK](https://github.com/aws/aws-sdk-js).

```javascript
const AWS = require('aws-sdk');

const lambda = new AWS.KMS({
  region: 'localhost',
  endpoint: new Endpoint('http://localhost:4001'),
  accessKeyId: 'abcde',
  secretAccessKey: 'abcde'
});


await this.kms.decrypt({
  CiphertextBlob: 'PASSWORD'
}).promise();

```
