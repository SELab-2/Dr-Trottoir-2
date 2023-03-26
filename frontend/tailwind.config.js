/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
	colors: {
		white: 			'#ffffff',
		black:			'#000000',
		gray: {
			100: 		'#F6F8FA',
			200: 		'#B2B2B2',
			300: 		'#4D4D4D',
			400: 		'#282828',
			500: 		'#1D1D1D',
		},
		accent: {
			100: 		'#E6E600',
			200: 		'#585936',
		},
		primary: {
			100: 	'#D7E5FF',
			200:	'#377DFF',
		},
		done: {
			100: 	'#D6CCED',
			200: 	'#8250DF',
		},
		good: {
			100: 	'#CEF5D2',
			200: 	'#2DA44C',
		},
		meh: {
			100: 	'#FFDCCC',
			200: 	'#D29922',
		},
		bad: {
			100: 	'#FFD4DF',
			200: 	'#CF222E',
		},
	},
    extend: {},
  },
  plugins: [],
}





