// ##############################################################
// ######           Global letiables                       ######
// ##############################################################

// ----- Buttons -----//
const submitDevicesButton = document.querySelector('#submitDevices');
const submitAttributesButton = document.querySelector('#submitAttributes');
const submitDataValuesButton = document.querySelector('#submitDataValues');
const startStreamButton = document.querySelector('#startStream');
const stopStreamButton = document.querySelector('#stopStream');
const submitSdsSettingsButton = document.querySelector('#safeSDSSettings');
const skipSdsSettingsButton = document.querySelector('#skipSDS');

// --- Input fields ---//
const createDeviceInputFields = Array.from(document.querySelectorAll('.createDevice'));
const controlsForNumberValues = document.querySelector('#controlNumberValues');
const controlsForStringValues = document.querySelector('#controlStringValues');
const controlsForBooleanValues = document.querySelector('#controlBooleanValues');
const fileInput = document.querySelector('.deviceImage');

// --- Containers ---//
const createDeviceForm = document.querySelector('#createDevices');
const createAttributeForm = document.querySelector('.addAttributes');
const createDataValueForm = document.querySelector('.addDataValues');
const photoBanner = document.querySelector('#photos');

// ----- State -----//

// arrays to store the attributes from the devicesData object to loop through them and create sliders in 
// control panel
const amountOfNumberValues = [];
const amountOfBooleanValues = [];
const amountOfStringValues = [];

// array of base64 image urls
const devicePictures = [];

// global var to store the interval running to push data (so we can clear it)
let streamingInterval = [];

// if sds project is used, store the settings entered by the user
let isSdsProject = false;
let sdsSettings = {};

// vars to store the amount of devices and attributes created (to show counter next to input field)
let numberOfCreateDevicesInputFields = 1;
let numberOfAttributesCreated = {};

// object to store all data the user enters
let devicesData = {};

// using elementx to create DOM elements (cleaner syntax that just document.createElement)
const {
    div,
    h1,
    h2,
    button,
    input,
    select,
    label,
    span,
    option,
    img,
    form,
    p
} = require('elementx');

// ##############################################################
// ######           Functions                              ######
// ##############################################################

function removeElements(selector) {
    
    const elements = $(selector);
        elements.each(function(index, element) {
           element.remove();
        }); 
}

// ---- functions needed in the create devices panel ---- //
function removeCreatedDevice(e) {
    
    const elementToBeRemoved = e.path[3];
    createDeviceForm.removeChild(elementToBeRemoved);
    numberOfCreateDevicesInputFields--;
    
}

function deviceInputFieldClicked() {

    if (document.querySelectorAll('.createDevice').length <= 20) {
        numberOfCreateDevicesInputFields++;
        const deviceId = `device${numberOfCreateDevicesInputFields}`;

        // build the new input field
        const container =
            div(
                div({ class: 'form-group animated slideInRight'},
                    div({ class: 'input-group' },
                        div({ class: 'input-group-addon' }, 'Device ' + numberOfCreateDevicesInputFields),
                        input({
                            onClick: deviceInputFieldClicked,
                            type: 'text',
                            class: 'form-control createDevice',
                            id: deviceId,
                            placeholder: 'Device name (No Spaces)'
                        }),
                        div({ onClick: removeCreatedDevice, class: 'input-group-addon removeDevice' }, '❌')
                    ),
                    label({ class: 'btn btn-default btn-file', style: 'margin-top:10px' },
                        span({ class: 'deviceImageLabel' }, 'Select Picture'),
                        input({
                            onChange: pictureSelected,
                            type: 'file',
                            class: 'deviceImage',
                            style: 'display:none'
                        })
                    )
                )
            );

        createDeviceForm.appendChild(container);

        container.addEventListener('animationend', function (e) {
            // remove the animation so it does not slide in again when clicking through the accordion
            container.firstChild.className = "form-group";
        });
    }
    
}

