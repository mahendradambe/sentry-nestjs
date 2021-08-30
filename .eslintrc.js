module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: ["plugin:@typescript-eslint/recommended"],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "object-curly-spacing": ["warn", "always"],
        "array-bracket-spacing": ["warn", "always"],
        "computed-property-spacing": ["warn", "always"],
        "space-in-parens": ["warn", "always"],
        "@typescript-eslint/ban-types": ["warn"],
    },
};
