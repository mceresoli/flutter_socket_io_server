const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init server');

bands.addBand(new Band('Guns and Roses'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Metallica'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    //Cuando un cliente se conecta le envio las bandas
    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });

    client.on('vote-band',(payload) => {
        bands.voteBand(payload.band_id); 
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band',(payload) => {
        bands.addBand(new Band(payload.name)); 
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band',(payload) => {
        bands.deleteBand(payload.band_id)
        io.emit('active-bands', bands.getBands());
    });

    


});

