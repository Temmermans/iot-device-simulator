"use strict";

var yourTurn = "Type some code in here!";
'use strict';

// ##############################################################
// ######           Global Variables                       ######
// ##############################################################

var submitDevicesButton = document.querySelector('#submitDevices');
var submitAttributesButton = document.querySelector('#submitAttributes');
var submitDataValuesButton = document.querySelector('#submitDataValues');
var startStreamButton = document.querySelector('#startStream');
var stopStreamButton = document.querySelector('#stopStream');
var submitSdsSettings = document.querySelector('#safeSDSSettings');
var skipSdsSettings = document.querySelector('#skipSDS');
var createDeviceInputFields = Array.from(document.querySelectorAll('.createDevice'));
var createDeviceForm = document.querySelector('#createDevices');
var createAttributeForm = document.querySelector('.addAttributes');
var controlsForNumberValues = document.querySelector('#controlNumberValues');
var controlsForStringValues = document.querySelector('#controlStringValues');
var controlsForBooleanValues = document.querySelector('#controlBooleanValues');
var photoBanner = document.querySelector('#photos');
var addDataValuesForm = document.querySelector('.addDataValues');
var selectBoxesDataType = Array.from(document.querySelectorAll('select'));
var fileInput = document.querySelector('.deviceImage');
var numberValues = [];
var booleanValues = [];
var stringValues = [];
var devicePictures = [];
var streamingInterval = [];
var isSdsProject = false;
var sdsSettings = {};
var numberOfCreateDevicesInputFields = 1;
var numberOfAttributesCreated = {};
var devicesData = {};
var clientId = guid();

// ##############################################################
// ######           Functions                              ######
// ##############################################################

