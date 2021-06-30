const fs = require("fs"); // for file system
const chalk = require("chalk"); // to colorize the output
const better = {};
require("better-logging")(better); // for better logging

/**
 *
 * @param {Array} allTestCases
 * @param {String} inputFileNamePrefix
 * @param {String} outputFileNamePrefix
 * @param {String} testCaseDirectory
 * @param {String} problemName
 * @returns {void}
 */
const createTests = (cwd, tests, inputPrefix, outputPrefix) => {
    tests.forEach(({ input, output }, idx) => {
        fs.writeFileSync(`${cwd}/${inputPrefix}${idx + 1}`, input, (err) => {
            better.error(err);
        });
        fs.writeFileSync(`${cwd}/${outputPrefix}${idx + 1}`, output, (err) => {
            better.error(err);
        });
    });
    console.log(
        chalk.greenBright.bold(`${tests.length} Test Cases were created\n`)
    );
};

module.exports = {
    createTests,
};
