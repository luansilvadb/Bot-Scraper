const Service = require('node-windows').Service;
const path = require('path');

// Criar um novo objeto de serviço
const svc = new Service({
    name: 'BotScraperWorker',
    description: 'Serviço de Scraping do Bot-Scraper',
    script: path.join(__dirname, 'dist', 'main.js'),
    env: [
        {
            name: 'NODE_ENV',
            value: 'production'
        }
    ]
});

// Escuta o evento "install", que indica que o serviço foi instalado
svc.on('install', function () {
    console.log('Instalação concluída!');
    svc.start();
});

// Escuta o evento "alreadyinstalled", caso o serviço já exista
svc.on('alreadyinstalled', function () {
    console.log('Este serviço já está instalado.');
});

// Instalar o serviço
svc.install();
