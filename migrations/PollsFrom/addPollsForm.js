/**
 * name : updateUserProfileInObservationAndSubmissions.js
 * author : Priyanka Pradeep
 * created-date : 10-Nov-2022
 * Description : Migration script for update userProfile in observation
 */

const path = require('path');
let rootPath = path.join(__dirname, '../../');
require('dotenv').config({ path: rootPath + '/.env' });

let _ = require('lodash');
let url = process.env.MONGODB_URL;
let dbName = process.env.DB;
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');

(async () => {
  let connection = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let db = connection.db(dbName);

  try {
    let defaultPollCreationForm = [
      {
        field: 'name',
        label: 'Name of the Poll',
        value: '',
        visible: true,
        editable: true,
        validation: {
          required: true,
        },
        input: 'text',
      },
      {
        field: 'creator',
        label: 'Name of the Creator',
        value: '',
        visible: true,
        editable: true,
        validation: {
          required: true,
        },
        input: 'text',
      },
      {
        field: 'endDate',
        label: 'End Date',
        value: 1,
        visible: true,
        editable: true,
        validation: {
          required: true,
        },
        input: 'radio',
        options: [
          {
            value: 1,
            label: 'one day',
          },
          {
            value: 2,
            label: 'two days',
          },
          {
            value: 3,
            label: 'three days',
          },
          {
            value: 4,
            label: 'four days',
          },
          {
            value: 5,
            label: 'five days',
          },
          {
            value: 6,
            label: 'six days',
          },
          {
            value: 7,
            label: 'seven days',
          },
        ],
      },
    ];
    let pollfrom = await db.collection('forms').insertOne({
      name: 'defaultPollCreationForm',
      allowMultipleQuestions: false,
      value: defaultPollCreationForm,
    });
    let defaultPollQuestionForm = [
      {
        field: 'question',
        label: 'Question',
        value: '',
        visible: true,
        editable: true,
        validation: {
          required: true,
        },
        input: 'text',
      },
    ];

    await db.collection('forms').insertOne({
      name: 'defaultPollQuestionForm',
      value: defaultPollQuestionForm,
    });

    console.log('Inserted pollform : ', pollfrom);
    console.log('completed');
    connection.close();
  } catch (error) {
    console.log(error);
  }
})().catch((err) => console.error(err));
