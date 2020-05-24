import chartComponent from './new-chart.component';
const newChartModule = angular.module('app.new-chart', []);

// loading components, services, directives, specific to this module.
newChartModule.component('appNewChart', chartComponent);

// export this module
export default newChartModule;
