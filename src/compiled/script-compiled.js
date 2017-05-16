(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){

var htmlTags = require('html-tag-names')
var document = require('global-undom')
var svgTags = require('svg-tag-names')

var namespaces = {
  ev: 'http://www.w3.org/2001/xml-events',
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xmlns: 'http://www.w3.org/2000/xmlns/'
}

var booleanAttrs = [
  'defaultchecked',
  'formnovalidate',
  'indeterminate',
  'willvalidate',
  'autofocus',
  'checked',
  'disabled',
  'readonly',
  'required',
  'selected'
]

var isEventHandler = function (key) { return key.slice(0, 2) === 'on'; }

var normalizeEventName = function (event) { return 'on' + event.slice(2, event.length).toLowerCase(); }

var isPlainObject = function (obj) { return typeof obj === 'object' && obj.constructor === Object; }

var contains = function (val, obj) { return obj.indexOf(val) !== -1; }

var getSvgAttributeNamespace = function (attr) {
  var prefix = attr.split(':', 1)[0]
  return namespaces.hasOwnProperty(prefix)
    ? namespaces[prefix]
    : null
}

var createElementTag = function (tagName) {
  return contains(tagName, svgTags)
    ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
    : document.createElement(tagName)
}

var setAttribute = function (element, key, value) {
  return contains(':', key)
    ? element.setAttributeNS(getSvgAttributeNamespace(key), key, value)
    : element.setAttribute(key, value)
}

var createElement = function (tagName) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var attrs
  var children = []
  args.forEach(function (arg) {
    if (!arg) {
      return
    } else if (!attrs && isPlainObject(arg)) {
      attrs = arg
    } else if (Array.isArray(arg)) {
      children.push.apply(children, arg)
    } else {
      children.push(arg)
    }
  })

  var element = createElementTag(tagName)

  for (var key in attrs) {
    var value = attrs[key]

    if (isEventHandler(key)) {
      element[normalizeEventName(key)] = value
    } else if (contains(key, booleanAttrs)) {
      value !== false && element.setAttribute(key, key)
    } else {
      setAttribute(element, key, value)
    }
  }

  if (children && children.length > 0) {
    children.forEach(function (child) {
      element.appendChild(
         typeof child === 'string'
          ? document.createTextNode(child)
          : child
      )
    })
  }

  return element
}

var createTagFactory = function (tag) {
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return createElement.apply(void 0, [ tag ].concat( args ));
  }
}

module.exports = createElement

