const { create } = require('xmlbuilder2')

/**
 * API:
 *  new Alert() - returns an uninitialized Alert object
 *  parse() - turn a CAP XML string into an Alert object
 *  Alert.toJson() - returns the Alert (including included Infos, Resources and Elements) as a JSON string
 *  Alert.toXml() - returns the Alert as CAP 1.2 XML
 *  Alert.addInfo() - adds an Info object to the Alert.infos array and returns the new Info object
 *  Info.addCategory(string) - adds a category value string to the Info.categories array (values are constrained in spec)
 *  Info.addResponseType(string) - adds a responseType value string to the Info.responseTypes array (values are constrained in spec)
 *  Info.addEventCode(string, string) - adds an eventCode valueName/value pair to the Info.eventCodes array (values may be constrained in 'valueName' namespace)
 *  Info.addParameter(string, string) - adds a parameter valueName/value pair to the Info.parameters array (values may be constrained in 'valueName' namespace)
 *  Alert.addArea(string) - adds an Area object to the Info.areas array, initializes the areaDesc field from argument and returns the new Area object
 *  Alert.addResource(string) - adds a Resource object to the Info.resources array, initializes the resourceDesk field from argument and returns the new Resource object
 *  All other properties are populated by direct assignment.  All reads are performed by direct reference.
 */

function xmlEscape (str) {
  if (str.indexOf('&') !== -1) {
    str = str.replace(/&/g, '&amp;')
  }
  if (str.indexOf('<') !== -1) {
    str = str.replace(/</g, '&lt;')
  }
  if (str.indexOf('>') !== -1) {
    str = str.replace(/>/g, '&gt;')
  }
  return str
}

function xmlUnescape (str) {
  if (str.indexOf('&lt;') !== -1) {
    str = str.replace(/&lt;/g, '<')
  }
  if (str.indexOf('&gt;') !== -1) {
    str = str.replace(/&gt;/g, '>')
  }
  if (str.indexOf('&amp;') !== -1) {
    str = str.replace(/&amp;/g, '&')
  }
  return str
}

/**
 * Main `Alert` constructor
 */
function Alert () {
  this.identifier = '' // Required
  this.sender = '' // Required
  this.sent = '' // Required
  this.status = 'Actual' // Required: values Actual, Exercise, System, Test, Draft
  this.msgType = 'Alert' // Required: values Alert, Update, Cancel, Ack, Error
  this.scope = 'Public' // Required: values Public, Restricted, Private
  this.source = ''
  this.restriction = undefined
  this.addresses = undefined
  this.code = undefined
  this.note = ''
  this.references = ''
  this.incidents = undefined
  this.infos = []
}

Alert.prototype.addInfo = function () {
  const newInfo = new Info()
  this.infos.push(newInfo)
  return newInfo
}

Alert.prototype.toJson = function () {
  return JSON.stringify(this, undefined, 2)
}

Alert.prototype._xmlTag = function (tagName, value, indent) {
  return indent +
      '<' + tagName + '>' +
      xmlEscape(xmlUnescape(value)) +
      '</' + tagName + '>\n'
}

Alert.prototype._xmlNameValueTag = function (tagName, name, value, indent) {
  const indent2 = indent + '  '
  return indent + '<' + tagName + '>\n' +
    this._xmlTag('valueName', name, indent2) +
    this._xmlTag('value', value, indent2) +
    indent + '</' + tagName + '>\n'
}

