/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/@shadow-xjy-website/web-common/dist/**/*.{js,mjs,cjs}',
		'../XJY.WEB.Common/src/app/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
	],
	theme: {
		extend: {
			screens: {
				'xs': '475px',
				'3xl': '1920px',
			},
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					sm: '1.5rem',
					lg: '2rem',
					xl: '2.5rem',
					'2xl': '3rem',
				},
			},
		},
	},
	plugins: [],
}
