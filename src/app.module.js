// for loading styles we need to load main scss file
import './styles/styles.scss';

// loading shared module
import './services/core.module';
// loading all module components
import './app.components';
import toastr from "angular-toastr"

const appModule = angular
    .module('mbi', [
        // shared module
        'app.core',
        // 3rd party modules
        'ui.router',
        'toastr',
        // application specific modules
        'app.header',
        'app.home',
        'app.user',
        'app.chart',
        'app.input-based',
        'app.new-chart'
    ]);

export default appModule;
