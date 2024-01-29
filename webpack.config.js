const path = require('path');

module.exports = {
    mode: 'development', // ou 'production'
    entry: './src/renderer/views/index.js', // Ponto de entrada da sua aplicação
    output: {
        path: path.resolve(__dirname, 'app/electron'), // Onde os arquivos empacotados serão colocados
        filename: 'bundle.js' // O nome do arquivo empacotado
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Transpilar todos os arquivos .js
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'] // Presets do Babel que você está usando
                    }
                }
            },{
                test: /\.css$/, // Regra para arquivos .css
                use: ['style-loader', 'css-loader'] // Utiliza style-loader e css-loader
            }
        ]
    },
    target: 'electron-renderer'
};