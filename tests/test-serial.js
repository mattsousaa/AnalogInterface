const SerialPort = require('serialPort');
const ReadLine = require('@serialPort/parser-readline');

const port = new SerialPort('COM5', { baudRate: 9600 });
const parser = new ReadLine();

port.pipe(parser);

parser.on('data', (line) => 
{
    console.log(Number(line));
});
