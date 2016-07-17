// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map:any = {
  'jquery': 'vendor/jquery',
  'bootstrap': 'vendor/bootstrap',
  'xml2json': 'libhack/x2js-master',
  'firebase': 'vendor/firebase/firebase.js',
  'angularfire2': 'vendor/angularfire2'

// workaround - copy source code in the project directly
//  'ng2-uploader': 'vendor/ng2-uploader'
};


/** User packages configuration. */
const packages : any = {
  'jquery': {
    format: 'cjs',
    defaultExtension: 'js',
    main: 'dist/jquery.js'
  },
  'bootstrap': {
    format: 'cjs',
    defaultExtension: 'js',
    main: 'dist/js/bootstrap.js'
  },
  'xml2json': {
    format: 'cjs',
    defaultExtension: 'js',
    main: 'xml2json.min.js'
  },
  'angularfire2': {
    defaultExtension: 'js',
    main: 'angularfire2.js'
  },

  // workaround - copy source code in the project directly
  // 'ng2-uploader': {
  //   defaultExtension: 'js',
  //   main: 'bundles/ng2-uploader.js'
  // }

};


////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels:string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',
  'jquery',
  'bootstrap',
//  'ng-uploader',

  // App specific barrels.
  'app',
  'app/shared',
  'app/components/receipts',
  'app/components/receiptsoutlineview',
  'app/testfire',
  /** @cli-barrel */
];

const cliSystemConfigPackages:any = {};
barrels.forEach((barrelName:string) => {
  cliSystemConfigPackages[barrelName] = {main: 'index'};
});

/** Type declaration for ambient System. */
declare var System:any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js',
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({map, packages});


