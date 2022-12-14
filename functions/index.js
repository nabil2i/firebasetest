const functions = require("firebase-functions");

//fetch data from firestore
//define libraries
const express = require('express');
const engines = require('consolidate');
var hbs = require('handlebars');
const admin = require('firebase-admin');

//initialize the app using experss
const app = express();
//set engine as handlebars
app.engine('hbs',engines.handlebars);
//tell express that our frontend code is going to be
// inside the views folder
app.set('views','./views');
app.set('view engine','hbs');

// authorize application to access firestore DB
var serviceAccount = require("./fir-test-d98de-firebase-adminsdk-qc6b4-b870c51747.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-test-d98de.firebaseio.com"
});

//function to fetch data from firestore
async function getFirestore(){

    const firestore_con  = await admin.firestore();
        
    const writeResult = firestore_con.collection('**sample**').doc('**sample_doc**').get().then(doc => {
        
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        return doc.data();
    }
    }).catch(err => { 
        console.log('Error getting document', err);
        });
        
    return writeResult;
        
}

//create route and send the result to the frontend
app.get('/',async (request,response) => {
    var db_result = await getFirestore();
    response.render('index',{db_result});
});
            
exports.app = functions.https.onRequest(app);

//insert data into FIrestore
async function insertFormData(request){
    const writeResult = await admin.firestore().collection('form_data').add({
        firstname: request.body.firstname,
        lastname: request.body.lastname
        }).then(function() {
            console.log("Document successfully written!");
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });
}
//define route  to which HTML form will send the post request
app.post('/insert_data',async (request,response) => {
    var insert = await insertFormData(request);
    response.sendStatus(200);
});
    

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
