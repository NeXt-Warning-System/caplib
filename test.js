const assert = require('assert')
const { Alert, parse } = require('.')

const newAlert = new Alert()
const info = newAlert.addInfo()
info.addParameter('parameter_type', 'silly')

// Testing unicode, that's Thai for Bangkok
const area = info.addArea('กรุงเทพมหานคร')
area.addCircle('100.54386,13.81390 30.99990')

console.log()

const json = `{
  "identifier": "",
  "sender": "",
  "sent": "",
  "status": "Actual",
  "msgType": "Alert",
  "scope": "Public",
  "source": "",
  "note": "",
  "references": "",
  "infos": [
    {
      "language": "",
      "categories": [],
      "event": "",
      "responseTypes": [],
      "urgency": "",
      "severity": "",
      "certainty": "",
      "audience": "",
      "eventCodes": [],
      "effective": "",
      "onset": "",
      "expires": "",
      "senderName": "",
      "headline": "",
      "description": "",
      "instruction": "",
      "web": "",
      "contact": "",
      "resources": [],
      "parameters": [
        {
          "valueName": "parameter_type",
          "value": "silly"
        }
      ],
      "areas": [
        {
          "areaDesc": "",
          "polygons": [],
          "circles": [
            "100.54386,13.81390 30.99990"
          ],
          "geocodes": [],
          "altitude": "",
          "ceiling": ""
        }
      ]
    }
  ]
}`

assert.strictEqual(json, newAlert.toJson())

const xml = `<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>id2</identifier>
  <sender>test@example.com</sender>
  <sent>2015-04-21T19:19:08+00:00</sent>
  <status>Actual</status>
  <msgType>Update</msgType>
  <source>source</source>
  <scope>Public</scope>
  <restriction>restriction</restriction>
  <addresses>addresses</addresses>
  <code>code</code>
  <note>note</note>
  <references>test@example.com,id1,2015-04-21T19:15:00+00:00</references>
  <incidents>incidents</incidents>
  <info>
    <language>en-US</language>
    <category>Met</category>
    <category>Safety</category>
    <event>Event</event>
    <responseType>Evacuate</responseType>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <audience>audience</audience>
    <eventCode>
      <valueName>eventCodeName</valueName>
      <value>eventCodeValue</value>
    </eventCode>
    <eventCode>
      <valueName>eventCodeName2</valueName>
      <value>eventCodeValue2</value>
    </eventCode>
    <effective>2015-04-21T19:19:09+00:00</effective>
    <onset>2015-04-21T19:19:00+00:00</onset>
    <expires>2015-04-21T20:20:08+00:00</expires>
    <senderName>Sender Name</senderName>
    <headline>Headline</headline>
    <description>Description &amp; stuff</description>
    <instruction>Instruction</instruction>
    <web>http://www.example.com</web>
    <contact>contact</contact>
    <parameter>
      <valueName>paramName</valueName>
      <value>paramValue</value>
    </parameter>
    <parameter>
      <valueName>paramName2</valueName>
      <value>paramValue2</value>
    </parameter>
    <resource>
      <resourceDesc>resourceDesc</resourceDesc>
      <mimeType>text/html</mimeType>
      <size>1024</size>
      <uri>http://example.com/foo</uri>
      <digest>digest</digest>
    </resource>
    <resource>
      <resourceDesc>resourceDesc2</resourceDesc>
      <mimeType>text/html</mimeType>
      <uri>http://example.com/foo2</uri>
    </resource>
    <area>
      <areaDesc>areaDesc2</areaDesc>
      <polygon>1,1 2,1 2,2 1,2 1,1</polygon>
      <circle>0,0,1000</circle>
      <geocode>
        <valueName>geoName2</valueName>
        <value>geoValue2</value>
      </geocode>
      <geocode>
        <valueName>geoName3</valueName>
        <value>geoValue3</value>
      </geocode>
      <altitude>500</altitude>
      <ceiling>800</ceiling>
    </area>
  </info>
</alert>`

const parsedAlert = parse(xml)
assert.strictEqual(xml, parsedAlert.toXml())

console.log('Passed')