function pictureSelected(e) {

    // set the label on the button to the name of the file uploaded
    var fileName = '';
    var fileUrl = '';

    if (this.files) fileName = e.target.value.split('\\').pop();

    if (fileName) e.target.previousElementSibling.innerHTML = fileName;else e.target.previousElementSibling.innerHTML = "Select Picture (Optional) ...";

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

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function initSliders() {
    var sliders = Array.from(document.querySelectorAll('.slider.slider-horizontal'));
    var containers = Array.from(document.querySelectorAll('.sliderContainer'));

    sliders.forEach(function (slider) {
        slider.style.width = '100%';
    });

    // listen to clicks on the container of the slider to react to slider changes
    containers.forEach(function (container) {
        container.addEventListener('click', sliderValueChanged);
    });
}

function removeCreatedAttribute(e) {
    var elementToBeRemoved = e.path[2];
    var parentElement = e.path[3];
    var device = e.path[3].dataset.device;
    parentElement.removeChild(elementToBeRemoved);
    numberOfAttributesCreated[device]--;
}

function removeCreatedDevice(e) {
    var elementToBeRemoved = e.path[3];
    createDeviceForm.removeChild(elementToBeRemoved);
    numberOfCreateDevicesInputFields--;
}

function attributeInputFieldClicked(e) {
    // grab the parent div of the clicked input field and the value of the dataset
    var clickedContainer = e.path[3];
    var device = e.path[3].dataset.device;

    // increment the correct number
    numberOfAttributesCreated[device]++;

    // create a new input and add it to the container
    var container = document.createElement('div');
    container.classList = "form-group animated slideInRight";
    var input = "<div class='input-group'>" + "<div class='input-group-addon'>Attribute " + numberOfAttributesCreated[device] + "</div>" + "<input type='text' class='form-control createAttribute' id='" + device + "/attribute" + numberOfAttributesCreated[device] + "' placeholder='Attribute Name (No spaces)'>" + "<div class='input-group-addon removeAttribute'>❌</div>" + "</div>";
    container.innerHTML = input;
    clickedContainer.appendChild(container);

    container.addEventListener('animationend', function (e) {

        // remove the animation so it does not slide in again when clicking through the accordion
        container.className = "form-group";
    });

    container.firstChild.children[1].addEventListener('click', attributeInputFieldClicked);
    container.firstChild.children[2].addEventListener('click', removeCreatedAttribute);
}

function deviceInputFieldClicked() {

    if (document.querySelectorAll('.createDevice').length <= 20) {

        numberOfCreateDevicesInputFields++;

        var container = document.createElement('div');

        container.innerHTML = "<div class='form-group animated slideInRight'>" + "<div class='input-group'>" + "<div class='input-group-addon'>Device " + numberOfCreateDevicesInputFields + "</div>" + "<input type='text' class='form-control createDevice' id='device" + numberOfCreateDevicesInputFields + "' placeholder='Device Name (No spaces)'>" + "<div class='input-group-addon removeDevice'>❌</div>" + "</div>" + "<label class='btn btn-default btn-file' style='margin-top:10px'>" + "<span class='deviceImageLabel'>Select Picture (Optional) ...</span> <input type='file' class='deviceImage' style='display: none;'>" + "</label>" + "</div>";

        createDeviceForm.appendChild(container);

        container.firstChild.firstChild.children[1].addEventListener('click', deviceInputFieldClicked);

        // grab the label to bind the file input event
        var label = container.querySelector('.deviceImage');
        label.addEventListener('change', pictureSelected);

        container.addEventListener('animationend', function (e) {

            // remove the animation so it does not slide in again when clicking through the accordion
            container.firstChild.className = "form-group";
            container.firstChild.firstChild.lastChild.addEventListener('click', removeCreatedDevice);
        });
    }
}

function generateInitialAttributeForm() {

    var devices = Object.keys(devicesData);

    devices.forEach(function (device, index) {
        // set a counter in our array so we can keep track of the different attributes
        numberOfAttributesCreated[device] = 1;

        // create a new container for the device
        var div = document.createElement('div');
        div.dataset.device = device;

        // create a header for the device
        var h2 = document.createElement('h2');
        h2.innerHTML = device;
        div.appendChild(h2);

        // create an input field for this container
        var container = document.createElement('div');
        container.classList = "form-group";
        var input = "<div class='input-group'>" + "<div class='input-group-addon'>Attribute " + numberOfAttributesCreated[device] + "</div>" + "<input type='text' class='form-control createAttribute' id='" + device + "/attribute" + numberOfAttributesCreated[device] + "' placeholder='Attribute Name (No spaces)'>" + "<div class='input-group-addon removeAttribute'>❌</div>" + "</div>";
        container.innerHTML = input;
        div.appendChild(container);

        container.firstChild.children[1].addEventListener('click', attributeInputFieldClicked);

        // add to the addAttributes panel
        document.querySelector('.addAttributes').appendChild(div);
    });
}

function generateDataValuesForm() {
    // create a container for every  key in devicesData
    var devices = Object.keys(devicesData);

    devices.forEach(function (device) {

        // create the container
        var container = document.createElement('div');
        container.dataset.device = device;

        // create a header and append to the container
        var h2 = document.createElement('h2');
        h2.innerHTML = device;
        container.appendChild(h2);

        // create the input element for each attribute and append to container
        var attributes = Object.keys(devicesData[device]);
        attributes.forEach(function (attribute) {

            var form = document.createElement('form');
            form.classList = 'form-inline';

            // create the title of this section and append to the form
            var p = document.createElement('p');
            p.innerHTML = attribute;
            p.classList = 'attribute';
            form.appendChild(p);

            // create the select and append to form
            var select = document.createElement('select');
            select.classList = 'form-control';
            select.dataset.attribute = attribute;
            var options = "<option>String</option>" + "<option>Number</option>" + "<option>Boolean</option>" + "<option>GPS-string</option>";
            select.innerHTML = options;
            form.appendChild(select);

            select.addEventListener('change', function (e) {
                var attribute = this.dataset.attribute;
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
            });

            // create the categories input field and append to the form
            var categoryInput = document.createElement('input');
            categoryInput.dataset.attribute = attribute;
            categoryInput.style.width = '100%';
            categoryInput.style.marginTop = '10px';
            categoryInput.dataset.attribute = attribute;
            categoryInput.type = 'text';
            categoryInput.classList = 'form-control';
            categoryInput.id = 'categories';
            categoryInput.placeholder = 'Enter Categories (comma seperated)';

            // create the inputfields to select a range for numbers

            // container to put the range inputs in and set invisible by default
            var rangeContainer = document.createElement('div');
            rangeContainer.style.display = 'none';
            rangeContainer.dataset.attribute = attribute;

            var fromP = document.createElement('p');
            fromP.innerHTML = 'From';

            rangeContainer.appendChild(fromP);

            // From input
            var numberInputFrom = document.createElement('input');
            numberInputFrom.style.width = '100%';
            numberInputFrom.dataset.attribute = attribute;
            numberInputFrom.type = 'number';
            numberInputFrom.classList = 'form-control';
            numberInputFrom.id = 'range-from';
            numberInputFrom.placeholder = 'From';

            rangeContainer.appendChild(numberInputFrom);

            var toP = document.createElement('p');
            toP.innerHTML = 'To';

            rangeContainer.appendChild(toP);

            // To input
            var numberInputTo = document.createElement('input');
            numberInputTo.style.width = '100%';
            numberInputTo.dataset.attribute = attribute;
            numberInputTo.type = 'number';
            numberInputTo.classList = 'form-control';
            numberInputTo.id = 'range-to';
            numberInputTo.placeholder = 'To';

            rangeContainer.appendChild(numberInputTo);

            form.appendChild(categoryInput);
            form.appendChild(rangeContainer);

            container.appendChild(form);
        });

        addDataValuesForm.appendChild(container);
    });
}

function sliderValueChanged(e) {
    var attribute = this.dataset.attribute;
    var device = this.dataset.device;
    var inputField = document.querySelector('input[data-attribute=' + attribute + '][data-device=' + device + ']');
    var minMax = inputField.dataset.value;
    var min = minMax.split(',')[0];
    var max = minMax.split(',')[1];

    devicesData[device][attribute].min = min;
    devicesData[device][attribute].max = max;
}

function generateControlPanel() {
    // for every value in the numbersValues array, create a slider
    numberValues.forEach(function (value) {
        // container element
        var container = document.createElement('div');
        container.classList = 'sliderContainer';
        container.dataset.attribute = value.attributeName;
        container.dataset.device = value.deviceName;

        // create a textNode and append to container
        var text = document.createTextNode("Adjust range for " + value.attributeName + " (" + value.deviceName + "):");
        container.appendChild(text);

        // create the slider and append to container
        var slider = document.createElement('input');
        slider.id = value.attributeName + "-" + value.deviceName;
        slider.type = 'text';
        slider.value = '';
        slider.dataset.sliderMin = parseInt(value.min) - 5;
        slider.dataset.sliderMax = parseInt(value.max) + 5;
        slider.dataset.sliderStep = '1';
        slider.dataset.sliderValue = '[' + value.min + ',' + value.max + ']';
        slider.dataset.attribute = value.attributeName;
        slider.dataset.device = value.deviceName;

        container.appendChild(slider);

        // append the container to the body
        controlsForNumberValues.appendChild(container);

        // active the slider
        $("#" + slider.id).slider();

        // set the width
        initSliders();
    });

    // for every boolean value, create a dropdown
    booleanValues.forEach(function (value) {
        // container element
        var container = document.createElement('div');
        container.classList = 'booleanDropdownContainer row';
        container.dataset.attribute = value.attributeName;
        container.dataset.device = value.deviceName;

        // create a textNode and append to container
        var text = document.createElement('p');
        text.innerHTML = "Fix value for " + value.attributeName + " (" + value.deviceName + "):";
        text.style.paddingLeft = '15px';
        container.appendChild(text);

        // create two divs to devide the container in columns
        var selectContainer = document.createElement('div');
        selectContainer.classList = 'col-md-9';

        var buttonContainer = document.createElement('div');
        buttonContainer.classList = 'col-md-3';

        // create the dropdown
        var select = document.createElement('select');
        select.classList = 'form-control';
        select.dataset.attribute = value.attributeName;
        select.dataset.device = value.deviceName;

        // generate the options
        var options = value.categories;
        // push a first element into array to have a nothing selected state
        var defaultOption = document.createElement('option');
        defaultOption.innerHTML = '--';
        defaultOption.value = '--';
        select.appendChild(defaultOption);

        options.forEach(function (option) {
            var opt = document.createElement('option');
            opt.value = option;
            opt.innerHTML = option;
            select.appendChild(opt);
        });
        selectContainer.appendChild(select);

        // create a nudge button
        var nudge = document.createElement('button');
        nudge.classList = 'btn btn-danger btn-block nudge';
        nudge.innerHTML = 'Nudge!';
        nudge.dataset.device = value.deviceName;
        nudge.dataset.attribute = value.attributeName;
        buttonContainer.appendChild(nudge);

        // append the select to the container
        container.appendChild(selectContainer);
        container.appendChild(buttonContainer);

        // append the dropdown to the container
        controlsForBooleanValues.appendChild(container);

        initControlPanelDropdowns('.booleanDropdownContainer');
        initNudgeButtons();
    });

    // for every string value, create a dropdown
    stringValues.forEach(function (value) {
        // container element
        var container = document.createElement('div');
        container.classList = 'stringDropdownContainer';
        container.dataset.attribute = value.attributeName;
        container.dataset.device = value.deviceName;

        // create a textNode and append to container
        var text = document.createTextNode("Fix value for " + value.attributeName + " (" + value.deviceName + "):");
        container.appendChild(text);

        // create the dropdown
        var select = document.createElement('select');
        select.classList = 'form-control';
        select.dataset.attribute = value.attributeName;
        select.dataset.device = value.deviceName;

        // generate the options
        var options = value.categories;
        // push a first element into array to have a nothing selected state
        var defaultOption = document.createElement('option');
        defaultOption.innerHTML = '--';
        defaultOption.value = '--';
        select.appendChild(defaultOption);

        options.forEach(function (option) {
            var opt = document.createElement('option');
            opt.value = option;
            opt.innerHTML = option;
            select.appendChild(opt);
        });

        // append the select to the container
        container.appendChild(select);

        // append the dropdown to the container
        controlsForBooleanValues.appendChild(container);

        initControlPanelDropdowns('.stringDropdownContainer');
    });
}

function initNudgeButtons() {
    var buttons = Array.from(document.querySelectorAll('.nudge'));

    buttons.forEach(function (button) {

        button.addEventListener('click', nudge);
    });
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

function initControlPanelDropdowns(selector) {

    var dropdowns = Array.from(document.querySelectorAll(selector));

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', controlPanelDropDownSelected);
    });
}

