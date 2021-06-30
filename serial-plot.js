const fs         = require('fs')
const SerialPort = require('serialPort');
const ReadLine = require('@serialPort/parser-readline');
const { type } = require('os');

const CSV_FILENAME      = 'csv_files/data_saved';
const MAX_DATA_LENGTH   = 500;
let port_name           = '';
let data_x_counter      = 0;
let running             = false;
let baudrate_but        = false;

// botão NOVA AQUISIÇÃO ---------
document.getElementById('btn-new').onclick = () =>
{   
    if(baudrate_but == true){
        clear_plot_1();
        data_x_counter = 0;
        running = true;
    }
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

// função HASH para geração do nome de arquivo final dos dados salvos em CSV
function random_string(length)
{   
    const dictionary = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let temp = '';

    while(length--)
        temp += dictionary[Math.floor(Math.random() * dictionary.length)];
    
    return temp;

}

/*function get_serialPorts(){
    SerialPort.list().then(ports => {
        ports.forEach(function(port) {
            console.log(port.path)
        })
    })
}*/

function get_portaSerial() {
    var x = document.getElementById("porta-nome").value;
    port_name = x.toUpperCase();
}

// botão com BAUDRATE de 9600
document.getElementById('opt-btn1').onclick = () =>
{
    const port = new SerialPort(port_name, { baudRate: 9600 });
    const parser = new ReadLine();
    port.pipe(parser);
    baudrate_but = true;

    parser.on('data', (line) => 
    {   

        if(running === false)
            return;

        const new_sample = Number(line);

        add_plot_1_data(data_x_counter, new_sample);

        if(++data_x_counter === MAX_DATA_LENGTH)
            running = false;
    });
}

// botão com BAUDRATE de 19200
document.getElementById('opt-btn2').onclick = () =>
{
    const port = new SerialPort(port_name, { baudRate: 19200 });
    const parser = new ReadLine();
    port.pipe(parser);
    baudrate_but = true;

    parser.on('data', (line) => 
    {   

        if(running === false)
            return;

        const new_sample = Number(line);

        add_plot_1_data(data_x_counter, new_sample);

        if(++data_x_counter === MAX_DATA_LENGTH)
            running = false;
    });
}

// botão com BAUDRATE de 38400
document.getElementById('opt-btn3').onclick = () =>
{
    const port = new SerialPort(port_name, { baudRate: 38400 });
    const parser = new ReadLine();
    port.pipe(parser);
    baudrate_but = true;

    parser.on('data', (line) => 
    {   

        if(running === false)
            return;

        const new_sample = Number(line);

        add_plot_1_data(data_x_counter, new_sample);

        if(++data_x_counter === MAX_DATA_LENGTH)
            running = false;
    });
}

// botão com BAUDRATE de 57600
document.getElementById('opt-btn4').onclick = () =>
{   
    get_portaSerial();

    const port = new SerialPort(port_name, { baudRate: 57600 });
    const parser = new ReadLine();
    port.pipe(parser);
    baudrate_but = true;

    parser.on('data', (line) => 
    {   

        if(running === false)
            return;

        const new_sample = Number(line);

        add_plot_1_data(data_x_counter, new_sample);

        if(++data_x_counter === MAX_DATA_LENGTH)
            running = false;
    });
}

// botão com BAUDRATE de 115200
document.getElementById('opt-btn5').onclick = () =>
{   
    const port = new SerialPort(port_name, { baudRate: 115200 });
    const parser = new ReadLine();
    port.pipe(parser);
    baudrate_but = true;

    parser.on('data', (line) => 
    {   

        if(running === false)
            return;

        const new_sample = Number(line);

        add_plot_1_data(data_x_counter, new_sample);

        if(++data_x_counter === MAX_DATA_LENGTH)
            running = false;
    });
}