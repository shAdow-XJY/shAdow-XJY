#!/bin/bash
sed -i '' 's|<meta name="theme-color" content="#0d1117" />|<meta name="theme-color" content="#0d1117" />\n    <link rel="icon" type="image/png" href={`${import.meta.env.BASE_URL}favicon.png`} />|' src/layouts/BaseLayout.astro
