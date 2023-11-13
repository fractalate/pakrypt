import React from "react";

export default function Button(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return <button {...props} className={'p-1 rounded bg-slate-300 dark:bg-slate-900 ' + (props.className || '')}></button>
}
