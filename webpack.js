const {generateSW} = require("workbox-build")
generateSW({
    globPattern:["**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx}"],
})