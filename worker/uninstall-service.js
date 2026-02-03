const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
    name: 'BotScraperWorker',
    script: path.join(__dirname, 'dist', 'main.js')
});

svc.on('uninstall', function () {
    console.log('Desinstalação concluída.');
    console.log('O serviço existe:', svc.exists);
});

svc.uninstall();