Alert.prototype.toXml = function () {
  let xml = '<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">\n'
  let indent = '  '
  xml += this._xmlTag('identifier', this.identifier, indent)
  xml += this._xmlTag('sender', this.sender, indent)
  xml += this._xmlTag('sent', this.sent, indent)
  xml += this._xmlTag('status', this.status, indent)
  xml += this._xmlTag('msgType', this.msgType, indent)
  if (this.source && this.source !== '') {
    xml += this._xmlTag('source', this.source, indent)
  }
  xml += this._xmlTag('scope', this.scope, indent)
  if (this.restriction && this.restriction !== '') {
    xml += this._xmlTag('restriction', this.restriction, indent)
  }
  if (this.addresses && this.addresses !== '') {
    xml += this._xmlTag('addresses', this.addresses, indent)
  }
  if (this.code && this.code !== '') {
    xml += this._xmlTag('code', this.code, indent)
  }
  if (this.note && this.note !== '') {
    xml += this._xmlTag('note', this.note, indent)
  }
  if (this.references && this.references !== '') {
    xml += this._xmlTag('references', this.references, indent)
  }
  if (this.incidents && this.incidents !== '') {
    xml += this._xmlTag('incidents', this.incidents, indent)
  }
  if (this.infos && this.infos.length > 0) {
    for (let i = 0; i < this.infos.length; i++) {
      const info = this.infos[i]
      xml += indent + '<info>\n'
      indent = '    '
      xml += this._xmlTag('language', info.language, indent)
      if (info.categories.length) {
        for (let i = 0; i < info.categories.length; i++) {
          xml += this._xmlTag('category', info.categories[i], indent)
        }
      }
      xml += this._xmlTag('event', info.event, indent)
      if (info.responseTypes && info.responseTypes.length) {
        for (let i = 0; i < info.responseTypes.length; i++) {
          xml += this._xmlTag('responseType', info.responseTypes[i], indent)
        }
      }
      xml += this._xmlTag('urgency', info.urgency, indent)
      xml += this._xmlTag('severity', info.severity, indent)
      xml += this._xmlTag('certainty', info.certainty, indent)
      if (info.audience && info.audience !== '') {
        xml += this._xmlTag('audience', info.audience, indent)
      }

      if (info.eventCodes && info.eventCodes.length) {
        for (let i = 0; i < info.eventCodes.length; i++) {
          const ec = info.eventCodes[i]
          xml += this._xmlNameValueTag(
            'eventCode', ec.valueName, ec.value, indent)
        }
      }
      if (info.effective && info.effective !== '') {
        xml += this._xmlTag('effective', info.effective, indent)
      }
      if (info.onset && info.onset !== '') {
        xml += this._xmlTag('onset', info.onset, indent)
      }
      if (info.expires && info.expires !== '') {
        xml += this._xmlTag('expires', info.expires, indent)
      }
      if (info.senderName && info.senderName !== '') {
        xml += this._xmlTag('senderName', info.senderName, indent)
      }
      if (info.headline && info.headline !== '') {
        xml += this._xmlTag('headline', info.headline, indent)
      }
      if (info.description && info.description !== '') {
        xml += this._xmlTag('description', info.description, indent)
      }
      if (info.instruction && info.instruction !== '') {
        xml += this._xmlTag('instruction', info.instruction, indent)
      }
      if (info.web && info.web !== '') {
        xml += this._xmlTag('web', info.web, indent)
      }
      if (info.contact && info.contact !== '') {
        xml += this._xmlTag('contact', info.contact, indent)
      }
      if (info.parameters && info.parameters.length) {
        for (let i = 0; i < info.parameters.length; i++) {
          const param = info.parameters[i]
          xml += this._xmlNameValueTag(
            'parameter', param.valueName, param.value, indent)
        }
      }
      if (info.resources && info.resources.length > 0) {
        for (let i = 0; i < info.resources.length; i++) {
          const resource = info.resources[i]
          xml += indent + '<resource>\n'
          indent = '      '
          xml += this._xmlTag('resourceDesc', resource.resourceDesc, indent)
          if (resource.mimeType && resource.mimeType !== '') {
            xml += this._xmlTag('mimeType', resource.mimeType, indent)
          }
          if (resource.size && resource.size !== '') {
            xml += this._xmlTag('size', resource.size, indent)
          }
          if (resource.uri && resource.uri !== '') {
            xml += this._xmlTag('uri', resource.uri, indent)
          }
          if (resource.digest && resource.digest !== '') {
            xml += this._xmlTag('digest', resource.digest, indent)
          }
          indent = '    '
          xml += indent + '</resource>\n'
        }
      }
      if (info.areas && info.areas.length > 0) {
        for (let i = 0; i < info.areas.length; i++) {
          const area = info.areas[i]
          xml += indent + '<area>\n'
          indent = '      '
          if (area.areaDesc === '') {
            area.areaDesc = 'Unspecified Area'
          }
          xml += this._xmlTag('areaDesc', area.areaDesc, indent)
          if (area.polygons && area.polygons.length) {
            for (let i = 0; i < area.polygons.length; i++) {
              xml += this._xmlTag('polygon', area.polygons[i], indent)
            }
          }
          if (area.circles && area.circles.length) {
            for (let i = 0; i < area.circles.length; i++) {
              xml += this._xmlTag('circle', area.circles[i], indent)
            }
          }
          if (area.geocodes && area.geocodes.length) {
            for (let i = 0; i < area.geocodes.length; i++) {
              const gc = area.geocodes[i]
              xml += this._xmlNameValueTag(
                'geocode', gc.valueName, gc.value, indent)
            }
          }
          if (area.altitude && area.altitude !== '') {
            xml += this._xmlTag('altitude', area.altitude, indent)
          }
          if (area.ceiling && area.ceiling !== '') {
            xml += this._xmlTag('ceiling', area.ceiling, indent)
          }
          indent = '    '
          xml += indent + '</area>\n'
        }
      }
      indent = '  '
      xml += indent + '</info>\n'
    }
  }
  xml += '</alert>'
  return xml
}

