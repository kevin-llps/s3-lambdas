import { parse } from "csv-parse";

export const processS3Object = (s3ObjectPromise, functionToApplyOnEvents, callback) => {
    const events = [];

    s3ObjectPromise.then(data => {
        data.Body.pipe(parse({ delimiter: ';', from_line: 2 }))
        .on("data", event => addEvent(event, events))
        .on("error", err => {
            console.log("An error occured during csv parsing", err);
            callback(err);
        })
        .on("end", () => {
            functionToApplyOnEvents(events);

            console.log("events", events);
            callback(null, events);
        });
    }).catch(err => {
        console.log(err);
        callback(err);
    });
};

const addEvent = (event, events) => {
    events.push({
        speakerEmail: event[5],
        title: event[0],
        date: event[3],
        hour: event[4]
    });
};