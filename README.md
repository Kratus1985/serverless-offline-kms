### Project forked from https://github.com/marconi1992/serverless-offline-lambda

# serverless-offline-kms

This [Serverless](https://github.com/serverless/serverless) plugin extends [serverless-offline](https://github.com/dherault/serverless-offline) to emulates [AWS KMS](https://aws.amazon.com/kms) Invocations on your local machine to speed up your development cycles. To do so, it starts an HTTP server to invoke KMS using the [AWS SDK](https://github.com/aws/aws-sdk-js).
This going to return the same value that you pass as parameter.

## Installation

First, add Serverless Plugin to your project:

`npm install serverless-offline-kms --save-dev`

Then inside your project's `serverless.yml` file add following entry to the plugins section: `serverless-offline-kms`. If there is no plugin section you will need to add it to the file.

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
'use strict';

const {KMSClient, DecryptCommand} = require('@aws-sdk/client-kms');

module.exports.hello = async (event) => {

    const kms = new KMSClient({
        endpoint: "http://localhost:4001",
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'ACCESS_KEY_ID',
            secretAccessKey: 'SECRET_ACCESS_KEY'
        }
    });

    const command = new DecryptCommand({
        CiphertextBlob: new Uint8Array(100)
    });

    const response = await kms.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v3.0! Your function executed successfully!',
                input: event,
                data: response
            },
            null,
            2
        ),
    };
};

```
