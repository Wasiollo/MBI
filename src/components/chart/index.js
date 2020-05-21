import chartComponent from './chart.component';
import chartService from './chart.service';
const headerModule = angular.module('app.chart', []);

// loading components, services, directives, specific to this module.
headerModule.component('appChart', chartComponent);
headerModule.service('chartService', chartService);

// export this module
export default headerModule;