function controlPanelDropDownSelected(e) {

    var attribute = this.dataset.attribute;
    var device = this.dataset.device;
    var select = this.querySelector('select');

    devicesData[device][attribute]["fixedValue"] = select.options[select.selectedIndex].value;
}

function generateImagesInControlPanel() {
    // grab the different devices from the devicesData
    var devices = Object.keys(devicesData);

    // Now we have two arrays of the same length (pictures and devices)
    devices.forEach(function (device, index) {
        // create an image for every device
        var img = document.createElement('img');
        img.src = devicePictures[index];
        img.id = device;

        // set the width and height fixed and make it a circle
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.borderRadius = '50%';
        img.style.border = '2px solid #F2F2F2';
        img.style.marginLeft = '5px';

        // append the image to the image container on the control panel
        photoBanner.appendChild(img);
    });
}

function submitDevices() {
    devicesData = {};

    // store the different devices as keys in the devicesData object    
    Array.from(document.querySelectorAll('.createDevice')).forEach(function (inputField, index) {
        if (!(inputField.value === "")) {
            devicesData[inputField.value] = {};
        }
    });

    // if object is empty
    if (Object.keys(devicesData).length === 0 && devicesData.constructor === Object) {
        $.notify({
            // options
            message: 'Please fill in at least 1 device.'
        }, {
            // settings
            type: 'danger'
        });
    } else {
        generateInitialAttributeForm();

        $.notify({
            // options
            message: 'Devices saved succesfully!'
        }, {
            // settings
            type: 'success'
        });

        generateImagesInControlPanel();

        $('#collapseCreateDevices').collapse('hide');
        $('#collapseAddAttributes').collapse('show');
    }
}

