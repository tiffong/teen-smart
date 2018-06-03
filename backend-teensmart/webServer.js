const Expo = require("expo-server-sdk");
"use strict";

/* jshint node: true */

/*
 * This exports the current directory via webserver listing on a hard code (3000) port. It also
 * establishes a connection to the MongoDB named 'CS50Project'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * If using MongoDB, make sure to run "mongod" before running "node webServer.js"
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the CS50 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 */

/********************************************************************************************/
/***************************************    SET UP     **************************************/
/********************************************************************************************/

/*** INFO: "require" statements are Node.js's version of import statements ***/
var mongoose = require('mongoose');
var async = require('async');
var session = require('express-session');
var bodyParser = require('body-parser');

//MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

// Load Express
var express = require('express');
var app = express();
var notifData = [];

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us. This EXPORTS your current working directory that webServer.js is in. (__dirname)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));


/************************************************************************************************/
/*******************************     REST API Back End CALLS     ********************************/
/************************************************************************************************/
/*
 * Example #1: Simple GET Request
 * When making an AJAX GET request to the path '/', the web server responds with a simple message.
 */
app.get('/', function (request, response) {
    console.log("Index accessed");
    response.send('Simple web server of files from ' + __dirname);
});

app.post('/getProfile', (req, res) => {
    console.log("getProfile accessed");
    console.log(req.body);
    res.send(req.body);
});

app.post('/getSurvey', (req, res) => {
    console.log("getSurvey accessed");
    var data = req.body.sName;
    data = data.trim().replace(/"/g,"");
    console.log(data);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("teen-smart");
        dbo.collection("surveys").findOne({"active":true, "title":data}, function (err, response) {
            if (err) throw err;
            console.log(response);
            res.send(response);
            db.close();
        });
    });

});


app.post('/sendData', function (req, res) {
    console.log(req);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("teen-smart");
        dbo.collection("users").insertOne(req.body, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    }); 
    res.send("Done");
});


app.post('/uploadNotif', function (req, res) {

    notifsChoice = ["La Organización Mundial de Salud dice que “El uso nocivo de alcohol es un factor causal en más de 200 enfermedades y trastornos”. Evita beber este fin de semana.",
                    "¿Te vas a subir a un coche hoy? ¡Recuerda abrochar tu cinturón de seguridad!",
                    "Recuerda, ¡El poder está en ti! Si necesitas ayuda, contacta a uno de nuestros profesionales a través de www.jovensalud.com.",
                    "Eres lo que comes, así que recuerda mantener una dieta balanceada esta semana.",
                    "¿Ya hiciste ejercicio hoy? Sal y disfruta el aire fresco al bailar, correr, nadar, andar en bicicleta o disfrutar el aire fresco."
                   ]
    console.log(req.body);
    var currData = req.body;

    var CronJob = require('cron').CronJob;
    var job = new CronJob('0 */'+currData.times+' * * * *', function() {


let somePushTokens = [];
somePushTokens.push(currData.token);

// Create a new Expo SDK client
let expo = new Expo();

// Create the messages that you want to send to clents
let messages = [];
for (let pushToken of somePushTokens) {
  // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }

  // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
  messages.push({
    to: pushToken,
    sound: 'default',
    body:  notifsChoice[Math.floor(Math.random()*5)],
  })
}

// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).
let chunks = expo.chunkPushNotifications(messages);

(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log(receipts);
    } catch (error) {
      console.error(error);
    }
  }
})();



    }, null, true, 'America/Los_Angeles');
    currData.cronJob = job;

    var found = false;
    var i = 0;
    for (i = 0; i<notifData.length; i++)
    {
        if (currData.id === notifData[i].id) {found = true; break;}
    }
    if (found === false)
    {notifData.push(currData);}
    else {notifData[i].cronJob.stop(); notifData[i] = currData;}
    res.send("Done"); 
});


app.post('/registerNotifications', function (req, res) {

    console.log("Notifications accessed");
    console.log(req.body);
    console.log(JSON.parse(req.body.token).value);


let somePushTokens = [];
somePushTokens.push(JSON.parse(req.body.token).value);

// Create a new Expo SDK client
let expo = new Expo();

// Create the messages that you want to send to clents
let messages = [];
for (let pushToken of somePushTokens) {
  // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }

  // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
  messages.push({
    to: pushToken,
    sound: 'default',
    body: 'This is a test notification',
    data: { withSome: 'data' },
  })
}

// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).
let chunks = expo.chunkPushNotifications(messages);

(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log(receipts);
    } catch (error) {
      console.error(error);
    }
  }
})();

  res.send("Done");

});

//form to fill in/update surveys
app.get('/inputSurvey', function (req, res) {
    res.send("<form action='/inputSurvey' method='post'><textarea class='text' name='survey' cols='150' rows='30'></textarea><input style='display:block' type='submit' value='Submit'></form>");
});
app.post('/inputSurvey', function (req, res) {
    var rawData = req.body.survey.toString();

    var timestamp = new Date().toISOString();
    var dbInput = '{"active": true, "timestamp": "'+timestamp+'", '
    var title = ""
    var questions = "["

    console.log(typeof rawData)
    var arr = rawData.split("\n");
    for (var i = 0; i<arr.length; i++)
    {
        arr[i] = arr[i].trim()

        var titleStart = arr[i].indexOf("title:")
        if (titleStart == 0) title = arr[i].substring(6).trim();

        if (arr[i].indexOf("category:") == 0)
            if (questions == "[") questions+='{"category": "'+arr[i].substring(10).trim()+'", "subsection": [';
            else questions+=']} ] }, {"category": "'+arr[i].substring(10).trim()+'", "subsection": [';

        if (arr[i].indexOf("question:") == 0)
            if (questions.substr(questions.length - 1) == "[") questions+='{"question": "'+arr[i].substring(10).trim()+'", "answer": [';
            else questions+=']}, {"question": "'+arr[i].substring(10).trim()+'", "answer": [';

        if (arr[i].indexOf("answer:") == 0)
            if (questions.substr(questions.length - 1) == "[") questions+='"'+arr[i].substring(8).trim()+'"';
            else questions += ', "'+arr[i].substring(8).trim()+'"';

        console.log(arr[i]);
    }

    questions += "]}]}]";
    dbInput += '"title": "'+title+'", "questions": '+questions+'}'
    console.log(dbInput);
    var dbJSON = JSON.parse(dbInput);
    console.log(dbJSON);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("teen-smart");
        dbo.collection("surveys").insertOne(dbJSON, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    }); 

    res.send(dbJSON);
});



// DO NOT DELETE: Opens port for loading your webserver locally
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
