/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'smmd': '1070px',
      },
      width: {
        '475/1000': '47.5%',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-greyYellow',
    'bg-gray-400',
    'bg-red-500',
    'bg-blue-400',
    'bg-amber-400',
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

    'from-gray-400',
    'from-yellow-400',
    'from-red-500',
    'from-blue-400',
    'from-amber-400',
    'from-green-500',
    'from-blue-300',
    'from-red-600',
    'from-purple-400',
    'from-yellow-600',
    'from-indigo-400',
    'from-pink-400',
    'from-green-600',
    'from-yellow-800',
    'from-purple-600',
    'from-indigo-600',
    'from-gray-700',
    'from-gray-500',
    'from-pink-300',

    'to-gray-600',
    'to-yellow-400',
    'to-red-500',
    'to-blue-400',
    'to-amber-400',
    'to-green-500',
    'to-blue-300',
    'to-red-600',
    'to-purple-400',
    'to-yellow-600',
    'to-indigo-400',
    'to-pink-400',
    'to-green-600',
    'to-yellow-800',
    'to-purple-600',
    'to-indigo-600',
    'to-gray-700',
    'to-gray-500',
    'to-pink-300',

    'to-gray-400',
    'to-yellow-600',
    'to-red-700',
    'to-blue-600',
    'to-amber-600',
    'to-green-700',
    'to-blue-500',
    'to-red-800',
    'to-purple-600',
    'to-yellow-800',
    'to-indigo-600',
    'to-pink-600',
    'to-green-800',
    'to-yellow-950',
    'to-purple-800',
    'to-indigo-800',
    'to-gray-900',
    'to-gray-700',
    'to-pink-500',
  ]
}

