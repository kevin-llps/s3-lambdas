const s3Client = require('@aws-sdk/client-s3');
const client = new s3Client.S3Client({ region: "eu-west-3" });

exports.handler = async (event, context) => {

    console.log("event = ", JSON.stringify(event));
    console.log("context = ", context);

    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const getObjectCommand = new s3Client.GetObjectCommand({ Bucket: bucket, Key: key });

    client.send(getObjectCommand);
};