svgTags.concat(htmlTags).forEach(function (tag) {
  module.exports[tag] = createTagFactory(tag)
})


},{"global-undom":3,"html-tag-names":4,"svg-tag-names":5}],3:[function(require,module,exports){

if (typeof document !== 'undefined') {
  module.exports = document
} else {
  var undom = require('undom')
  module.exports = undom()
}

},{"undom":1}],4:[function(require,module,exports){
module.exports=[
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "command",
  "content",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "multicol",
  "nav",
  "nextid",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "pre",
  "progress",
  "q",
  "rb",
  "rbc",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp"
]

},{}],5:[function(require,module,exports){
module.exports=[
  "a",
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "animation",
  "audio",
  "canvas",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "discard",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "handler",
  "hatch",
  "hatchpath",
  "hkern",
  "iframe",
  "image",
  "line",
  "linearGradient",
  "listener",
  "marker",
  "mask",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "prefetch",
  "radialGradient",
  "rect",
  "script",
  "set",
  "solidColor",
  "solidcolor",
  "stop",
  "style",
  "svg",
  "switch",
  "symbol",
  "tbreak",
  "text",
  "textArea",
  "textPath",
  "title",
  "tref",
  "tspan",
  "unknown",
  "use",
  "video",
  "view",
  "vkern"
]

},{}],6:[function(require,module,exports){
'use strict';

// ##############################################################
// ######           Global letiables                       ######
// ##############################################################

// ----- Buttons -----//
var submitDevicesButton = document.querySelector('#submitDevices');
var submitAttributesButton = document.querySelector('#submitAttributes');
var submitDataValuesButton = document.querySelector('#submitDataValues');
var startStreamButton = document.querySelector('#startStream');
var stopStreamButton = document.querySelector('#stopStream');
var submitSdsSettingsButton = document.querySelector('#safeSDSSettings');
var skipSdsSettingsButton = document.querySelector('#skipSDS');

// --- Input fields ---//
var createDeviceInputFields = Array.from(document.querySelectorAll('.createDevice'));
var controlsForNumberValues = document.querySelector('#controlNumberValues');
var controlsForStringValues = document.querySelector('#controlStringValues');
var controlsForBooleanValues = document.querySelector('#controlBooleanValues');
var fileInput = document.querySelector('.deviceImage');

// --- Containers ---//
var createDeviceForm = document.querySelector('#createDevices');
var createAttributeForm = document.querySelector('.addAttributes');
var createDataValueForm = document.querySelector('.addDataValues');
var photoBanner = document.querySelector('#photos');

// ----- State -----//

// arrays to store the attributes from the devicesData object to loop through them and create sliders in 
// control panel
var amountOfNumberValues = [];
var amountOfBooleanValues = [];
var amountOfStringValues = [];

// array of base64 image urls
var devicePictures = [];

// global var to store the interval running to push data (so we can clear it)
var streamingInterval = [];

// if sds project is used, store the settings entered by the user
var isSdsProject = false;
var sdsSettings = {};

// vars to store the amount of devices and attributes created (to show counter next to input field)
var numberOfCreateDevicesInputFields = 1;
var numberOfAttributesCreated = {};

// object to store all data the user enters
var devicesData = {};

// using elementx to create DOM elements (cleaner syntax that just document.createElement)

var _require = require('elementx'),
    div = _require.div,
    h1 = _require.h1,
    h2 = _require.h2,
    button = _require.button,
    input = _require.input,
    select = _require.select,
    label = _require.label,
    span = _require.span,
    option = _require.option,
    img = _require.img,
    form = _require.form,
    p = _require.p;

// ##############################################################
// ######           Functions                              ######
// ##############################################################

function removeElements(selector) {

    var elements = $(selector);
    elements.each(function (index, element) {
        element.remove();
    });
}

// ---- functions needed in the create devices panel ---- //
function removeCreatedDevice(e) {

    var elementToBeRemoved = e.path[3];
    createDeviceForm.removeChild(elementToBeRemoved);
    numberOfCreateDevicesInputFields--;
}

function deviceInputFieldClicked() {

    if (document.querySelectorAll('.createDevice').length <= 20) {
        numberOfCreateDevicesInputFields++;
        var deviceId = 'device' + numberOfCreateDevicesInputFields;

        // build the new input field
        var container = div(div({ class: 'form-group animated slideInRight' }, div({ class: 'input-group' }, div({ class: 'input-group-addon' }, 'Device ' + numberOfCreateDevicesInputFields), input({
            onClick: deviceInputFieldClicked,
            type: 'text',
            class: 'form-control createDevice',
            id: deviceId,
            placeholder: 'Device name (No Spaces)'
        }), div({ onClick: removeCreatedDevice, class: 'input-group-addon removeDevice' }, '❌')), label({ class: 'btn btn-default btn-file', style: 'margin-top:10px' }, span({ class: 'deviceImageLabel' }, 'Select Picture'), input({
            onChange: pictureSelected,
            type: 'file',
            class: 'deviceImage',
            style: 'display:none'
        }))));

        createDeviceForm.appendChild(container);

        container.addEventListener('animationend', function (e) {
            // remove the animation so it does not slide in again when clicking through the accordion
            container.firstChild.className = "form-group";
        });
    }
}

function generateInitialAttributeForm() {

    var devices = Object.keys(devicesData);

    devices.forEach(function (device, index) {
        // set a counter in our array so we can keep track of the different attributes
        numberOfAttributesCreated[device] = 1;
        var attributeId = device + '/attribute' + numberOfAttributesCreated[device];

        // create the a form for each device entered
        var node = div({ 'data-device': device }, h2({}, device), div({ class: 'form-group' }, div({ class: 'input-group' }, div({ class: 'input-group-addon' }, 'Attribute ' + numberOfAttributesCreated[device]), input({
            onClick: attributeInputFieldClicked,
            type: 'text',
            class: 'form-control createAttribute',
            id: attributeId,
            placeholder: 'Attribute Name (No spaces)'
        }), div({ class: 'input-group-addon removeAttribute' }, '❌'))));

        // add to the addAttributes panel
        document.querySelector('.addAttributes').appendChild(node);
    });
}

function submitDevices() {

    devicesData = {};
    removeElements('.addAttributes div[data-device]');

    // store the different devices as keys in the devicesData object    
    Array.from(document.querySelectorAll('.createDevice')).forEach(function (inputField, index) {
        if (!(inputField.value === "")) {
            devicesData[inputField.value] = {};
        }
    });

    // if object is empty
    if (Object.keys(devicesData).length === 0 && devicesData.constructor === Object) {
        $.notify({ message: 'Please fill in at least 1 device.' }, { type: 'danger' });
    } else {
        generateInitialAttributeForm();
        generateImagesInControlPanel();

        $.notify({ message: 'Devices saved succesfully!' }, { type: 'success' });

        $('#collapseCreateDevices').collapse('hide');
        $('#collapseAddAttributes').collapse('show');
    }
}

function generateImagesInControlPanel() {
    // grab the different devices from the devicesData
    var devices = Object.keys(devicesData);

    // Now we have two arrays of the same length (pictures and devices)
    devices.forEach(function (device, index) {
        // create image for every device
        var image = img({
            src: devicePictures[index] || '/img/placeholder.png',
            id: device,
            style: "width:150px;height:150px;border-radius:50%;border:2px solid #F2F2F2;margin-left:5px"
        });

        // append the image to the image container on the control panel
        photoBanner.appendChild(image);
    });
}

function pictureSelected(e) {

    // set the label on the button to the name of the file uploaded
    var fileName = '';
    var fileUrl = '';

    if (this.files) fileName = e.target.value.split('\\').pop();

    if (fileName) e.target.previousElementSibling.innerHTML = fileName;else e.target.previousElementSibling.innerHTML = "Select Picture ...";

    // read image url and push it to pictures array
    if (fileInput.files && fileInput.files[0]) {
        // read the file input, and push it in an array so we can add the picture to the control panel
        var reader = new FileReader();
        reader.onload = function (e) {
            devicePictures.push(e.target.result);
        };
        var image = reader.readAsDataURL(this.files[0]);
    }
}

// ---- functions needed in the create attributes panel ---- //

function removeCreatedAttribute(e) {

    var elementToBeRemoved = e.path[2];
    var parentElement = e.path[3];
    var device = parentElement.dataset.device;
    parentElement.removeChild(elementToBeRemoved);
    numberOfAttributesCreated[device]--;
}

function attributeInputFieldClicked(e) {
    // grab the parent div of the clicked input field and the value of the dataset
    var clickedContainer = e.path[3];
    var device = e.path[3].dataset.device;

    // increment the correct number
    numberOfAttributesCreated[device]++;

    var attributeId = device + '/attribute' + numberOfAttributesCreated[device];

    var container = div({ class: 'form-group animated slideInRight' }, div({ class: 'input-group' }, div({ class: 'input-group-addon' }, "Attribute " + numberOfAttributesCreated[device]), input({
        onClick: attributeInputFieldClicked,
        type: 'text',
        class: 'form-control createAttribute',
        id: attributeId,
        placeholder: 'Attribute Name (No spaces)'
    }), div({ onClick: removeCreatedAttribute, class: 'input-group-addon removeAttribute' }, '❌')));

    clickedContainer.appendChild(container);

    container.addEventListener('animationend', function (e) {
        // remove the animation so it does not slide in again when clicking through the accordion
        container.className = "form-group";
    });
}

function dataTypeSelected() {

    var attribute = this.dataset.attribute;
    var device = this.dataset.device;
    var form = document.querySelector('form[data-attribute="' + attribute + '/' + device + '"]');
    var selectedValue = this.value;
    var categoryInput = form.querySelector('input[data-attribute=' + attribute + ']');
    var rangeInput = form.querySelector('div[data-attribute=' + attribute + ']');

    if (selectedValue === "Number") {
        categoryInput.style.display = "none";
        rangeInput.style.display = "block";
    }

    if (selectedValue === "String") {
        categoryInput.style.display = "block";
        rangeInput.style.display = "none";
    }

    if (selectedValue === "Boolean") {
        categoryInput.style.display = "none";
        rangeInput.style.display = "none";
    }
}

function generateDataValuesForm() {
    // create a container for every  key in devicesData
    var devices = Object.keys(devicesData);

    devices.forEach(function (device) {
        // create the container
        var container = div({ 'data-device': device }, h2({}, device));

        // create a form for every attribute for every device so the user can enter data type values
        var attributes = Object.keys(devicesData[device]);
        attributes.forEach(function (attribute) {

            // drodown to select what the data type is of the attribute
            var dataTypesDropDown = select({
                onChange: dataTypeSelected,
                class: 'form-control',
                'data-attribute': attribute,
                'data-device': device
            }, option({}, "String"), option({}, "Number"), option({}, "Boolean"), option({}, "GPS-String"));

            // input field to enter categorical values
            var categoryInput = input({
                'data-attribute': attribute,
                'data-device': device,
                style: 'width:100%;margin-top:10px;',
                type: 'text',
                class: 'form-control',
                id: 'categories',
                placeholder: 'Enter categories (comma seperated)'
            });

            // input field to enter numerical values
            var rangeInput = div({ style: 'display:none', 'data-attribute': attribute }, p({}, 'From'), input({
                style: 'width:100%',
                'data-attribute': attribute,
                'data-device': device,
                type: 'number',
                class: 'form-control',
                id: 'range-from',
                placeholder: 'From'
            }), p({}, 'To'), input({
                style: 'width:100%',
                'data-attribute': attribute,
                'data-device': device,
                type: 'number',
                class: 'form-control',
                id: 'range-to',
                placeholder: 'To'
            }));

            var dataValueForm = form({ class: 'form-inline', 'data-attribute': attribute + '/' + device }, p({ class: 'attribute' }, attribute), dataTypesDropDown, categoryInput, rangeInput);

            container.appendChild(dataValueForm);
        });

        createDataValueForm.appendChild(container);
    });
}

function submitAttributes() {

    removeElements('.addDataValues div[data-device]');

    var devices = Array.from(document.querySelectorAll('[data-device]'));

    devices.forEach(function (device) {
        var attributes = Array.from(device.querySelectorAll('.createAttribute'));
        var name = device.dataset.device;

        // first clear the specific object again
        devicesData[name] = {};

        // loop through attributes and write them to the correct place in the object
        attributes.forEach(function (attribute) {
            if (!(attribute.value === "")) {
                devicesData[name][attribute.value] = {};
            }
        });
    });

    generateDataValuesForm();

    $.notify({ message: 'Attributes saved succesfully!' }, { type: 'success' });

    $('#collapseAddAttributes').collapse('hide');
    $('#collapseDataValues').collapse('show');
}

// ---- functions needed in the data values panel ---- //

function submitDataValues() {
    // grab the different devices based on the number of data types forms there are
    var devices = Array.from(document.querySelectorAll('.addDataValues div[data-device]'));

    devices.forEach(function (device) {
        var deviceName = device.dataset.device;
        // grab the attributes based on the p elements in each data type form
        var attributes = Array.from(device.querySelectorAll('.attribute'));

        // loop through different attributes and write the selections to our main object, devicesData
        attributes.forEach(function (attribute) {
            var attributeName = attribute.innerHTML;
            var dataTypesDropdown = Array.from(device.querySelectorAll('select[data-attribute=' + attributeName + ']'));
            var currentAttribute = devicesData[deviceName][attributeName];

            // loop through every dropdown to write the type of data and based on that write the values in the inputfields
            dataTypesDropdown.forEach(function (dropdown) {
                var dropdownValue = dropdown.value;

                // write some metadata to our current attribute
                currentAttribute["dataType"] = dropdownValue;
                currentAttribute["deviceName"] = deviceName;
                currentAttribute["attributeName"] = attributeName;

                if (dropdownValue === "String") {

                    // user select the string as input, so we read the category input field for values
                    var stringInput = device.querySelector('#categories[data-attribute=' + attributeName + ']').value;
                    var parsedStringInput = stringInput.split(',');

                    // write the possible values to the devicesData
                    currentAttribute["categories"] = parsedStringInput;

                    // put the current device's attribute in our stringArray so we can loop trough that array for the control panel
                    amountOfStringValues.push(currentAttribute);
                }

                if (dropdownValue === "Number") {

                    var from = device.querySelector('#range-from[data-attribute=' + attributeName + ']').value;
                    var to = device.querySelector('#range-to[data-attribute=' + attributeName + ']').value;

                    // write the min and max values to our devicesData
                    currentAttribute["min"] = from;
                    currentAttribute["max"] = to;

                    // put the current device's attribute in our numberArray so we can use it to generate sliders
                    amountOfNumberValues.push(currentAttribute);
                }

                if (dropdownValue === "Boolean") {

                    // write the possible values to the devicesData
                    currentAttribute["categories"] = [true, false];

                    // put the boolean values in our array so we can loop through it for the control panel
                    amountOfBooleanValues.push(currentAttribute);
                }
            });
        });
    });

    generateControlPanel();

    $.notify({ message: 'Data Values saved succesfully!' }, { type: 'success' });

    $('#collapseDataValues').collapse('hide');
    $('#collapseSDSSetup').collapse('show');
}

// ---- functions needed in the sds settings panel ---- //

function skipSds() {

    $.notify({ message: 'No SDS project!' }, { type: 'success' });

    $('#collapseControlPanel').collapse('show');
    $('#collapseSDSSetup').collapse('hide');
}

function submitSds() {

    isSdsProject = true;

    // store the server name
    sdsSettings.serverName = document.querySelector('.sdsServerName').value;

    // store the streaming project name
    sdsSettings.projectName = document.querySelector('.sdsProjectName').value;

    // store the input stream name
    sdsSettings.inputStreamName = document.querySelector('.sdsInputStreamName').value;

    $.notify({ message: 'SDS settings saved!' }, { type: 'success' });

    $('#collapseControlPanel').collapse('show');
    $('#collapseSDSSetup').collapse('hide');
}

function generateControlPanel() {
    // for every value in the numbersValues array, create a slider
    amountOfNumberValues.forEach(function (value) {

        var slider = input({
            style: 'width:100%',
            id: value.attributeName + "-" + value.deviceName,
            type: 'text',
            value: '',
            'data-slider-min': parseInt(value.min) - 5,
            'data-slider-max': parseInt(value.max) + 5,
            'data-slider-step': 1,
            'data-slider-value': '[' + value.min + ',' + value.max + ']',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        });

        var container = div({
            onClick: sliderValueChanged,
            class: 'sliderContainer',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        }, p({}, "Adjust range for " + value.attributeName + " (" + value.deviceName + "):"), slider);

        // append the container to the body
        controlsForNumberValues.appendChild(container);

        // active the slider
        $("#" + slider.id).slider();
    });

    // for every boolean value, create a dropdown
    amountOfBooleanValues.forEach(function (value) {

        var container = div({
            onChange: controlPanelDropDownSelected,
            class: 'booleanDropdownContainer row',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        }, p({ style: 'padding-left:15px' }, "Fix value for " + value.attributeName + " (" + value.deviceName + "):"), div({ class: 'col-md-9' }, select({
            class: 'form-control',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        }, option({ value: '--' }, '--'), option({ value: 'true' }, 'true'), option({ value: 'false' }, 'false'))), div({ class: 'col-md-3' }, button({
            onClick: nudge,
            class: 'btn btn-danger btn-block nudge',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        }, 'Nudge!')));

        // append the dropdown to the container
        controlsForBooleanValues.appendChild(container);
    });

    // for every string value, create a dropdown
    amountOfStringValues.forEach(function (value) {

        var dropdown = select({
            class: 'form-control',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        }, option({ value: '--' }, '--'));

        var container = div({
            onChange: controlPanelDropDownSelected,
            class: 'stringDropdownContainer',
            'data-attribute': value.attributeName,
            'data-device': value.deviceName
        }, p({}, "Fix value for " + value.attributeName + " (" + value.deviceName + "):"), dropdown);

        // append the dropdown to the container
        controlsForBooleanValues.appendChild(container);

        // generate the options
        var categories = value.categories;

        categories.forEach(function (category) {
            var opt = option({ value: category }, category);
            dropdown.appendChild(opt);
        });
    });
}

// ---- functions needed for the control panel ---- //

function sliderValueChanged(e) {

    var attribute = this.dataset.attribute;
    var device = this.dataset.device;
    var controlPanel = document.querySelector('.controlPanel');
    var inputField = controlPanel.querySelector('input[data-attribute=' + attribute + '][data-device=' + device + ']');
    var minMax = inputField.dataset.value;
    var min = minMax.split(',')[0];
    var max = minMax.split(',')[1];

    devicesData[device][attribute].min = min;
    devicesData[device][attribute].max = max;
}

function nudge(e) {

    var device = this.dataset.device;
    var attribute = this.dataset.attribute;
    var select = document.querySelector('select[data-device=' + device + '][data-attribute=' + attribute + ']');

    // animate the corresponding picture
    // grab corresponding image
    var imageToAnimate = document.querySelector('img[id=' + device + ']');
    imageToAnimate.className += 'animated tada';

    imageToAnimate.addEventListener('animationend', function (e) {
        imageToAnimate.removeAttribute('class');
    });

    // play the homer sound
    var audio = new Audio('./audio/doh.mp3');
    audio.play();

    // set the boolean value to true for 1.5 second
    devicesData[device][attribute]["fixedValue"] = "true";

    console.log(devicesData[device][attribute]);
    setTimeout(function () {
        devicesData[device][attribute]["fixedValue"] = select.options[select.selectedIndex].value;
        console.log(devicesData[device][attribute]);
    }, 4000);
}

function startStreaming() {

    if (isSdsProject) {

        var url = "http://" + sdsSettings.serverName + ":9093/1/authorization";
        var credentials = [{
            "privilege": "write",
            "resourceType": "stream",
            "resource": "default/" + sdsSettings.projectName + "/" + sdsSettings.inputStreamName
        }];

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "headers": {
                "authorization": "Basic " + btoa(document.querySelector('.sdsUsername').value + ":" + document.querySelector('.sdsPassword').value),
                "cache-control": "no-cache"
            },
            "data": JSON.stringify(credentials)
        };

        // fetch the logontoken
        $.ajax(settings).done(function (response) {

            // create post url
            var postUrl = "http://" + sdsSettings.serverName + ":9093/1/workspaces/default/projects/" + sdsSettings.projectName + "/streams/" + sdsSettings.inputStreamName;

            // slice the first chars and the last so we only keep the pure token
            var token = JSON.stringify(response).slice(18, -5) + '"';

            var i = setInterval(function () {
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": postUrl,
                    "method": "POST",
                    "headers": {
                        "authorization": 'SWS-Token "sws-token"=' + token,
                        "cache-control": "no-cache"
                    },
                    "data": JSON.stringify(getDataToSend())
                };
                $.ajax(settings).done(function (response) {
                    console.log("posted successfully, " + response);
                });
            }, 1000);

            streamingInterval.push(i);
        });
    } else {
        var i = setInterval(sendData, 1000);
        streamingInterval.push(i);
    }
}

