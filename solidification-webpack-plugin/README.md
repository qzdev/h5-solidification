
`webpack.product.config.js`

    // ...

    const SolidificationWebpackPlugin = require('solidification-webpack-plugin')

    // ...

    // ...
        new SolidificationWebpackPlugin({
            app: 'package.json[name]',
            version: 'package.json[version]'
            name: 'webapp name',
            icon: 'favicon.ico or logo.png',
            entry: 'index.html',
            publicUrl: 'package.homepage or https://domain/h5/'
        }),
    ],
    // ...

`updates`

更新文件，只用单`app`相同且`version`变大是才做更新处理

将webpack生产的文件从`dist`文件夹或`build`文件夹复制到`https://domain/h5/`下，待App检测到`updates`文件有更新时自动更新