import { handler } from "../index.js";
import { readFileSync } from "fs";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import "aws-sdk-client-mock-jest";
import * as processS3Object from "../processS3Object.js";
import * as sendEmailToSpeakers from "../sendEmailToSpeakers.js";

const mockedS3Client = mockClient(S3Client);

describe('Handler', () => {
    beforeEach(() => {
        mockedS3Client.reset();
    });

    it.each`
        eventRequestFileName                      | key
        ${"eventRequest.json"}                    | ${"conference-events.csv"} 
        ${"eventRequestWithLongerKeyPath.json"}   | ${"subFolder/conference-events.csv"} 
    `('given event $eventRequestFileName should run handler successfully', ({eventRequestFileName, key}) => {
        const eventRequest = readFileSync(eventRequestFileName);
        const event = JSON.parse(eventRequest);
        const context = { callbackWaitsForEmptyEventLoop : true };

        const s3ObjectPromise = new Promise(resolve => jest.fn());
        const processS3ObjectSpy = jest.spyOn(processS3Object, 'processS3Object').mockImplementation((s3ObjectPromise, functionToApplyOnEvents, callback) => callback(null, "events"));
        const sendEmailToSpeakersSpy = jest.spyOn(sendEmailToSpeakers, 'sendEmailToSpeakers').mockImplementation(events => jest.fn());
        const callback = jest.fn((err, event) => event);

        mockedS3Client.on(GetObjectCommand, {
            Bucket: "my-bucket",
            Key: key
        }).resolves({ 
            Body: s3ObjectPromise
        });

        handler(event, context, callback);
        
        expect(context.callbackWaitsForEmptyEventLoop).toBeFalsy();
        expect(mockedS3Client).toHaveReceivedCommandTimes(GetObjectCommand, 1);
        expect(processS3ObjectSpy).toBeCalledWith(s3ObjectPromise, sendEmailToSpeakersSpy, callback);
        expect(callback).toBeCalledWith(null, "events");
    });
});
