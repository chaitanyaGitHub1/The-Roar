// Importing required node modules 
var http = require('http');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
var fs = require('fs');
const shell = require('shelljs');
const https = require('https');
var cron = require('node-cron');
const express = require('express');

require('dotenv').config();
// const mongoose = require('mongoose');
// const { exec } = require("child_process");

const app = express();

const port = process.env.PORT;
const api_key = process.env.API_KEY;
const mobile_numbers = process.env.MOBILE_NUMBERS

console.log(mobile_numbers);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// Running temp file manually
// Writing to Temp file only once 
// tempFile();

// function tempFile() {
//     f = "tempF.txt";
//     deleteFile(f);
//     scrape(f);
// }

// diff();
// getFinalLinks();
// swapFile();


// Run the application for every 5 minutes 

cron.schedule('*/2 * * * *', () => {
    var time = Date.now();
    console.log(time);
    console.log('running a task every 2 minutes');
    mainFile();
});



// // Writing to main file 
// mainFile();

function mainFile() {
    f = "mainF.txt"
    deleteFile(f);
    // scrape(f);
    // diff();
    // getFinalLinks();
    // swapFile();
}


// delete the file 

function deleteFile(f) {

    try {
        if (fs.existsSync('mainF.txt')) {
            console.log("The file exists.");
            file = f;
            console.log(f);
            filePath = path.join(__dirname + "/mainF.txt");
            console.log(filePath);
            fs.unlink(filePath, function (err) {
                if (err) return console.log(err);
                else scrape(f);
                console.log('file deleted successfully');
            });
        } else {
            console.log('The file does not exist.');
            scrape(f);
        }
    } catch (err) {
        console.error(err);
    }

}

// emptyMainF();
// // Swap the file main to temp 

// function emptyMainF() {
//     shell.exec('bash ./emptyMainF.sh');
// }


// Function to scrape the urls from sitemap
function scrape(f) {
    request('https://www.theroar.com.au/sitemap-posttype-video.xml', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const url = $('url');
            //  console.log(url);
            url.each((i, el) => {
                var game = "cricket";
                const item = $(el).text();
                if (i = item.match(game)) {
                    // console.log(item)
                    const loc = $(el).children('loc').text() + '\r\n';
                    // const lastMod = $(el).children('lastMod').text();
                    // console.log("URL: ", loc," Time stamp: ",lastMod);
                    fs.appendFile(
                        path.join(__dirname, '/', f), loc,
                        err => {
                            if (err) throw err;
                            else shell.exec('bash ./diff.sh');
                        }
                    );
                }
            });
            console.log('File written to...');
            getFinalLinks();

        }
    });
}


// compare two files

// function diff() {
//     shell.exec('bash ./diff.sh');
// }

// Get the links from the diff.txt 

function getFinalLinks() {
    var fs = require('fs');
    fs.readFile(process.cwd() + "/diff.txt", function (err, data) {
        if (err)
            console.log(err)
        else
            console.log(data.toString());
        var links = data.toString();
        sendNotification(links);
    });
}


function sendNotification(links) {

    console.log("The Final links : " + links);

    if (links !== "") {
        var arr = links.split("\n");

        var f_links = [];
        
        for (let i = 0; i < (arr.length - 1); i++) {
            var n = i+1;
            f_links.push(" link " + n + ": "+ arr[i] + "\n");     
        }

        // console.log("f_links : ", f_links);
        https.get(`https://manage.ibulksms.in/api/sendhttp.php?authkey=${api_key}&mobiles=${mobile_numbers}&message=${f_links}&sender=CRICSL&route=4&country=91`, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(data);
                shell.exec('bash ./swap.sh');
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    } else {
        console.log("No new links found");
    }


}


// Swap the file main to temp 

// function swapFile() {
//     shell.exec('bash ./swap.sh');
// }



// Semi-Swap process 

// Delete all the content in the temp file - [ Empty the Temp file ]
// Move the contents from the main file to temp file 
// Delete all the contents from the main file - [ Empty the Main file ]

// Never put the tempF file empty 
// always check empty mainF.txt  is placed in the directory 