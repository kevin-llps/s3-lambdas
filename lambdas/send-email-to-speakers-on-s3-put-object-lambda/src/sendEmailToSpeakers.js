import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesClient = new SESv2Client({ region: process.env.REGION });

export const sendEmailToSpeakers = (events) => {
    for(const event of events) {
        sesClient.send(createSendEmailCommand(event.speakerEmail, event.title, event.date, event.hour));
    }
};

const createSendEmailCommand = (speakerEmail, title, date, hour) => {
    return new SendEmailCommand({
        FromEmailAddress: process.env.SENDER_EMAIL,
        Destination: {
          ToAddresses: [
            speakerEmail
          ]
        },
        Content: {
          Simple: {
            Subject: {
                Charset: "UTF-8",
                Data: `Confirmation de votre conférence ${title}`,
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: `La conférence ${title} est bien confirmée pour le ${date} à ${truncateSeconds(hour)}`,
                }
            }
          }
        }
      });
};

const truncateSeconds = (hour) => {
    return hour.substring(0, 5);
};