function submitAttributes() {

    var devices = Array.from(document.querySelectorAll('[data-device]'));

    devices.forEach(function (device) {
        var attributes = Array.from(device.querySelectorAll('.createAttribute'));
        var name = device.dataset.device;

        // loop through attributes and write them to the correct place in the object
        attributes.forEach(function (attribute) {
            if (!(attribute.value === "")) {
                devicesData[name][attribute.value] = {};
            }
        });
    });

    generateDataValuesForm();

    $.notify({
        // options
        message: 'Attributes saved succesfully!'
    }, {
        // settings
        type: 'success'
    });

    $('#collapseAddAttributes').collapse('hide');
    $('#collapseDataValues').collapse('show');
}

function submitDataValues() {
    var devices = Array.from(document.querySelectorAll('.addDataValues div[data-device]'));

    devices.forEach(function (device) {
        var deviceName = device.dataset.device;
        var attributes = Array.from(device.querySelectorAll('.attribute'));

        // loop through different attributes and write metadata to object
        attributes.forEach(function (attribute) {
            var attributeName = attribute.innerHTML;
            var selectBoxes = Array.from(device.querySelectorAll('select[data-attribute=' + attributeName + ']'));

            // loop through every selectbox to write the type of data and based on that write the values in the inputfields
            selectBoxes.forEach(function (selectBox) {
                var selectedValue = selectBox.value;

                // write the type to the metadata in our object
                devicesData[deviceName][attributeName]["dataType"] = selectedValue;
                devicesData[deviceName][attributeName]["deviceName"] = deviceName;
                devicesData[deviceName][attributeName]["attributeName"] = attributeName;

                if (selectedValue === "String") {

                    var stringInput = device.querySelector('#categories[data-attribute=' + attributeName + ']').value;
                    var parsedStringInput = stringInput.split(',');

                    // write the possible values to the devicesData
                    devicesData[deviceName][attributeName]["categories"] = parsedStringInput;

                    // put the current device's attribute in our numberArray so we can use it to generate sliders
                    stringValues.push(devicesData[deviceName][attributeName]);
                }

                if (selectedValue === "Number") {
                    var from = device.querySelector('#range-from[data-attribute=' + attributeName + ']').value;
                    var to = device.querySelector('#range-to[data-attribute=' + attributeName + ']').value;

                    // write the min and max values to our devicesData
                    devicesData[deviceName][attributeName]["min"] = from;
                    devicesData[deviceName][attributeName]["max"] = to;

                    // put the current device's attribute in our numberArray so we can use it to generate sliders
                    numberValues.push(devicesData[deviceName][attributeName]);
                }

                if (selectedValue === "Boolean") {
                    // write the possible values to the devicesData
                    devicesData[deviceName][attributeName]["categories"] = [true, false];

                    // put the boolean values in our array so we can loop through it for the control panel
                    booleanValues.push(devicesData[deviceName][attributeName]);
                }
            });
        });
    });

    generateControlPanel();

    $.notify({
        // options
        message: 'Data Values saved succesfully!'
    }, {
        // settings
        type: 'success'
    });

    $('#collapseDataValues').collapse('hide');
    $('#collapseSDSSetup').collapse('show');
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
            devicesData[device][attribute]["value"] = "" + value;

            // add special field to indicate we want to insert into a tabel (for SDS projects)
            devicesData[device][attribute]["ESP_OPS"] = "i";

            // put a timestamp in the data object
            devicesData[device][attribute]["timestamp"] = new Date().toISOString();

            // put that in the array
            dataToBeSend.push(devicesData[device][attribute]);
        });
    });

    return dataToBeSend;
}

function sendData() {

    console.log(getDataToSend());
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

            console.log(getDataToSend());

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

function stopStreaming() {
    clearInterval(streamingInterval[0]);
    // reset to empty array
    streamingInterval = [];
}

function skipSds() {

    $.notify({
        // options
        message: 'No SDS project!'
    }, {
        // settings
        type: 'success'
    });

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

    $.notify({
        // options
        message: 'SDS settings saved!'
    }, {
        // settings
        type: 'success'
    });

    $('#collapseControlPanel').collapse('show');
    $('#collapseSDSSetup').collapse('hide');
}

// ##############################################################
// ######           Event Handlers                         ######
// ##############################################################

createDeviceInputFields.forEach(function (input) {
    input.addEventListener('focus', deviceInputFieldClicked);
});

submitDevicesButton.addEventListener('click', submitDevices);

submitAttributesButton.addEventListener('click', submitAttributes);

submitDataValuesButton.addEventListener('click', submitDataValues);

startStreamButton.addEventListener('click', startStreaming);

skipSdsSettings.addEventListener('click', skipSds);

submitSdsSettings.addEventListener('click', submitSds);

fileInput.addEventListener('change', pictureSelected);

stopStreamButton.addEventListener('click', stopStreaming);
