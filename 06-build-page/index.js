const path = require('path');
const fs = require('fs');

const mainPath = path.join(__dirname)
const folder = path.join(__dirname, 'styles')
const resultPath = path.join(__dirname, 'project-dist')
const copyDirectory = path.join(__dirname, 'assets')
const componentsDir = path.join(__dirname, 'components')

const readFile = async data => {
    let result = {
        'template.html' : await fs.promises.readFile(mainPath + '/template.html', 'utf8')
    }
    for (let i = 0; i < data.length; i++) {
        try {
            result[data[i]] = await fs.promises.readFile(mainPath + `/components/${data[i]}`, 'utf8')
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
    return result
}

function substituteTemplate(t) {
    let template = t['template.html']
    for (const k in t) {
        let tmp = k.slice(0, -5)
        if (tmp !== 'template') {
            template = template.replace(`{{${k.slice(0, -5)}}}`, t[k])
        }
    }
    return template
}

fs.promises.readdir(componentsDir, {withFileTypes: true})
    .then(
        filenames => {
        data = []
        for (let filename of filenames) {
            if (!filename.isDirectory()) {
                data.push(filename.name);
            }
        }
        return data
}).then(d => {
    readFile(d)
    .then(data => {
        let subsTemp = substituteTemplate(data);
        return subsTemp
    })
    .then(temp => {
        fs.mkdir(mainPath + '/project-dist', (err) => {
            if (err) {
                fs.promises.writeFile(mainPath + '/project-dist/index.html', temp, err => {
                    if (err) {
                        // return console.error(err);
                    }
                })
                return
            }
            fs.promises.writeFile(mainPath + '/project-dist/index.html', temp, err => {
                if (err) {
                    // return console.error(err);
                }
            })
        });
    })
    .then(e => {
        getFiles(folder)
    })
    .then(e => {
        createDirectoriesForCopy(copyDirectory)   
    })
})




function getCopyFiles(dir) {
    fs.promises.readdir(dir, {withFileTypes: true})
    .then(
        filenames => {
        for (let filename of filenames) {
            let fileDir = path.join(dir, filename.name).replace('/assets/', '/project-dist/assets/')
            if (!filename.isDirectory()) {
                writeData(path.join(dir, filename.name), fileDir)
            } else {
                getCopyFiles(path.join(dir, filename.name))
            }
        }
    })
}

function writeData(sourcePath, finalPath) {
    fs.copyFile(sourcePath, finalPath, (err) => {
        if (err) {
            // console.log(`Error occurred: ${err}`);
        }
    });
}


function createDirectoriesForCopy(dir) {
    fs.promises.readdir(dir, {withFileTypes: true})
    .then(
        filenames => {
        for (let filename of filenames) {
            let fileDir = path.join(dir, filename.name).replace('/assets/', '/project-dist/assets/')
            if (filename.isDirectory()) {
                fs.promises.mkdir(fileDir, { recursive: true }, (err) => {
                    // console.log(err);
                })
                .then(e => {
                    getCopyFiles(dir)
                })
            }
        }
    })
    
}



async function getFiles(dir) {
    existsFile()
    await fs.promises.readdir(dir, { withFileTypes: true })
        .then(
            async filenames => {
                for (let filename of filenames) {
                    if (!filename.isDirectory()) {
                        let fileExt = path.parse(filename.name).ext
                        if (fileExt === '.css') {
                            let cssFile = `${folder}/` + path.parse(filename.name).base
                            await readCssFile(cssFile);
                        }
                    }
                }
            })
}

async function readCssFile(fileName) {
    const file = await fs.promises.readFile(fileName, 'utf8');
    const resPath = `${resultPath}/style.css`
    await fs.promises.appendFile(resPath, file);
}

function existsFile() {
    const path = `${resultPath}/style.css`
    fs.access(path, error => {
        if (error) {
            return
        }
        fs.promises.unlink(path)
    })
}