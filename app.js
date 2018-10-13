/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');

AWS.config.update({region:'us-east-1'});
var dynamoDb = new AWS.DynamoDB.DocumentClient();

var dataParams = {
  TableName: 'ExampleDynamoTable',
  Key: { "ItemCode": "BUI" }
};

const GetNewHelloWorld = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'DefineItemIntent';
  },
  handle(handlerInput) {
    let text = "hello";
    return handlerInput.responseBuilder.speak(text).getResponse();
  }
};

const GetDatabaseFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    if (request.type !== 'IntentRequest'){ return false; }
  
    //look up value in database
    var isValueInDatabase = false;
    //is request.intent.name in list?
    
    return isValueInDatabase;
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + " " + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  }
};

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  async handle(handlerInput) {
    console.log("Enter handler");
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    //const speechOutput = GET_FACT_MESSAGE + " " + counter++ + " " + randomFact;

    console.log("Start database getItem");
    console.log(dataParams);
    var speechOutput = await dynamoDb.get(dataParams).promise();
    console.log(speechOutput);
    console.log(speechOutput.Item);
    console.log(speechOutput.Item.ItemDescription);
    //console.log(JSON.stringify(speechOutput));
    speechOutput = speechOutput.Item.ItemDescription;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
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
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
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

const SKILL_NAME = 'Space Fact';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'A year on Mercury is just 88 days long.',
  'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
  'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
  'On Mars, the Sun appears about half the size as it does on Earth.',
  'Earth is the only planet not named after a god.',
  'Jupiter has the shortest day of all the planets.',
  'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
  'The Sun contains 99.86% of the mass in the Solar System.',
  'The Sun is an almost perfect sphere.',
  'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
  'Saturn radiates two and a half times more energy into space than it receives from the sun.',
  'The temperature inside the Sun can reach 15 million degrees Celsius.',
  'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    GetNewHelloWorld,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();


/*
const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');

const skillBuilder = Alexa.SkillBuilders.standard();
AWS.config.update({region:'us-east-1'});
var dynamoDb = new AWS.DynamoDB.DocumentClient();

var dataParams = {
  TableName: 'DescriptionIntent',
  Key: { "IntentName": "BUI" }
}

var msg = 'Hello World';
console.log(msg);
*/