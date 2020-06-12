module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	extends: [
		"airbnb-typescript/base"
	],
	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	rules: {
		"@typescript-eslint/indent": ["error", "tab"],
		"@typescript-eslint/semi": ["error","never"],
		"class-methods-use-this": "off",
		"import/prefer-default-export": "off",
		"no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
		"no-tabs": "off",
		"radix":"off",
		"semi": "off",
		"import/no-extraneous-dependencies": ["error", {"devDependencies": ["test/**.ts", "debug/**.ts"]}],
		
		// Turn errors to warnings:
		"@typescript-eslint/no-unused-vars": "warn",
		"indent": ["warn", "tab"],
		"max-len": ["warn", 125, 2],

	},
};