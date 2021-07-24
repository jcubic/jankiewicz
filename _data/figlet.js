const { promisify } = require('util');
const figlet = require('figlet');
const render = promisify(figlet.text);

const config = {
    font: 'Colossal',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 200,
    whitespaceBreak: true
};

module.exports = async () => {
    const text = 'Jakub T. Jankiewicz';
    return {
        wrap: await render(text, {...config, width: 90}),
        small: await render(text, {
            ...config,
            width: 60,
            verticalLayout: 'full',
            font: 'Standard'
        }),
        big: await render(text, config)
    };
};
