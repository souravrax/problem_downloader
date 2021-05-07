const fs = require("fs"); // for file system
const chalk = require("chalk"); // to colorize the output
const { execSync } = require("child_process");

const better = {};
require("better-logging")(better); // for better logging

const directoryGenerator = (testCaseDirectory, folder, inputPrefix, outputPrefix) => {
    if (fs.existsSync(testCaseDirectory)) {
        const command = `rm -rf ${folder}/${inputPrefix}* ${folder}/${outputPrefix}*`;
        // console.log(command);
        execSync(command);
    } else {
        // console.log("Making directory");
        fs.mkdirSync(testCaseDirectory);
    }
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
