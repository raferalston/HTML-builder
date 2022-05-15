const path = require('path');
const fs = require('fs');
const { stdout } = process;

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf-8'});

stream.on('readable', function(){
    let data = stream.read();
    if (data !== null) {
        stdout.write(data);
    }
});
 