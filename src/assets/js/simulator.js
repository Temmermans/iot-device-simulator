// ##############################################################
// ######           Global Variables                       ######
// ##############################################################

const submitDevicesButton = document.querySelector('#submitDevices');
const submitAttributesButton = document.querySelector('#submitAttributes');
const submitDataValuesButton = document.querySelector('#submitDataValues');
const startStreamButton = document.querySelector('#startStream');
const submitSdsSettings = document.querySelector('#safeSDSSettings');
const skipSdsSettings = document.querySelector('#skipSDS');
const createDeviceInputFields = Array.from(document.querySelectorAll('.createDevice'));
const createDeviceForm = document.querySelector('#createDevices');
const createAttributeForm = document.querySelector('.addAttributes');
const controlsForNumberValues = document.querySelector('#controlNumberValues');
const controlsForStringValues = document.querySelector('#controlStringValues');
const controlsForBooleanValues = document.querySelector('#controlBooleanValues');
const photoBanner = document.querySelector('#photos');
const addDataValuesForm = document.querySelector('.addDataValues');
const selectBoxesDataType = Array.from(document.querySelectorAll('select'));
const fileInput = document.querySelector( '.deviceImage' );
const numberValues = [];
const booleanValues = [];
const stringValues = [];
const devicePictures = [];
var isSdsProject = false;
var sdsSettings = {};
var numberOfCreateDevicesInputFields = 1;
var numberOfAttributesCreated = {};
var devicesData = {};
const clientId = guid();

// ##############################################################
// ######           Functions                              ######
// ##############################################################

