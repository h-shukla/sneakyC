import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
                req: true,
                res: true,
                next: true,
            },
        },
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
]);
