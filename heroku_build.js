'use strict';

if ('HEROKU' in process.env || ('DYNO' in process.env && process.env.HOME === '/app')) {

  const pkg = require('../package.json');
  const ChildProcess = require('child_process');


  let deps = pkg.devDependencies;
  let packages = "";

  try {
    console.log("starting install of python dependencies");
    ChildProcess.execSync(`npm install ${packages}`);
    ChildProcess.execSync(`npm run build:all`);
    ChildProcess.execSync(`npm uninstall ${packages}`);
  }
  catch (err) {
    console.error(err.message);
  }
    
} else {
  console.log("Not Heroku, skipping postinstall build");
}