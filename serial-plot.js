const fs         = require('fs')
const SerialPort = require('serialPort');
const ReadLine = require('@serialPort/parser-readline');

const port = new SerialPort('COM5', { baudRate: 57600 });
const parser = new ReadLine();
port.pipe(parser);

const CSV_FILENAME      = 'csv_files/data_saved';
const MAX_DATA_LENGTH   = 500;
let data_x_counter      = 0;
let running             = false;

parser.on('data', (line) => 
{   

    if(running === false)
        return;

    const new_sample = Number(line);

    add_plot_1_data(data_x_counter, new_sample);

    if(++data_x_counter === MAX_DATA_LENGTH)
        running = false;
});

// BOTÃO NOVA AQUISIÇÃO ---------
document.getElementById('btn-new').onclick = () =>
{
    clear_plot_1();
    data_x_counter = 0;
    running = true;
}

// botão SALVAR AQUISIÇÃO
document.getElementById('btn-save').onclick = () =>
{
    const data_to_save = fetch_plot_1_data();

    let output_csv = '';

    for(let i = 0; i < data_to_save.length; i++){
        output_csv += String(i) + ',' + String(data_to_save[i]) + '\n';
    }

    fs.writeFileSync(CSV_FILENAME + '_' + random_string(8) + '.csv', output_csv);
}

function random_string(length)
{   
    const dictionary = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let temp = '';

    while(length--)
        temp += dictionary[Math.floor(Math.random() * dictionary.length)];
    
    return temp;

}