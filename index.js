const AccessControl = require('accesscontrol');
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const ac = new AccessControl();
ac.grant('Constructor')
    .createOwn('crossword')
    .readOwn('crossword', ['comments', 'theme', 'grid-size', '!id'])
    .updateOwn('crossword', ['comments', 'theme', 'grid-size'])
    .deleteOwn('crossword')
  .grant('Editor')
    .extend('Constructor')
    .readAny('crossword', ['comments', 'theme', 'grid-size'])
    .updateAny('crossword', ['comments'])
  .grant('Admin')
    .extend('Editor')
    .deleteAny('crossword')

app.get('/crosswords', function (req, res, next) {
  try {
    const permission = ac.can(req.query.role)[req.query.action]('crossword');
    if (permission.granted) {
      res.status(200).send(permission.attributes);
      console.log(permission.attributes);
    } else {
      res.status(403).send();
    }
  } catch (e) {
    res.status(401).send();
  }
});