/**
 * `Info` constructor
 */
function Info () {
  this.language = ''
  // Values:
  // Geo, Met, Safety, Security, Rescue, Fire,
  // Health, Env, Transport, Infra, CBRNE, Other.
  this.categories = [] // Required
  this.event = '' // Required
  this.responseTypes = []
  // Values:
  // Immediate, Expected, Future, Past, Unknown.
  this.urgency = '' // Required
  // Values:
  // Extreme, Severe, Moderate, Minor, Unknown.
  this.severity = '' // Required
  // Values:
  // Observed, Likely, Possible, Unlikely, Unknown.
  this.certainty = '' // Required
  this.audience = ''
  this.eventCodes = []
  this.effective = ''
  this.onset = ''
  this.expires = ''
  this.senderName = ''
  this.headline = ''
  this.description = ''
  this.instruction = ''
  this.web = ''
  this.contact = ''
  this.resources = []
  this.parameters = []
  this.areas = []
}

// Geo, Met, Safety, Security, Rescue, Fire,
// Health, Env, Transport, Infra, CBRNE, Other.
Info.prototype.addCategory = function (category) {
  this.categories.push(category)
}

// Shelter, Evacuate, Prepare,  Execute, Avoid, Monitor, Assess, AllClear
Info.prototype.addResponseType = function (responseType) {
  this.responseTypes.push(responseType)
}

Info.prototype.addEventCode = function (valueName, value) {
  const eventCode = new EventCode(valueName, value)
  this.eventCodes.push(eventCode)
}

Info.prototype.addParameter = function (valueName, value) {
  const parameter = new Parameter(valueName, value)
  this.parameters.push(parameter)
}

Info.prototype.addArea = function (areaDesc) {
  const area = new Area(areaDesc)
  this.areas.push(area)
  return area
}

Info.prototype.addResource = function (resourceDesc) {
  const resource = new Resource(resourceDesc)
  this.resources.push(resource)
  return resource
}

function EventCode (valueName, value) {
  this.valueName = valueName
  this.value = value
}

function Parameter (valueName, value) {
  this.valueName = valueName
  this.value = value
}

/**
 * `Resource` constructor
 */
function Resource (resourceDesc) {
  this.resourceDesc = resourceDesc // Required
  this.mimeType = undefined
  this.size = undefined
  this.uri = undefined
  this.digest = undefined
  // note: derefURI is not implemented in this tool
}

Resource.prototype.toJson = function () {
  return JSON.stringify(this)
}

/**
 * `Area` constructor
 */
function Area (areaDesc) {
  this.areaDesc = areaDesc // Required
  this.polygons = []
  this.circles = []
  this.geocodes = []
  this.altitude = ''
  this.ceiling = ''
}

Area.prototype.addPolygon = function (polygon) {
  this.polygons.push(polygon)
}

Area.prototype.addCircle = function (circle) {
  this.circles.push(circle)
}

Area.prototype.addGeocode = function (valueName, value) {
  const geocode = new Geocode(valueName, value)
  this.geocodes.push(geocode)
}

function Geocode (valueName, value) {
  this.valueName = valueName
  this.value = value
}

// Helpers
function getNode (parentNode, name) {
  return parentNode.find(n => n.node.nodeName === name)
}

function getNodes (parentNode, name) {
  return parentNode.filter(n => n.node.nodeName === name)
}

function getNodeText (parentNode, name) {
  const node = getNode(parentNode, name)
  return node ? node.first().toString({ noDoubleEncoding: true }) : ''
}

