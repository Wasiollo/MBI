export default class ChartService {
    constructor($rootScope) {
        'ngInject';
        this.rootScope = $rootScope;
    }

    addLink(source, target) {
        const linkData = {"source": source, "target": target}
        this.rootScope.$broadcast('addLink', linkData);
    }
    clearGraph() {
        this.rootScope.$broadcast('clearGraph');
    }
}
