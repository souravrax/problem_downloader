const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const createSafeDirectory = require("./createSafeDirectory");

function createProblem(cwd, problemName, tests, inputPrefix, outputPrefix) {
    createSafeDirectory(cwd, problemName, inputPrefix, outputPrefix);
    const directory = path.join(cwd, problemName);
    tests.forEach(({ input, output }, idx) => {
        fs.writeFileSync(
            `${directory}/${inputPrefix}${idx + 1}`,
            input,
            (err) => {
                console.error(err);
            }
        );
        fs.writeFileSync(
            `${directory}/${outputPrefix}${idx + 1}`,
            output,
            (err) => {
                console.error(err);
            }
        );
    });
    console.log(
        chalk`All the {blueBright test_cases} are generated inside {yellowBright ${problemName}}`
    );
}

module.exports = {
    createProblem,
};
