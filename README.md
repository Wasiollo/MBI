# OLC - Overlap Layout Consensus 

[![pipeline status](https://gitlab.com/Wasiollo/mbi/badges/master/pipeline.svg)](https://gitlab.com/Wasiollo/mbi/commits/master)

Project for MBI lessons on WUT, which shows how the OLC algorithm works.
 
 ## Getting Started
 
 These instructions will get you a copy of the project up and running on your local machine for development purposes.
 
 ### Prerequisites
 
 What things you need to install the software and how to install them
 
 ```
 - node 12.13.1
 - npm 6.12.1
 ```
 
 ### Installing
 
 A step by step series of examples that tell you how to get a development env running
 
 Installing dependencies (root directory of project)
 
 ```
 npm install
 ```
 
 Running dev server
 
 ```
 npm run start
 ```
 
 App will start running on port `3000`
 
 ## Deployment
 
 The project is automatically deployed to github pages. ([LINK](https://wasiollo.gitlab.io/mbi/) to the page) 
 Gitlab-ci was used, which after detecting a new change in the master branch builds the project and uploads files.
 
 To deploy the application on your own environment, execute the command
 
 ```
 npm build
 ```

This will create a `build` folder at the root of the project. This folder should be uploaded to your own environment
 
 
 ## Built With
 
 * [AngularJS](https://docs.angularjs.org/api) - The web framework used
 * [npm](https://docs.npmjs.com/) - Dependency management
 * [Webpack](https://maven.apache.org/) - Build process management
 
 ## Authors
 
 * **Mateusz Wasiak**
 * **Mateusz Plesiński**
 
 See the list of [contributors](https://gitlab.com/Wasiollo/mbi/-/graphs/master) who participated in this project.
 
 ## License
 
 This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

 
