import type { ComponentProps } from 'react'

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
const buttonBase = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${focus}`
const buttonVariants = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-600',
  primaryOutline: 'border border-indigo-500 bg-white text-indigo-500 hover:bg-white',
  secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
  soft: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
}

export const primaryLink = `${buttonBase} ${buttonVariants.primary}`
export const softLink = `${buttonBase} ${buttonVariants.soft}`
export const textLink = `text-indigo-600 hover:text-indigo-800 hover:underline ${focus}`

type ButtonProps = ComponentProps<'button'> & { variant?: keyof typeof buttonVariants }

export function Button({
  variant = 'secondary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  )
}

const field =
  'w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50'

export function Input({ className = '', type, ...props }: ComponentProps<'input'>) {
  const appearance = type === 'checkbox' ? `size-4 shrink-0 accent-indigo-500 ${focus}` : field
  return <input type={type} className={`${appearance} ${className}`} {...props} />
}

export function Select({ className = '', ...props }: ComponentProps<'select'>) {
  return <select className={`${field} ${className}`} {...props} />
}