function pictureSelected(e) {
    
    // set the label on the button to the name of the file uploaded
    var fileName = '';
    var fileUrl = '';
    
    if( this.files )
        fileName = e.target.value.split( '\\' ).pop();
    
    if( fileName )
        e.target.previousElementSibling.innerHTML = fileName;
    else
        e.target.previousElementSibling.innerHTML = "Select Picture (Optional) ...";
    
    // read image url and push it to pictures array
    if (fileInput.files && fileInput.files[0]) {
        // read the file input, and push it in an array so we can add the picture to the control panel
        const reader = new FileReader();
        reader.onload = function (e) {
            devicePictures.push(e.target.result);
        }
        const image = reader.readAsDataURL(fileInput.files[0]);
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function initSliders() {
    const sliders = Array.from(document.querySelectorAll('.slider.slider-horizontal'));
    const containers = Array.from(document.querySelectorAll('.sliderContainer'));

    sliders.forEach(function (slider) {
        slider.style.width = '100%';
    });

    // listen to clicks on the container of the slider to react to slider changes
    containers.forEach(function (container) {
        container.addEventListener('click', sliderValueChanged);
    });
}

function removeCreatedAttribute(e) {
    const elementToBeRemoved = e.path[2];
    const parentElement = e.path[3];
    const device = e.path[3].dataset.device;
    parentElement.removeChild(elementToBeRemoved);
    numberOfAttributesCreated[device]--;
}

function removeCreatedDevice(e) {
    const elementToBeRemoved = e.path[3];
    createDeviceForm.removeChild(elementToBeRemoved);
    numberOfCreateDevicesInputFields--;
}

function attributeInputFieldClicked(e) {
    // grab the parent div of the clicked input field and the value of the dataset
    const clickedContainer = e.path[3];
    const device = e.path[3].dataset.device;

    // increment the correct number
    numberOfAttributesCreated[device]++;

    // create a new input and add it to the container
    const container = document.createElement('div');
    container.classList = "form-group animated slideInRight";
    const input =
        "<div class='input-group'>" +
        "<div class='input-group-addon'>Attribute " + numberOfAttributesCreated[device] + "</div>" +
        "<input type='text' class='form-control createAttribute' id='" + device + "/attribute" + numberOfAttributesCreated[device] + "' placeholder='Attribute Name (No spaces)'>" +
        "<div class='input-group-addon removeAttribute'>❌</div>" +
        "</div>";
    container.innerHTML = input;
    clickedContainer.appendChild(container);

    container.firstChild.children[1].addEventListener('click', attributeInputFieldClicked);
    container.firstChild.children[2].addEventListener('click', removeCreatedAttribute);
}

function deviceInputFieldClicked() {

    if (document.querySelectorAll('.createDevice').length <= 20) {

        numberOfCreateDevicesInputFields++;

        const container = document.createElement('div');

        container.innerHTML =
            "<div class='form-group animated slideInRight'>" +
            "<div class='input-group'>" +
            "<div class='input-group-addon'>Device " + numberOfCreateDevicesInputFields + "</div>" +
            "<input type='text' class='form-control createDevice' id='device" + numberOfCreateDevicesInputFields + "' placeholder='Device Name'>" +
            "<div class='input-group-addon removeDevice'>❌</div>" +
            "</div>" +
            "<label class='btn btn-default btn-file' style='margin-top:10px'>" +
                "<span class='deviceImageLabel'>Select Picture (Optional) ...</span> <input type='file' class='deviceImage' style='display: none;'>" +
            "</label>" +
            "</div>";

        createDeviceForm.appendChild(container);

        container.firstChild.firstChild.children[1].addEventListener('click', deviceInputFieldClicked);
        
        // grab the label to bind the file input event
        const label = container.querySelector('.deviceImage');
        label.addEventListener('change', pictureSelected);

        container.addEventListener('animationend', function (e) {

            // remove the animation so it does not slide in again when clicking through the accordion
            container.firstChild.className = "form-group";
            container.firstChild.firstChild.lastChild.addEventListener('click', removeCreatedDevice);

        });

    }
}

function generateInitialAttributeForm() {

    const devices = Object.keys(devicesData);

    devices.forEach(function (device, index) {
        // set a counter in our array so we can keep track of the different attributes
        numberOfAttributesCreated[device] = 1;


        // create a new container for the device
        const div = document.createElement('div');
        div.dataset.device = device;

        // create a header for the device
        const h2 = document.createElement('h2');
        h2.innerHTML = device;
        div.appendChild(h2);

        // create an input field for this container
        const container = document.createElement('div');
        container.classList = "form-group";
        const input =
            "<div class='input-group'>" +
            "<div class='input-group-addon'>Attribute " + numberOfAttributesCreated[device] + "</div>" +
            "<input type='text' class='form-control createAttribute' id='" + device + "/attribute" + numberOfAttributesCreated[device] + "' placeholder='Attribute Name (No spaces)'>" +
            "<div class='input-group-addon removeAttribute'>❌</div>" +
            "</div>";
        container.innerHTML = input;
        div.appendChild(container);

        container.firstChild.children[1].addEventListener('click', attributeInputFieldClicked);

        // add to the addAttributes panel
        document.querySelector('.addAttributes').appendChild(div);
    });

}

function generateDataValuesForm() {
    // create a container for every  key in devicesData
    const devices = Object.keys(devicesData);

    devices.forEach(function (device) {

        // create the container
        const container = document.createElement('div');
        container.dataset.device = device;

        // create a header and append to the container
        const h2 = document.createElement('h2');
        h2.innerHTML = device;
        container.appendChild(h2);

        // create the input element for each attribute and append to container
        const attributes = Object.keys(devicesData[device]);
        attributes.forEach(function (attribute) {

            const form = document.createElement('form');
            form.classList = 'form-inline';

            // create the title of this section and append to the form
            const p = document.createElement('p');
            p.innerHTML = attribute;
            p.classList = 'attribute';
            form.appendChild(p);

            // create the select and append to form
            const select = document.createElement('select');
            select.classList = 'form-control';
            select.dataset.attribute = attribute;
            const options =
                "<option>String</option>" +
                "<option>Number</option>" +
                "<option>Boolean</option>" +
                "<option>GPS-string</option>";
            select.innerHTML = options;
            form.appendChild(select);

            select.addEventListener('change', function (e) {
                const attribute = this.dataset.attribute;
                const selectedValue = this.value;
                const categoryInput = form.querySelector('input[data-attribute=' + attribute + ']');
                const rangeInput = form.querySelector('div[data-attribute=' + attribute + ']');

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
            const categoryInput = document.createElement('input');
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
            const rangeContainer = document.createElement('div');
            rangeContainer.style.display = 'none';
            rangeContainer.dataset.attribute = attribute;

            const fromP = document.createElement('p');
            fromP.innerHTML = 'From';

            rangeContainer.appendChild(fromP);

            // From input
            const numberInputFrom = document.createElement('input');
            numberInputFrom.style.width = '100%';
            numberInputFrom.dataset.attribute = attribute;
            numberInputFrom.type = 'number';
            numberInputFrom.classList = 'form-control';
            numberInputFrom.id = 'range-from';
            numberInputFrom.placeholder = 'From';

            rangeContainer.appendChild(numberInputFrom);

            const toP = document.createElement('p');
            toP.innerHTML = 'To';

            rangeContainer.appendChild(toP);

            // To input
            const numberInputTo = document.createElement('input');
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
    const attribute = this.dataset.attribute;
    const device = this.dataset.device;
    const inputField = document.querySelector('input[data-attribute=' + attribute + '][data-device=' + device + ']');
    const minMax = inputField.dataset.value;
    const min = minMax.split(',')[0];
    const max = minMax.split(',')[1];

    devicesData[device][attribute].min = min;
    devicesData[device][attribute].max = max;
}

function generateControlPanel() {
    // for every value in the numbersValues array, create a slider
    numberValues.forEach(function (value) {
        // container element
        const container = document.createElement('div');
        container.classList = 'sliderContainer';
        container.dataset.attribute = value.attributeName;
        container.dataset.device = value.deviceName;

        // create a textNode and append to container
        const text = document.createTextNode("Adjust range for " + value.attributeName + " (" + value.deviceName + "):");
        container.appendChild(text);

        // create the slider and append to container
        const slider = document.createElement('input');
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
        const container = document.createElement('div');
        container.classList = 'booleanDropdownContainer row';
        container.dataset.attribute = value.attributeName;
        container.dataset.device = value.deviceName;

        // create a textNode and append to container
        const text = document.createElement('p'); 
        text.innerHTML = "Fix value for " + value.attributeName + " (" + value.deviceName + "):";
        text.style.paddingLeft = '15px';
        container.appendChild(text);
        
        // create two divs to devide the container in columns
        const selectContainer = document.createElement('div');
        selectContainer.classList = 'col-md-9';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList = 'col-md-3';

        // create the dropdown
        const select = document.createElement('select');
        select.classList = 'form-control';
        select.dataset.attribute = value.attributeName;
        select.dataset.device = value.deviceName;

        // generate the options
        const options = value.categories;
        // push a first element into array to have a nothing selected state
        const defaultOption = document.createElement('option');
        defaultOption.innerHTML = '--';
        defaultOption.value = '--';
        select.appendChild(defaultOption);

        options.forEach(function (option) {
            const opt = document.createElement('option');
            opt.value = option;
            opt.innerHTML = option;
            select.appendChild(opt);
        });
        selectContainer.appendChild(select);
        
        // create a nudge button
        const nudge = document.createElement('button');
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
        const container = document.createElement('div');
        container.classList = 'stringDropdownContainer';
        container.dataset.attribute = value.attributeName;
        container.dataset.device = value.deviceName;

        // create a textNode and append to container
        const text = document.createTextNode("Fix value for " + value.attributeName + " (" + value.deviceName + "):");
        container.appendChild(text);

        // create the dropdown
        const select = document.createElement('select');
        select.classList = 'form-control';
        select.dataset.attribute = value.attributeName;
        select.dataset.device = value.deviceName;

        // generate the options
        const options = value.categories;
        // push a first element into array to have a nothing selected state
        const defaultOption = document.createElement('option');
        defaultOption.innerHTML = '--';
        defaultOption.value = '--';
        select.appendChild(defaultOption);

        options.forEach(function (option) {
            const opt = document.createElement('option');
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
    const buttons = Array.from(document.querySelectorAll('.nudge'));
    
    buttons.forEach(function(button) {
       
        button.addEventListener('click', nudge);
        
    });
    
}

function nudge(e) {
    const device = this.dataset.device;
    const attribute = this.dataset.attribute;
    const select = document.querySelector('select[data-device=' + device + '][data-attribute=' + attribute + ']');
    
    // animate the corresponding picture
    // grab corresponding image
    const imageToAnimate = document.querySelector('img[id=' + device + ']');
    imageToAnimate.className += 'animated tada';
    
    imageToAnimate.addEventListener('animationend', function(e) {
        imageToAnimate.removeAttribute('class');
    });

    // set the boolean value to true for 1.5 second
    devicesData[device][attribute]["fixedValue"] = "true";
    
    console.log(devicesData[device][attribute]);
    setTimeout(function() {
       devicesData[device][attribute]["fixedValue"] = select.options[select.selectedIndex].value;
        console.log(devicesData[device][attribute]);
    } , 4000);
    
}

function initControlPanelDropdowns(selector) {

    const dropdowns = Array.from(document.querySelectorAll(selector));

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', controlPanelDropDownSelected);
    });

}

function controlPanelDropDownSelected(e) {

    const attribute = this.dataset.attribute;
    const device = this.dataset.device;
    const select = this.querySelector('select');

    devicesData[device][attribute]["fixedValue"] = select.options[select.selectedIndex].value;

}

function generateImagesInControlPanel() {
    // grab the different devices from the devicesData
    const devices = Object.keys(devicesData);
    
    // Now we have two arrays of the same length (pictures and devices)
    devices.forEach(function(device, index) {
       // create an image for every device
        const img = document.createElement('img');
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

    const devices = Array.from(document.querySelectorAll('[data-device]'));

    devices.forEach(function (device) {
        const attributes = Array.from(device.querySelectorAll('.createAttribute'));
        const name = device.dataset.device;

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
    const devices = Array.from(document.querySelectorAll('.addDataValues div[data-device]'));

    devices.forEach(function (device) {
        const deviceName = device.dataset.device;
        const attributes = Array.from(device.querySelectorAll('.attribute'));

        // loop through different attributes and write metadata to object
        attributes.forEach(function (attribute) {
            const attributeName = attribute.innerHTML;
            const selectBoxes = Array.from(device.querySelectorAll('select[data-attribute=' + attributeName + ']'));

            // loop through every selectbox to write the type of data and based on that write the values in the inputfields
            selectBoxes.forEach(function (selectBox) {
                const selectedValue = selectBox.value;

                // write the type to the metadata in our object
                devicesData[deviceName][attributeName]["dataType"] = selectedValue;
                devicesData[deviceName][attributeName]["deviceName"] = deviceName;
                devicesData[deviceName][attributeName]["attributeName"] = attributeName;

                if (selectedValue === "String") {

                    const stringInput = device.querySelector('#categories[data-attribute=' + attributeName + ']').value;
                    const parsedStringInput = stringInput.split(',');

                    // write the possible values to the devicesData
                    devicesData[deviceName][attributeName]["categories"] = parsedStringInput;

                    // put the current device's attribute in our numberArray so we can use it to generate sliders
                    stringValues.push(devicesData[deviceName][attributeName]);

                }

                if (selectedValue === "Number") {
                    const from = device.querySelector('#range-from[data-attribute=' + attributeName + ']').value;
                    const to = device.querySelector('#range-to[data-attribute=' + attributeName + ']').value;

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

    const dataToBeSend = [];

    // build object to be send for every device
    const devices = Object.keys(devicesData);

    devices.forEach(function (device) {
        // attribute names
        const attributes = Object.keys(devicesData[device]);

        attributes.forEach(function (attribute, index) {
            var value = "";
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
        const url = "http://" + sdsSettings.serverName + ":9093/1/authorization";
        const credentials = [
            {
                "privilege": "write",
                "resourceType": "stream",
                "resource": "default/" + sdsSettings.projectName + "/" + sdsSettings.inputStreamName
            }
        ];

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
        }

        // fetch the logontoken
        $.ajax(settings).done(function (response) {

            // create post url
            const postUrl = "http://" + sdsSettings.serverName +
                ":9093/1/workspaces/default/projects/" + sdsSettings.projectName + "/streams/" + sdsSettings.inputStreamName;

            // slice the first chars and the last so we only keep the pure token
            const token = JSON.stringify(response).slice(18, -5) + '"';

            console.log(getDataToSend());

            setInterval(function () {
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
                }
                $.ajax(settings).done(function (response) {
                    console.log("posted successfully, " + response);
                });
            }, 1000);
        });
    } else {
        setInterval(sendData, 1000);
    }
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