function flushDb() {

    var settings = {
        "async": true,
        "url": '/simulator/data/delete',
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log("Success: " + response);
    });
}

function stopStreaming() {

    clearInterval(streamingInterval[0]);
    // reset to empty array
    streamingInterval = [];

    if (!isSdsProject) {
        flushDb();
    }
}

function controlPanelDropDownSelected(e) {

    var attribute = this.dataset.attribute;
    var device = this.dataset.device;
    var select = this.querySelector('select');

    devicesData[device][attribute]["fixedValue"] = select.options[select.selectedIndex].value;
}

function getDataToSend() {

    var dataToBeSend = [];

    // build object to be send for every device
    var devices = Object.keys(devicesData);

    devices.forEach(function (device) {
        // attribute names
        var attributes = Object.keys(devicesData[device]);

        attributes.forEach(function (attribute, index) {
            var value = "";
            var currentAttribute = devicesData[device][attribute];

            // check if there is a fixed value present to override the random default
            var hasFixedValue = currentAttribute["fixedValue"] && currentAttribute["fixedValue"] !== "--";

            // get random option from the categories array if dataType is String or Boolean
            if (currentAttribute["dataType"] === "String" || currentAttribute["dataType"] === "Boolean") {
                value = hasFixedValue ? currentAttribute["fixedValue"] : currentAttribute["categories"][Math.floor(Math.random() * currentAttribute["categories"].length)];
            } else {
                value = hasFixedValue ? currentAttribute["fixedValue"] : Math.random() * (parseInt(currentAttribute.max) - parseInt(currentAttribute.min)) + parseInt(currentAttribute.min);
            }

            // put that value in the object
            currentAttribute["value"] = "" + value;

            // add special field to indicate we want to insert into a tabel (for SDS projects)
            currentAttribute["ESP_OPS"] = "i";

            // put a timestamp in the data object
            currentAttribute["timestamp"] = new Date().toISOString();

            // put that in the array (because that is the format that SDS expects: array of objects)
            dataToBeSend.push(currentAttribute);
        });
    });

    return dataToBeSend;
}

function sendData() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3000/simulator/data",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(getDataToSend())
    };
    $.ajax(settings).done(function (response) {
        console.log("posted successfully, " + response);
    });
}

// ##############################################################
// ######           Event Handlers                         ######
// ##############################################################

// ---- Event Listeners needed in the create devices panel ---- //

createDeviceInputFields.forEach(function (input) {
    return input.addEventListener('focus', deviceInputFieldClicked);
});

submitDevicesButton.addEventListener('click', submitDevices);

fileInput.addEventListener('change', pictureSelected);

// ---- Event Listeners needed in the create attribute panel ---- //

submitAttributesButton.addEventListener('click', submitAttributes);

// ---- Event Listeners needed in the add data types panel ---- //

submitDataValuesButton.addEventListener('click', submitDataValues);

// ---- Event Listeners needed in the sds project settings panel ---- //

skipSdsSettingsButton.addEventListener('click', skipSds);

submitSdsSettingsButton.addEventListener('click', submitSds);

// ---- Event Listeners needed in the live control panel ---- //

startStreamButton.addEventListener('click', startStreaming);

stopStreamButton.addEventListener('click', stopStreaming);

},{"elementx":2}]},{},[6]);