function generateInitialAttributeForm() {

    const devices = Object.keys(devicesData);

    devices.forEach(function (device, index) {
        // set a counter in our array so we can keep track of the different attributes
        numberOfAttributesCreated[device] = 1;
        const attributeId = `${device}/attribute${numberOfAttributesCreated[device]}`;

        // create the a form for each device entered
        const node =
            div({ 'data-device': device },
                h2({}, device),
                div({ class: 'form-group' },
                    div({ class: 'input-group' },
                        div({ class: 'input-group-addon' }, 'Attribute ' + numberOfAttributesCreated[device]),
                        input({
                            onClick: attributeInputFieldClicked,
                            type: 'text',
                            class: 'form-control createAttribute',
                            id: attributeId,
                            placeholder: 'Attribute Name (No spaces)'
                        }),
                        div({ class: 'input-group-addon removeAttribute' }, '❌')
                    )
                )
            );

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
        $.notify({ message: 'Please fill in at least 1 device.'}, { type: 'danger' });
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
    const devices = Object.keys(devicesData);

    // Now we have two arrays of the same length (pictures and devices)
    devices.forEach(function (device, index) {
        // create image for every device
        const image =
            img({
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
    let fileName = '';
    let fileUrl = '';

    if (this.files)
        fileName = e.target.value.split('\\').pop();

    if (fileName)
        e.target.previousElementSibling.innerHTML = fileName;
    else
        e.target.previousElementSibling.innerHTML = "Select Picture ...";

    // read image url and push it to pictures array
    if (fileInput.files && fileInput.files[0]) {
        // read the file input, and push it in an array so we can add the picture to the control panel
        const reader = new FileReader();
        reader.onload = function (e) {
            devicePictures.push(e.target.result);
        }
        const image = reader.readAsDataURL(this.files[0]);
    }
}

// ---- functions needed in the create attributes panel ---- //

function removeCreatedAttribute(e) {
    
    const elementToBeRemoved = e.path[2];
    const parentElement = e.path[3];
    const device = parentElement.dataset.device;
    parentElement.removeChild(elementToBeRemoved);
    numberOfAttributesCreated[device]--;
    
}

function attributeInputFieldClicked(e) {
    // grab the parent div of the clicked input field and the value of the dataset
    const clickedContainer = e.path[3];
    const device = e.path[3].dataset.device;

    // increment the correct number
    numberOfAttributesCreated[device]++;

    const attributeId = `${device}/attribute${numberOfAttributesCreated[device]}`;

    const container =
        div({ class: 'form-group animated slideInRight' },
            div({ class: 'input-group' },
                div({ class: 'input-group-addon' }, "Attribute " + numberOfAttributesCreated[device]),
                input({
                    onClick: attributeInputFieldClicked,
                    type: 'text',
                    class: 'form-control createAttribute',
                    id: attributeId,
                    placeholder: 'Attribute Name (No spaces)'
                }),
                div({ onClick: removeCreatedAttribute, class: 'input-group-addon removeAttribute' }, '❌')
            )
        );

    clickedContainer.appendChild(container);

    container.addEventListener('animationend', function (e) {
        // remove the animation so it does not slide in again when clicking through the accordion
        container.className = "form-group";
    });
}

function dataTypeSelected() {
    
    const attribute = this.dataset.attribute;
    const selectedValue = this.value;
    const categoryInput = document.querySelector('input[data-attribute=' + attribute + ']');
    const rangeInput = document.querySelector('div[data-attribute=' + attribute + ']');

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
    const devices = Object.keys(devicesData);

    devices.forEach(function (device) {
        // create the container
        const container = div({ 'data-device': device },
            h2({}, device)
        );

        // create a form for every attribute for every device so the user can enter data type values
        const attributes = Object.keys(devicesData[device]);
        attributes.forEach(function (attribute) {

            // drodown to select what the data type is of the attribute
            const dataTypesDropDown =
                select({
                        onChange: dataTypeSelected,
                        class: 'form-control',
                        'data-attribute': attribute
                    },
                    option({}, "String"),
                    option({}, "Number"),
                    option({}, "Boolean"),
                    option({}, "GPS-String")
                );

            // input field to enter categorical values
            const categoryInput =
                input({
                    'data-attribute': attribute,
                    style: 'width:100%;margin-top:10px;',
                    type: 'text',
                    class: 'form-control',
                    id: 'categories',
                    placeholder: 'Enter categories (comma seperated)'
                });

            // input field to enter numerical values
            const rangeInput =
                div({ style: 'display:none', 'data-attribute': attribute },
                    p({}, 'From'),
                    input({
                        style: 'width:100%',
                        'data-attribute': attribute,
                        type: 'number',
                        class: 'form-control',
                        id: 'range-from',
                        placeholder: 'From'
                    }),
                    p({}, 'To'),
                    input({
                        style: 'width:100%',
                        'data-attribute': attribute,
                        type: 'number',
                        class: 'form-control',
                        id: 'range-to',
                        placeholder: 'To'
                    }),
                );


            const dataValueForm =
                form({ class: 'form-inline' },
                    p({ class: 'attribute' }, attribute),
                    dataTypesDropDown,
                    categoryInput,
                    rangeInput
                );

            container.appendChild(dataValueForm);

        });

        createDataValueForm.appendChild(container);

    });
}

function submitAttributes() {
    
    removeElements('.addDataValues div[data-device]');

    const devices = Array.from(document.querySelectorAll('[data-device]'));

    devices.forEach(function (device) {
        const attributes = Array.from(device.querySelectorAll('.createAttribute'));
        const name = device.dataset.device;
        
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
    const devices = Array.from(document.querySelectorAll('.addDataValues div[data-device]'));

    devices.forEach(function (device) {
        const deviceName = device.dataset.device;
        // grab the attributes based on the p elements in each data type form
        const attributes = Array.from(device.querySelectorAll('.attribute'));

        // loop through different attributes and write the selections to our main object, devicesData
        attributes.forEach(function (attribute) {
            const attributeName = attribute.innerHTML;
            const dataTypesDropdown = Array.from(device.querySelectorAll('select[data-attribute=' + attributeName + ']'));
            const currentAttribute = devicesData[deviceName][attributeName];

            // loop through every dropdown to write the type of data and based on that write the values in the inputfields
            dataTypesDropdown.forEach(function (dropdown) {
                const dropdownValue = dropdown.value;

                // write some metadata to our current attribute
                currentAttribute["dataType"] = dropdownValue;
                currentAttribute["deviceName"] = deviceName;
                currentAttribute["attributeName"] = attributeName;

                if (dropdownValue === "String") {

                    // user select the string as input, so we read the category input field for values
                    const stringInput = device.querySelector('#categories[data-attribute=' + attributeName + ']').value;
                    const parsedStringInput = stringInput.split(',');

                    // write the possible values to the devicesData
                    currentAttribute["categories"] = parsedStringInput;

                    // put the current device's attribute in our stringArray so we can loop trough that array for the control panel
                    amountOfStringValues.push(currentAttribute);

                }

                if (dropdownValue === "Number") {

                    const from = device.querySelector('#range-from[data-attribute=' + attributeName + ']').value;
                    const to = device.querySelector('#range-to[data-attribute=' + attributeName + ']').value;

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

        const slider =
            input({
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


        const container =
            div({
                    onClick: sliderValueChanged,
                    class: 'sliderContainer',
                    'data-attribute': value.attributeName,
                    'data-device': value.deviceName
                },
                p({}, "Adjust range for " + value.attributeName + " (" + value.deviceName + "):"),
                slider
            )

        // append the container to the body
        controlsForNumberValues.appendChild(container);

        // active the slider
        $("#" + slider.id).slider();
    });

    // for every boolean value, create a dropdown
    amountOfBooleanValues.forEach(function (value) {

        const container =
            div({
                    onChange: controlPanelDropDownSelected,
                    class: 'booleanDropdownContainer row',
                    'data-attribute': value.attributeName,
                    'data-device': value.deviceName
                },
                p({ style: 'padding-left:15px' }, "Fix value for " + value.attributeName + " (" + value.deviceName + "):"),
                div({ class: 'col-md-9' },
                    select({
                            class: 'form-control',
                            'data-attribute': value.attributeName,
                            'data-device': value.deviceName
                        },
                        option({ value: '--' }, '--'),
                        option({ value: 'true' }, 'true'),
                        option({ value: 'false' }, 'false')

                    )
                ),
                div({ class: 'col-md-3' },
                    button({
                        onClick: nudge,
                        class: 'btn btn-danger btn-block nudge',
                        'data-attribute': value.attributeName,
                        'data-device': value.deviceName
                    }, 'Nudge!')
                )
            );

        // append the dropdown to the container
        controlsForBooleanValues.appendChild(container);
    });

    // for every string value, create a dropdown
    amountOfStringValues.forEach(function (value) {

        const dropdown =
            select({
                    class: 'form-control',
                    'data-attribute': value.attributeName,
                    'data-device': value.deviceName
                },
                option({ value: '--' }, '--')
            );

        const container =
            div({
                    onChange: controlPanelDropDownSelected,
                    class: 'stringDropdownContainer',
                    'data-attribute': value.attributeName,
                    'data-device': value.deviceName
                },
                p({}, "Fix value for " + value.attributeName + " (" + value.deviceName + "):"),
                dropdown
            );

        // append the dropdown to the container
        controlsForBooleanValues.appendChild(container);

        // generate the options
        const categories = value.categories;

        categories.forEach(function (category) {
            const opt = option({ value: category }, category);
            dropdown.appendChild(opt);
        });
    });

}

// ---- functions needed for the control panel ---- //

function sliderValueChanged(e) {
    
    const attribute = this.dataset.attribute;
    const device = this.dataset.device;
    const inputField = document.querySelector('input[data-attribute=' + attribute + '][data-device=' + device + ']');
    const minMax = inputField.dataset.value;
    const min = minMax.split(',')[0];
    const max = minMax.split(',')[1];

    devicesData[device][attribute].min = min;
    devicesData[device][attribute].max = max;
    
}

function nudge(e) {
    
    const device = this.dataset.device;
    const attribute = this.dataset.attribute;
    const select = document.querySelector('select[data-device=' + device + '][data-attribute=' + attribute + ']');

    // animate the corresponding picture
    // grab corresponding image
    const imageToAnimate = document.querySelector('img[id=' + device + ']');
    imageToAnimate.className += 'animated tada';

    imageToAnimate.addEventListener('animationend', function (e) {
        imageToAnimate.removeAttribute('class');
    });

    // play the homer sound
    let audio = new Audio('./audio/doh.mp3');
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
        
        const stream = stream();
        
        const url = "http://" + sdsSettings.serverName + ":9093/1/authorization";
        const credentials = [
            {
                "privilege": "write",
                "resourceType": "stream",
                "resource": "default/" + sdsSettings.projectName + "/" + sdsSettings.inputStreamName
            }
        ];

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "headers": {
                "authorization": "Basic " + btoa(document.querySelector('.sdsUsername').value + ":" + document.querySelector('.sdsPassword').value),
                "cache-control": "no-cache"
            },
            "data": JSON.stringify(credentials)
        }

        // fetch the logontoken
        $.ajax(settings).done(function (response) {

            // create post url
            const postUrl = "http://" + sdsSettings.serverName +
                ":9093/1/workspaces/default/projects/" + sdsSettings.projectName + "/streams/" + sdsSettings.inputStreamName;

            // slice the first chars and the last so we only keep the pure token
            const token = JSON.stringify(response).slice(18, -5) + '"';

            const i = setInterval(function () {
                let settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": postUrl,
                    "method": "POST",
                    "headers": {
                        "authorization": 'SWS-Token "sws-token"=' + token,
                        "cache-control": "no-cache"
                    },
                    "data": JSON.stringify(getDataToSend())
                }
                $.ajax(settings).done(function (response) {
                    console.log("posted successfully, " + response);
                });
            }, 1000);

            streamingInterval.push(i);
        });
    } else {
        const i = setInterval(sendData, 1000);
        streamingInterval.push(i);
    }
}

function flushDb() {
    
    let settings = {
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

    const attribute = this.dataset.attribute;
    const device = this.dataset.device;
    const select = this.querySelector('select');

    devicesData[device][attribute]["fixedValue"] = select.options[select.selectedIndex].value;

}

function getDataToSend() {

    const dataToBeSend = [];

    // build object to be send for every device
    const devices = Object.keys(devicesData);

    devices.forEach(function (device) {
        // attribute names
        const attributes = Object.keys(devicesData[device]);

        attributes.forEach(function (attribute, index) {
            let value = "";
            const currentAttribute = devicesData[device][attribute];

            // check if there is a fixed value present to override the random default
            const hasFixedValue = currentAttribute["fixedValue"] && currentAttribute["fixedValue"] !== "--";

            // get random option from the categories array if dataType is String or Boolean
            if (currentAttribute["dataType"] === "String" || currentAttribute["dataType"] === "Boolean") {
                value = hasFixedValue ? currentAttribute["fixedValue"] : currentAttribute["categories"][Math.floor(Math.random() * currentAttribute["categories"].length)];
            } else {
                value = hasFixedValue ? currentAttribute["fixedValue"] : (Math.random() * (parseInt(currentAttribute.max) - parseInt(currentAttribute.min))) + parseInt(currentAttribute.min);
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
    }
    $.ajax(settings).done(function (response) {
        console.log("posted successfully, " + response);
    });

}

// ##############################################################
// ######           Event Handlers                         ######
// ##############################################################

// ---- Event Listeners needed in the create devices panel ---- //

createDeviceInputFields.forEach(input => input.addEventListener('focus', deviceInputFieldClicked));

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
