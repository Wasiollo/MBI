import chartComponent from './chart.component';

const headerModule = angular.module('app.chart', []);

// loading components, services, directives, specific to this module.
headerModule.component('appChart', chartComponent);

// export this module
export default headerModule;