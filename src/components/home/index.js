import InputBasedComponent from './home.component';

const homeModule = angular.module('app.home', []);

// loading components, services, directives, specific to this module.
homeModule.component('home', InputBasedComponent);

// export this module
export default homeModule;
