module.exports = {
    "plugins": [
        "prettier"
    ],
    "parser": "babel-eslint",
    "extends": [
        "airbnb-base",
        "plugin:prettier/recommended",
    ],
    "env": {
        "mocha": true,
        "browser": true
    },
    "rules": {
        "import/prefer-default-export": 0,
        "prettier/prettier": "error",
        "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ["draft"] }], // https://github.com/immerjs/immer/issues/189#issuecomment-422045470
    }
}
