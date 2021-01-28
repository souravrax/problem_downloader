#!/usr/bin/env node
const express = require("express");
const fs = require("fs");
const rimraf = require("rimraf");
const chalk = require("chalk");
const clear = require("clear");
const ora = require('ora');
const boxen = require("boxen");

const settings = require("./settings.json");
const testGenerator = require("./lib/generator");
// const getProblemName = require("./lib/getProblemName");

const app = express();

clear();
app.use(express.json());

const PORT = settings.PORT;

app.get("/", (req, res) => {
    res.status(200).send("Connection Established");
});

const {
    testCaseFolderName,
    inputFileNamePrefix,
    outputFileNamePrefix,
} = settings;
const currentDirectory = process.cwd();
const testCaseDirectory = currentDirectory + "/" + testCaseFolderName;

// const CLI = require('clui')
// const Spinner = new CLI.Spinner(
//     chalk.blueBright.bold(`Listening for Test Cases ...`),
//     ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]
// );

const Spinner = ora({
    text: chalk.blueBright.bold(`Waiting for Test Cases to arrive...`),
    spinner: 'dots12'
});

app.post("/", (req, res) => {
    Spinner.stop();
    let { name: problemName, tests: allTestCases, url } = req.body;
    if (fs.existsSync(testCaseDirectory)) {
        rimraf.sync(testCaseDirectory);
    }
    fs.mkdirSync(testCaseDirectory);
    testGenerator(
        allTestCases,
        inputFileNamePrefix,
        outputFileNamePrefix,
        testCaseDirectory,
        problemName
    );
    Spinner.start();
});

const {version, author} = require('./package.json');

app.listen(PORT, () => {
    console.log(
        boxen(
            chalk`{bold CP Problem Downloader} {yellowBright v${version}}\nby {blueBright ${author}}`,
            {
                padding: {
                    top: 1,
                    left: 8,
                    right: 8,
                    bottom: 1
                },
                borderColor: 'yellowBright',
                borderStyle: 'double',
                dimBorder: true,
                margin: {
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 1
                },
                backgroundColor: "black",
                align: "center"
            }
        )
    );
    Spinner.start();
});
