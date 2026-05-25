#!/bin/bash
sed -i '' 's/${BASE_URL}\/images/${BASE_URL.replace(\/\\\/$\/, '\'''\'')}\/images/g' src/pages/index.astro
sed -i '' "s/\${import.meta.env.BASE_URL}\/favicon/\${import.meta.env.BASE_URL.replace(\/\\\\\/$\/, '')}\/favicon/g" src/layouts/BaseLayout.astro
