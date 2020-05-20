import fileBasedComponent from './file-based.component';

const homeModule = angular.module('app.file-based', []);

// loading components, services, directives, specific to this module.
homeModule.component('fileBased', fileBasedComponent);

// export this module
export default homeModule;
