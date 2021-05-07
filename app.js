#!/usr/bin/env node
// npm packages import
const express = require("express"); // express server
const fs = require("fs"); // for file system
const chalk = require("chalk"); // to colorize to the output
const clear = require("clear"); // to clear the console
const ora = require("ora"); // for animations
const boxen = require("boxen"); // Output in a box
const { Command } = require("commander"); // for command line args
// const CLI = require('clui') // for animation (not used anymore)

// Other imports
const {
    testCaseFolderName,
    inputFileNamePrefix,
    outputFileNamePrefix,
    PORT,
} = require("./settings.json");
const { version, author, bin, description } = require("./package.json");
const { testGenerator, directoryGenerator } = require("./lib/generator");
const { yellow } = require("chalk");

const program = new Command(); // creating a new program for command line arguments
program.version(version); // setting the version of the program
program.name("download");
program.description(description);
program
    .option(
        "-f, --folder <value>",
        "Custom folder to keep the parsed test cases",
        testCaseFolderName
    )
    .option(
        "-i, --input <value>",
        "File name prefix of the input file",
        inputFileNamePrefix
    )
    .option(
        "-o, --output <value>",
        "File name prefix of the output file",
        outputFileNamePrefix
    )
    .parse();

// global variables
const app = express();

const Spinner = ora({
    text: chalk.gray.bold(`Waiting for Test Cases to arrive...`),
    spinner: "dots12",
});
Spinner.color = 'yellow';
const currentDirectory = process.cwd();
const testCaseDirectory = currentDirectory + "/" + program.opts().folder;

clear();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Connection Established");
});

app.post("/", (req, res) => {
    // Spinner.stop();
    let { name, tests, url } = req.body;
    Spinner.succeed(`Got ${tests.length} test cases!`);
    directoryGenerator(testCaseDirectory, program.opts().folder, inputFileNamePrefix, outputFileNamePrefix);
    testGenerator(
        tests,
        program.opts().input,
        program.opts().output,
        program.opts().folder,
        name
    );
    Spinner.start();
});

app.listen(PORT, () => {
    console.log(
        boxen(
            chalk`{bold CP Problem Downloader} {yellowBright v${version}}\nby {blueBright ${author}}`,
            {
                padding: {
                    top: 1,
                    left: 8,
                    right: 8,
                    bottom: 1,
                },
                borderColor: "yellowBright",
                borderStyle: "double",
                dimBorder: true,
                margin: {
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 1,
                },
                backgroundColor: "black",
                align: "center",
            }
        )
    );
    console.log(
        boxen(
            `folder: ${program.opts().folder}, input: ${
                program.opts().input
            }, output: ${program.opts().output}`,
            {
                padding: {
                    left: 1,
                    right: 1,
                    top: 0,
                    bottom: 0
                },
                borderStyle: "round"
            }
        )
    );
    Spinner.start();
});
