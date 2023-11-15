import React from 'react'

export default function TextArea(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>) {
  return <textarea {...props} className={`
    border rounded-lg block w-full text-sm p-1
    text-[#223] bg-white/75 border-slate-200
    dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
  ` + (props.className || '')} />
}
