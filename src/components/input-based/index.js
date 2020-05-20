import InputBasedComponent from './input-based.component';

const inputBasedModule = angular.module('app.input-based', []);

// loading components, services, directives, specific to this module.
inputBasedModule.component('inputBased', InputBasedComponent);

// export this module
export default inputBasedModule;
