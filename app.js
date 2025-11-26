// app.js
const express = require('express');
const app = express();

// Catalogo de precios (en memoria)
const catalogoPrecios = {
  "productoA": 100,
  "productoB": 250,
  "productoC": 50
};

// Endpoint que describe la actividad
app.get('/config.json', (req, res) => {
  res.json({
    workflowApiVersion: 1,
    metaData: {
      icon: 'https://cdn-icons-png.flaticon.com/512/5775/5775239.png',
      category: 'custom'
    },
    type: 'REST',
    lang: {
      "es-MX": {
        name: "Consultar Precio",
        description: "Devuelve el precio de un producto."
      }
    },
    arguments: {
      execute: {
        inArguments: [
          { producto: 'string' }
        ],
        outArguments: [
          { precio: 'number' }
        ],
        url: 'https://api-de-precios-2.onrender.com/execute',
        timeout: 10000,
        retryCount: 3
      }
    }
  });
});

app.use(express.json());

// Endpoint que consulta el precio
app.post('/execute', (req, res) => {
  const { inArguments } = req.body;
  let productoSolicitado;
  if (inArguments && Array.isArray(inArguments) && inArguments[0].producto) {
    productoSolicitado = inArguments[0].producto;
  } else {
    productoSolicitado = undefined;
  }

  let precio = catalogoPrecios[productoSolicitado] ?? null;

  // Este objeto se enviará como outArguments a Journey Builder
  res.json({
    outArguments: [
      { precio }
    ],
    branchResult: precio !== null ? 'success' : 'not_found'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API de precios escuchando en puerto ${port}`));
