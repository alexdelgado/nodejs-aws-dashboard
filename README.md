# AWS Dashboard
A custom-built web-based AWS Dashboard for tracking deployed resources.

## Requirements
You'll need to have the following items installed before continuing.

  * [NodeJS](http://nodejs.org/): Use the installer provided on the NodeJS website.
  * [npm](https://www.npmjs.com/): NPM is distributed with NodeJS - which means that when you download NodeJS, you automatically get NPM installed on your computer.
  * [Gulp](http://gulpjs.com/): Run `[sudo] npm install --global gulp`

## App Dependancies
A listing of all the libraries that this app uses.

  * [AWS JavaScript SDK](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html) - Amazon Web Services JavaScript Library.
  * [Bootswatch:Flatly](https://bootswatch.com/flatly/) - a flat and modern Twitter Bootstrap theme.
  * [jQuery](http://jquery.com) - jQuery JavaScript Library.
  * [jQuery Tablesorter](http://jquery.com) - jQuery plugin for turning a standard HTML table into a sortable table without page refreshes.
  * [SystemJS](https://github.com/systemjs/systemjs) - Configurable module loader enabling dynamic ES module workflows in browsers and NodeJS.
  * [Twitter Bootstrap](http://getbootstrap.com/) - CSS Framework & JavaScript Library
  * [WrapPixel:Ample Admin Template](https://bootswatch.com/flatly/) - a flat and modern Twitter Bootstrap admin dashboard theme.

## Getting Started
A step-by-step guide to ramp-up your development environment.

  * Open a new terminal window and navigate to your development directory.
  * Clone the project into your development directory: `git clone git@github.com:alexdelgado/nodejs-aws-dashboard.git`
  * Navigate to the app directory and install the NPM dependancies: ` cd nodejs-aws-dashboard && npm install`
  * Run gulp to make sure everything has been installed properly: `gulp build`

## Directory Structure
A quick reference guide to help you find what you're looking for.

  * `config`: Contains the nginx configuration file for our app
  * `node_modules`: Contains the dependancies defined in our package.json config
  * `src/img`: Image assets go here
  * `src/node`: Server-side NodeJS scripts go here
  * `src/scss`: Sass files go here
  * `src/ts`: Front-end typescript files go here
  * `src/typings`: Global and Front-end type definitions go here
  * `src/vendor`: Third-party vendor files go here
  * `src/views`: Front-end HTML templates go here
  * `.sass-lint.yml`: Default SCSS Lint configuration overrides are defined here
  * `deploy.sh`: Bash script that installs and provisions our app
  * `gulpfile.js`: Gulp tasks are defined here
  * `package.json`: NPM configuration and package information is defined here
  * `tsconfig.json`: Global Typescript configuration settings are defined here
  * `tslint.json`: Global Typescript linting settings are defined here
  * `typings.json`: Global Typescript dependancies are defined here
