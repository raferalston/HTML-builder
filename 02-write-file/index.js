const path = require('path');
const { stdout, stdin } = process;
const fs = require('fs');
const readline = require('readline');


const filePath = path.join(__dirname, 'text.txt')

console.log('Welcome to simple input programm');

function write(fp) {
    const writableStream = fs.createWriteStream(fp, 'utf-8');

    const rl = readline.createInterface({
        input: stdin,
        output: stdout,
        prompt: 'Input something: '
    });

    rl.prompt();
      
    rl.on('line', (line) => {
        if (line.trim() === 'exit') {
            rl.close();
        } else {
            input = `${line}\n`
            writableStream.write(input);
            rl.prompt();
        }
    }).on('close', () => {
        writableStream.end();
        writableStream.on('finish', () => {
            console.log(`Input written to ${fp}`);
        })
    });
}

write(filePath)