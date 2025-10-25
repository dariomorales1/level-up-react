//archivo de configuración de Karma para ejecutar pruebas con Jasmine y Webpack
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        
        // Solo incluir tests, no archivos de imagen
        files: [
            'src/**/*.spec.js'
        ],
        
        preprocessors: {
            'src/**/*.spec.js': ['webpack']
        },
        
        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-env',
                                    ['@babel/preset-react', { runtime: 'automatic' }]
                                ]
                            }
                        }
                    },
                    // Ignorar todos los archivos que no son JS
                    {
                        test: /\.(css|png|jpg|jpeg|gif|svg|webp)$/,
                        use: 'null-loader'
                    }
                ]
            },
            resolve: {
                extensions: ['.js']
            }
        },
        
        reporters: ['progress'],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        colors: true,
        logLevel: config.LOG_INFO,
        
        plugins: [
            'karma-jasmine',
            'karma-webpack', 
            'karma-chrome-launcher',
            'karma-spec-reporter'
        ]
    });
};