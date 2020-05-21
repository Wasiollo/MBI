export default class ChartService {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
    }

    addLink(source, target) {
        const linkData = {"source": source, "target": target}
        this.$rootScope.$broadcast('addLink', linkData);
    }
}
