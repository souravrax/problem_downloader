const fs = require("fs"); // for file system
const chalk = require("chalk"); // to colorize the output
const rimraf = require("rimraf"); // run rf -rf

const better = {};
require("better-logging")(better); // for better logging

const directoryGenerator = (testCaseDirectory) => {
    if (fs.existsSync(testCaseDirectory)) {
        rimraf.sync(testCaseDirectory);
    }
    fs.mkdirSync(testCaseDirectory);
};

const testGenerator = (
    allTestCases,
    inputFileNamePrefix,
    outputFileNamePrefix,
    testCaseDirectory,
    problemName
) => {
    allTestCases.forEach(({ input, output }, idx) => {
        better.log(
            chalk`{green Creating Test Case} {yellowBright.bold ${
                idx + 1
            }} {green for problem} {yellowBright.bold ${problemName}}`
        );
        fs.writeFileSync(
            `${testCaseDirectory}/${inputFileNamePrefix}${idx + 1}`,
            input,
            (err) => {
                better.error(err);
            }
        );
        fs.writeFileSync(
            `${testCaseDirectory}/${outputFileNamePrefix}${idx + 1}`,
            output,
            (err) => {
                better.error(err);
            }
        );
    });
    console.log(
        chalk.greenBright.bold(
            `${allTestCases.length} Test Cases were created\n`
        )
    );
};

module.exports = {
    testGenerator,
    directoryGenerator,
};
