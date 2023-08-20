const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//teste
//ARQUIVO DAS ROUTES
const financas = require('./routes/financas');
const plano = require('./routes/plano');

//INDICA A ROTA QUE SERÁ USADA
app.use('/financas',financas);
app.use('/plano',plano);
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})