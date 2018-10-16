const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
const request = require('request');

const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const skillBuilder = Alexa.SkillBuilders.standard();

AWS.config.update({ region: 'us-east-1' });
var dynamoDb = new AWS.DynamoDB.DocumentClient();

const GetNewFactHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'DefineItemIntent';
    },
    async handle(handlerInput) {
        const userInput = handlerInput.requestEnvelope.request.intent.slots.itemslot.value;
        console.log(userInput);
        var dataParams = {
            TableName: 'ExampleDynamoTable',
            Key: { "ItemCode": "BUI" }
        };

        console.log("Enter handler");
        console.log(dataParams);

        dataParams.ItemCode = "DUI";

        var speechOutput = await dynamoDb.get(dataParams).promise();

        console.log(speechOutput);
        console.log(speechOutput.Item);
        console.log(speechOutput.Item.ItemDescription);

        speechOutput = speechOutput.Item.ItemDescription;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const GetAPIExample = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'UseAPIIntent';
    },
    handle(handlerInput) {
        console.log("start handler");

        request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body.url);
            console.log(body.explanation);

            return handlerInput.responseBuilder
            .speak(body.explanation)
            .getResponse();
        });
    }
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .reprompt(HELP_REPROMPT)
            .getResponse();
    }
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.CancelIntent' ||
                request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(STOP_MESSAGE)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, an error occurred.')
            .reprompt('Sorry, an error occurred.')
            .getResponse();
    }
};

exports.handler = skillBuilder
    .addRequestHandlers(
        GetNewFactHandler,
        GetAPIExample,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();