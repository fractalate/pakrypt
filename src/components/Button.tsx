import React from 'react'

export default function Button(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { type?: 'button' | 'submit' | 'reset' }) {
  return <button {...props} className={'p-1 rounded bg-slate-300 dark:bg-slate-900 ' + (props.className || '')}>{props.children}</button>
}
