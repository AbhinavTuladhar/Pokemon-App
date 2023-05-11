/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'smmd': '750px',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-yellow-400',
    'bg-red-500',
    'bg-blue-400',
    'bg-yellow-300',
    'bg-green-500',
    'bg-blue-300',
    'bg-red-600',
    'bg-purple-400',
    'bg-yellow-600',
    'bg-indigo-400',
    'bg-pink-400',
    'bg-green-600',
    'bg-yellow-800',
    'bg-purple-600',
    'bg-indigo-600',
    'bg-gray-700',
    'bg-gray-500',
    'bg-pink-300',
  ]
}

