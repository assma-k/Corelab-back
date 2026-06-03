const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Corelab en ligne' });
});

app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
