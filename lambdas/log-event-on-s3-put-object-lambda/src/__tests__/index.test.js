const index = require('../index');
const fs = require('fs');

describe('Handler', () => {
    it('given event should run handler successfully', () => {
        const eventRequest = fs.readFileSync('eventRequest.json');
        const event = JSON.parse(eventRequest);

        index.handler(event, null);
    });
});