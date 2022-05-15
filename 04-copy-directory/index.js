const fs = require('fs');
const path = require('path');


const directory = path.join(__dirname, 'files-copy')
const copyDirectory = path.join(__dirname, 'files')


function checkAndCreate(dir) {
    fs.access(dir, error => {
        if (error) {
            fs.promises.mkdir(dir).then(function () {
                copyDir()
            })
        } else {
            fs.rmdir(directory, {
                recursive: true,
              }, (e) => {
                fs.promises.mkdir(dir).then(function () {
                    copyDir()
                })
            })

        }
    })
}

function writeData(sourcePath, finalPath) {
    fs.copyFile(sourcePath, finalPath, (err) => {
        if (err) {
            console.log(`Error occurred: ${err}`);
        }
    });
}


function copyDir() {
    fs.promises.readdir(copyDirectory)
        .then(
            filenames => {
                for (let filename of filenames) {
                    let pathSource = path.join(__dirname, 'files', filename)
                    let pathFinal = path.join(__dirname, 'files-copy', filename)
                    writeData(pathSource, pathFinal);
                }
            })
}

checkAndCreate(directory)