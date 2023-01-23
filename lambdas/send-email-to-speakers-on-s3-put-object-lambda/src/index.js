import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { processS3Object } from "./processS3Object.js";
import { sendEmailToSpeakers } from "./sendEmailToSpeakers.js";

const s3Client = new S3Client({ region: process.env.REGION });

export const handler = (event, context, callback) => {

    console.log("event = ", JSON.stringify(event));
    console.log("context = ", context);

    context.callbackWaitsForEmptyEventLoop = false;

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });

    console.log("GetObjectCommand input = ", getObjectCommand.input);

    const s3ObjectPromise = s3Client.send(getObjectCommand);

    processS3Object(s3ObjectPromise, sendEmailToSpeakers, callback);
};
