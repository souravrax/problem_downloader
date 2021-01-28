const better = {};
require('better-logging')(better);
const chalk = require('chalk');
const fs = require('fs');
const testGenerator = (
    allTestCases,
    inputFileNamePrefix,
    outputFileNamePrefix,
    testCaseDirectory,
    problemName,
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
    console.log(chalk.greenBright.bold(`${allTestCases.length} Test Cases were created\n`));
};

module.exports = testGenerator;
