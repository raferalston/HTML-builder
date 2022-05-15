const fs = require('fs');
const path = require('path');

let folder = path.join(__dirname, 'secret-folder')

function getFiles(dir) {
    fs.promises.readdir(dir, {withFileTypes: true})
    .then(
        filenames => {
        for (let filename of filenames) {
            if (!filename.isDirectory()) {
                fs.stat(path.join(dir, filename.name), (error, stats) => {
                    if (error) {
                      return;
                    }
                  
                    const res = `${path.parse(filename.name).name} - ${path.extname(filename.name).slice(1)} - ${stats.size/1000}kb` 
                    console.log(res);
                })
            } else {
                // Не совсем понял нужно ли по ТЗ считывать файлы из вложенных
                // папок, поэтому если нужно то расскоментируй ниже.
                // getFiles(path.join(dir, filename.name))
            }
        }
    })

}

getFiles(folder)