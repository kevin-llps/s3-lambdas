const index = require('../index');
const fs = require('fs');
const mockSdk = require('aws-sdk-client-mock');
const s3Client = require('@aws-sdk/client-s3');

const mockedS3Client = mockSdk.mockClient(s3Client.S3Client);

describe('Handler', () => {
    beforeEach(() => {
        mockedS3Client.reset();
    });

    it('given event should run handler successfully', () => {
        const eventRequest = fs.readFileSync('eventRequest.json');
        const expectedBody = fs.readFileSync('conference-events.csv');
        const event = JSON.parse(eventRequest);

        mockedS3Client.on(s3Client.GetObjectCommand, {
            Bucket: "my-bucket",
            Key: "conference-events.csv"
        }).resolves({ 
            Body: expectedBody
        });

        index.handler(event, null);
    });
});