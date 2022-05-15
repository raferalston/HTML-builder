const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'styles')
const resultPath = path.join(__dirname, 'project-dist')

async function getFiles(dir) {
    existsFile()
    await fs.promises.readdir(dir, { withFileTypes: true })
        .then(
            async filenames => {
                for (let filename of filenames) {
                    if (!filename.isDirectory()) {
                        let fileExt = path.parse(filename.name).ext
                        if (fileExt === '.css') {
                            let cssFile = `${folder}\\` + path.parse(filename.name).base
                            await readCssFile(cssFile);
                        }
                    }
                }
            })
}

async function readCssFile(fileName) {
    const file = await fs.promises.readFile(fileName, 'utf8');
    const resPath = `${resultPath}\\bundle.css`
    await fs.promises.appendFile(resPath, file);
}

function existsFile() {
    const path = `${resultPath}\\bundle.css`
    fs.access(path, error => {
        if (error) {
            return
        }
        fs.promises.unlink(path)
    })
}

getFiles(folder)
