const AccessControl = require('accesscontrol');
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const ac = new AccessControl();
ac.grant('Constructor')
    .createOwn('crossword')
    .readOwn('crossword')
    .updateOwn('crossword')
    .deleteOwn('crossword')
  .grant('Editor')
    .extend('Constructor')
    .readAny('crossword')
    .updateAny('crossword')
  .grant('Admin')
    .extend('Editor')
    .deleteAny('crossword')

app.get('/crosswords', function (req, res, next) {
  try {
    const permission = ac.can(req.query.role)[req.query.action]('crossword');
    if (permission.granted) {
      res.status(200).send();
    } else {
      res.status(403).send();
    }
  } catch (e) {
    res.status(401).send();
  }
});
