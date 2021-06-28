let x  = 0;

// Função chamada a cada 500ms
setInterval(() => 
{
    add_plot_1_data(x++, Math.random());
}, 500);