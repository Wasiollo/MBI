import chartService from './chart/chart.service'

const coreModule = angular.module('app.core', []);

coreModule.service('chartService', chartService);

export default coreModule;
