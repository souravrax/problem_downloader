#!/usr/bin/env node
const express = require("express");
const fs = require("fs");
const rimraf = require("rimraf");
const app = express();
const figlet = require("figlet");
const chalk = require("chalk");
const clear = require("clear");
const CLI = require("clui");
const terminalLink = require("terminal-link");
const better = {};
require("better-logging")(better);

clear();
app.use(express.json());

const PORT = 10046;

app.get("/", (req, res) => {
    res.status(200).send("Connection Established");
});

const currentDirectory = process.cwd();
const testCaseDirectory = currentDirectory + "/test_cases";
const Spinner = new CLI.Spinner(
    chalk.blueBright.bold(`Listening for Test Cases ...`),
    ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]
);

app.post("/", (req, res) => {
    Spinner.stop();
    let { name: problemName, tests: allTestCases, url } = req.body;
    if (fs.existsSync(testCaseDirectory)) {
        rimraf.sync(testCaseDirectory);
    }
    fs.mkdirSync(testCaseDirectory);
    const link = terminalLink(problemName, url);

    allTestCases.forEach(({ input, output }, idx) => {
        better.log(
            chalk`{green Creating Test Case} {yellowBright.bold ${
                idx + 1
            }} {green for problem} {yellowBright.bold ${problemName}}`
        );
        fs.writeFileSync(`${testCaseDirectory}/in${idx + 1}`, input, (err) => {
            better.error(err);
        });
        fs.writeFileSync(
            `${testCaseDirectory}/out${idx + 1}`,
            output,
            (err) => {
                better.error(err);
            }
        );
    });
    Spinner.start();
});

app.listen(PORT, () => {
    console.log(chalk.white.bold(figlet.textSync("Test  Case\nGenerator", {
        whiteSpaceBreak: true,
    })));
    Spinner.start();
});
