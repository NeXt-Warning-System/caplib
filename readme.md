# caplib

CAP XML JavaScript library

Adapted from https://github.com/CAPTools/CAPCreator/blob/master/js/caplib.js

```
const { Alert, parse } = require('caplib')

const alert1 = new Alert()
const info = alert1.addInfo()
info.addParameter('parameter_type', 'silly')

// Testing unicode, that's Thai for "Bangkok"
const area = info.addArea('กรุงเทพมหานคร')
area.addCircle('100.54386,13.81390 30.99990')

console.log(newAlert.toJson())

const alert2 = parse(newAlert.toXml())

```
