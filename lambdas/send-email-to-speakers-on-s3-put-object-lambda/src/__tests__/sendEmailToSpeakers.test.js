import { sendEmailToSpeakers } from "../sendEmailToSpeakers.js";
import { mockClient } from "aws-sdk-client-mock";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import "aws-sdk-client-mock-jest";

const mockedSesClient = mockClient(SESv2Client);

const senderEmail = "no-reply@conference-events.fr";

describe('SendEmailToSpeakers', () => {
    beforeEach(() => {
        mockedSesClient.reset();
    });

    it('Given events should send email for each of them', () => {
        process.env.SENDER_EMAIL = senderEmail;
        const events = dataEvents();

        mockedSesClient.resolves({ 
            Body: {} 
        });

        sendEmailToSpeakers(events);

        expect(mockedSesClient).toHaveReceivedCommandTimes(SendEmailCommand, 3);
        expect(mockedSesClient).toHaveReceivedNthCommandWith(1, SendEmailCommand, sendEmailToCognitoSpeakerCommand());
        expect(mockedSesClient).toHaveReceivedNthCommandWith(2, SendEmailCommand, sendEmailToGitSpeakerCommand());
        expect(mockedSesClient).toHaveReceivedNthCommandWith(3, SendEmailCommand, sendEmailToJeeSpeakerCommand());
    });

    const dataEvents = () => {
        return [
            {
                speakerEmail: "speaker-cognito@conference-events.fr", 
                title: "AWS Cognito", 
                date: "13/10/2022",
                hour: "19:45:00"
            },
            {
                speakerEmail: "speaker-git@conference-events.fr", 
                title: "Git", 
                date: "06/09/2022",
                hour: "12:00:00"
            },
            {
                speakerEmail: "speaker-jee@conference-events.fr", 
                title: "JEE", 
                date: "11/04/2023",
                hour: "19:00:00"
            }
        ];
    };

    const sendEmailToCognitoSpeakerCommand = () => {
        return {
            FromEmailAddress: senderEmail,
            Destination: {
              ToAddresses: [
                "speaker-cognito@conference-events.fr"  
              ]
            },
            Content: {
              Simple: {  
                Subject: {
                    Charset: "UTF-8",
                    Data: `Confirmation de votre conférence AWS Cognito`,
                },
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: `La conférence AWS Cognito est bien confirmée pour le 13/10/2022 à 19:45`,
                    }
                }
              }
            }
          };
    };

    const sendEmailToGitSpeakerCommand = () => {
        return {
            FromEmailAddress: senderEmail,
            Destination: {
              ToAddresses: [
                "speaker-git@conference-events.fr"  
              ]
            },
            Content: {
              Simple: {  
                Subject: {
                    Charset: "UTF-8",
                    Data: `Confirmation de votre conférence Git`,
                },
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: `La conférence Git est bien confirmée pour le 06/09/2022 à 12:00`,
                    }
                }
              }
            }
          };
    };

    const sendEmailToJeeSpeakerCommand = () => {
        return {
            FromEmailAddress: senderEmail,
            Destination: {
              ToAddresses: [
                "speaker-jee@conference-events.fr"  
              ]
            },
            Content: {
              Simple: {  
                Subject: {
                    Charset: "UTF-8",
                    Data: `Confirmation de votre conférence JEE`,
                },
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: `La conférence JEE est bien confirmée pour le 11/04/2023 à 19:00`,
                    }
                }
              }
            }
          };
    };
});