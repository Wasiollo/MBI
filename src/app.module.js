// for loading styles we need to load main scss file
import './styles/styles.scss';

// loading shared module
import './services/core.module';
// loading all module components
import './app.components';

const appModule = angular
    .module('mbi', [
        // shared module
        'app.core',
        // 3rd party modules
        'ui.router',
        // application specific modules
        'app.header',
        'app.home',
        'app.user'
    ]);

export default appModule;