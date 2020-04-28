const express = require('express')
const app = express()
const port = 5757

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/one-ui-core', express.static('dist'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))