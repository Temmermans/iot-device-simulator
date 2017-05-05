# Iot Device Simulator

### Info

This package can be used to deploy an IoT device simulator on your local machine. Can be used in conjunction with SDS to build demo's and prototypes.

**Check out this demo video right here: [example no SDS](https://vimeo.com/216167084)**

### Use

1. First of all install nodejs from the following location: [Node.js](https://nodejs.org/en/)

   Download the stable version (recommended for most users). Follow the Wizard.
   
   To test if everything is working, open a command prompt and type (if you already had a prompt open, close it first):
   ```
    $ node --version
   ```
   
   If you get an error, uninstall and install again.
   
2. Download Git from following location: [Git](https://git-scm.com/downloads)

   Follow the wizard (When asked if you want to add to your path, click yes).
   
   To test if everything is working, open a command prompt and type (if you already had a prompt open, close it first):
   ```
    $ git --version
   ```
   If you get an error, uninstall and install again.
   
3. Download and install mongodb from the following location (only needed of you want to stream to other things outside SDS):
    - for Mac: [with homebrew](https://docs.mongodb.com/v3.0/tutorial/install-mongodb-on-os-x/) or [installer](https://www.mongodb.com/download-center#community)
    - for Windows: [mongodb for windows](https://www.mongodb.com/download-center#community)
    
    Check to see if you can run mongod from the command prompt.
   
4. Navigate to a folder on your local machine where you want to store the application.

5. Open a command prompt and navigate to that specific folder (to get the path, just copy paste it from the finder window):
   ```
    $ cd <path/to/folder> // omit the <>
   ```
6. Clone the project into the folder iot-device-simulator and move into the folder on the command Prompt:
    ```
    $ git clone https://github.com/Temmermans/iot-device-simulator.git iot-device-simulator && cd iot-device-simulator
    ```
7. Install all the necessary libs via the following command:
    ```
    $ npm install
    ```
8. Start the local server with the following command:
    ```
    $ npm run dev
    ```
9. Navigate to the following url on the localhost: [localhost](http://localhost:3000/simulator)


If you an access-Control-Allow-Origin error install following chrome extension: Allow-Control-Allow-Origin and enable it, make sure the icon is green and then try again.
If using other sites, makes sure to turn it off again.

![alt text](./readme-images/chrome-extension.png)

#### Nudge button

The control panel has the option to adjust the values while streaming of the attributes you entered. For numeric values you will see a slider. For booleans and categorical values you see a dropdown. This is useful for when you want to demo certain events in your streaming logic. Also, the nudge button provides the possibility to simulate a sudden event. For example a door that opens for a short period of time or a package that gets bumped. 

#### SDS

**Demo video coming soon**

For SDS projects, provide the necessary details in the SDS panel. With the correct credentials, you should see data coming in in the windows of yout SDS project.

#### Other

**Check out this demo video right here: [example no SDS](https://vimeo.com/216167084)**

If you skip the SDS project, the app will start streaming data to the following endpoint: [/simulator/data](http://localhost:3000/simulator/data) as JSON. This can then be consumed by a front end tool capable of doing REST requests. Keep in mind that to use this, you will need to install mongodb on your local machine. (see above).

Every time you press the stop streaming button, the db will be flushed, to avoid taking up to much space when streaming regularly.

### ToDo

- Form Validation
- Document Walkthrough
- If no pictures are selected, give default
- ...

### Contributions

Contributions and ideas are more than welcome!
