import React from 'react'

export default function Input(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement> & { type: string, value?: string }) {
  return <input {...props} className={`
    border rounded-lg text-sm p-1
    text-[#223] bg-white/75 border-slate-200
    dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
  ` + (props.className || '')} />
}
