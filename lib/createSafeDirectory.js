const fs = require("fs"); // for file system
const { execSync } = require("child_process");
const path = require("path");
/**
 * This functions generates the required directory if not exist else removes all the previous inputs from that directory
 * @param {string} directory The parent directory where the subfolder should be created
 * @param {string} folder Name of the folder that needs to be created
 * @param {string} inputPrefix The name prefix of the input file
 * @param {string} outputPrefix The name prefix of the output file
 */
function safeCreateDirectory(directory, folder, inputPrefix, outputPrefix) {
    console.log(directory, folder, inputPrefix, outputPrefix);
    if (fs.existsSync(path.join(directory, folder))) {
        const command = `rm -rf ${path.join(
            directory,
            folder
        )}/${inputPrefix}* ${folder}/${outputPrefix}*`;
        execSync(command);
    } else {
        console.log("Making directory");
        fs.mkdirSync(path.join(directory, folder));
    }
}

module.exports = safeCreateDirectory;
