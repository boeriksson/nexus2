
module.exports = function (api) {
    api.cache(true)

    console.log('Babel.config.json loaded...')

    const presets = ['@babel/preset-env', '@babel/preset-react']
    const plugins = [
        ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
        '@babel/plugin-proposal-class-properties'
    ]

    return {
        presets,
        plugins
    };
}