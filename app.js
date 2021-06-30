#!/usr/bin/env node
// npm packages import
const express = require("express"); // express server
const chalk = require("chalk"); // to colorize to the output
const clear = require("clear"); // to clear the console
const ora = require("ora"); // for animations
const boxen = require("boxen"); // Output in a box
const { Command } = require("commander"); // for command line args
// const CLI = require('clui') // for animation (not used anymore)

// Other imports
const {
    defaultInputPrefix,
    defaultOutputPrefix,
    PORT,
} = require("./settings.json");
const { version, author, description } = require("./package.json");

const program = new Command(); // creating a new program for command line arguments
program.version(version); // setting the version of the program
program.name("download");
program.description(description);
program
    .option(
        "-i, --input <value>",
        "File name prefix of the input file",
        defaultInputPrefix
    )
    .option(
        "-o, --output <value>",
        "File name prefix of the output file",
        defaultOutputPrefix
    )
    .option("-p, --problems [letters...]", "Specify the problem names in order")
    .option("-n, --nop <value>", "Number of problems to fetch from a contest")
    .option(
        "-w, --with_name",
        "Download the test cases in their own folder with their name"
    )
    .parse();

// global variables
const app = express();

const cwd = process.cwd();
const problems = program.opts().problems;
const numberOfProblems = program.opts().nop;
const inputPrefix = program.opts().input;
const outputPrefix = program.opts().output;

app.use(express.json());
if (problems || numberOfProblems) {
    let idx = 0;
    const limit = problems ? problems.length : numberOfProblems;
    const { createProblem } = require("./lib/createProblem");
    if (limit == 0) {
        process.exit();
    }
    clear();
    app.post("/", (req, res) => {
        const problemName = problems
            ? problems[idx]
            : String.fromCharCode(65 + idx);
        const { name, group, interactive, tests, url } = req.body;
        console.log(
            chalk`Creating {bold.yellowBright ${name}} from ${group} in the directory {bold.yellowBright ${problemName}} ${
                interactive ? chalk`({bold.redBright Interactive Problem})` : ""
            }`
        );
        console.log(chalk`{underline ${url}}`);
        console.log({
            cwd,
            problemName,
            tests,
            inputPrefix,
            outputPrefix,
        });
        createProblem(cwd, problemName, tests, inputPrefix, outputPrefix);
        if (++idx == limit) {
            console.log(
                chalk`{bold.blueBright All ${limit} problems were created}`
            );
            console.log(chalk`{redBright Exiting...}`);
            process.exit();
        }
    });

    app.listen(PORT, () => {
        console.log(
            boxen(
                chalk`{bold Contest Parser Server} {yellowBright v${version}}\nby {blueBright ${author}}`,
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
        console.log(chalk`{bold.yellowBright Creating ${limit} Problems}`);
    });
} else {
    const Spinner = ora({
        text: chalk.gray.bold(`Waiting for Test Cases to arrive...`),
        spinner: "dots12",
    });
    Spinner.color = "yellow";
    clear();
    const { createProblem } = require("./lib/createProblem");
    const { createTests } = require("./lib/createTests");
    const with_name = program.opts().with_name;
    app.post("/", (req, res) => {
        const { name, group, interactive, tests, url } = req.body;
        if (with_name) {
            createProblem(
                cwd,
                name.replace(/\s/g, ""),
                tests,
                inputPrefix,
                outputPrefix
            );
        } else {
            createTests(cwd, tests, inputPrefix, outputPrefix);
        }
    });

    app.listen(PORT, () => {
        console.log(
            boxen(
                chalk`{bold Problem Parser Server} {yellowBright v${version}}\nby {blueBright ${author}}`,
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
        // console.log(
        //     boxen(`input: ${inputPrefix}, output: ${outputPrefix}`, {
        //         padding: {
        //             left: 1,
        //             right: 1,
        //             top: 0,
        //             bottom: 0,
        //         },
        //         borderStyle: "round",
        //     })
        // );
        Spinner.start();
    });
}