/**
 * Parses XML string into an Alert object
 */
function parse (capxml) {
  const xml = typeof capxml === 'object' ? capxml : create({ encoding: 'UTF-8' }, capxml)
  const alertNode = getNode(xml, 'alert')

  // Populate new alert with values from XML
  const alert = new Alert()
  alert.identifier = getNodeText(alertNode, 'identifier')
  alert.sender = getNodeText(alertNode, 'sender')
  alert.sent = getNodeText(alertNode, 'sent')
  alert.status = getNodeText(alertNode, 'status')
  alert.msgType = getNodeText(alertNode, 'msgType')
  alert.source = getNodeText(alertNode, 'source')
  alert.scope = getNodeText(alertNode, 'scope')
  alert.restriction = getNodeText(alertNode, 'restriction')
  alert.addresses = getNodeText(alertNode, 'addresses')
  alert.code = getNodeText(alertNode, 'code')
  alert.note = getNodeText(alertNode, 'note')
  alert.references = getNodeText(alertNode, 'references')
  alert.incidents = getNodeText(alertNode, 'incidents')
  const infoNode = getNode(alertNode, 'info')

  const info = alert.addInfo() // only one Info is supported in current version!
  info.language = getNodeText(infoNode, 'language')

  const categoryNodes = getNodes(infoNode, 'category')
  categoryNodes.forEach(node => {
    info.addCategory(node.first().toString())
  })

  info.event = getNodeText(infoNode, 'event')

  const responseTypeNodes = getNodes(infoNode, 'responseType')
  responseTypeNodes.forEach(node => {
    info.addResponseType(node.first().toString())
  })

  info.urgency = getNodeText(infoNode, 'urgency')
  info.severity = getNodeText(infoNode, 'severity')
  info.certainty = getNodeText(infoNode, 'certainty')
  info.audience = getNodeText(infoNode, 'audience')

  const eventCodeNodes = getNodes(infoNode, 'eventCode')
  eventCodeNodes.forEach(node => {
    info.addEventCode(getNodeText(node, 'valueName'), getNodeText(node, 'value'))
  })

  info.effective = getNodeText(infoNode, 'effective')
  info.onset = getNodeText(infoNode, 'onset')
  info.expires = getNodeText(infoNode, 'expires')
  info.senderName = getNodeText(infoNode, 'senderName')
  info.headline = getNodeText(infoNode, 'headline')
  info.description = getNodeText(infoNode, 'description')
  info.instruction = getNodeText(infoNode, 'instruction')
  info.web = getNodeText(infoNode, 'web')
  info.contact = getNodeText(infoNode, 'contact')

  const resourceNodes = getNodes(infoNode, 'resource')
  resourceNodes.forEach(node => {
    const resourceDesc = getNodeText(node, 'resourceDesc')
    const resource = info.addResource(resourceDesc)
    resource.mimeType = getNodeText(node, 'mimeType')
    resource.size = getNodeText(node, 'size')
    resource.uri = getNodeText(node, 'uri')
    resource.digest = getNodeText(node, 'digest')
  })

  const parameterNodes = getNodes(infoNode, 'parameter')
  parameterNodes.forEach(node => {
    info.addParameter(getNodeText(node, 'valueName'), getNodeText(node, 'value'))
  })

  const areaNodes = getNodes(infoNode, 'area')
  areaNodes.forEach(areaNode => {
    const area = info.addArea()
    area.areaDesc = getNodeText(areaNode, 'areaDesc')

    const polygonNodes = getNodes(areaNode, 'polygon')
    polygonNodes.forEach(node => {
      area.addPolygon(node.first().toString())
    })
    const circleNodes = getNodes(areaNode, 'circle')
    circleNodes.forEach(node => {
      area.addCircle(node.first().toString())
    })

    const geocodeNodes = getNodes(areaNode, 'geocode')
    geocodeNodes.forEach(node => {
      area.addGeocode(getNodeText(node, 'valueName'), getNodeText(node, 'value'))
    })

    area.altitude = getNodeText(areaNode, 'altitude')
    area.ceiling = getNodeText(areaNode, 'ceiling')
  })
  return alert
}

module.exports = {
  parse,
  Alert,
  Info,
  Area,
  EventCode,
  Parameter,
  Resource,
  Geocode
}
