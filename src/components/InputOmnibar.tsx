import { useState } from "react";

interface InputOmnibarProps {
  onChange: (query: string) => any;
  autoFocus?: boolean;
}

const textAndPaddingClasses = 'text-sm p-2.5';

export default function InputOmnibar(props: InputOmnibarProps) {
  const [query, setQuery] = useState('');

  function updateQuery(newQuery: string) {
    setQuery(newQuery);
    props.onChange(newQuery);
  }

  function clearQuery() {
    updateQuery('');
  }

  // TODO: I need to test that the label here DOES get read by a screen reader. I believe this is how to do it with the hidden class and aria-hidden="false".
  return <div className="sticky top-1">
    <label htmlFor="omnibarInput" className="hidden" aria-hidden="false">Type commands here:</label>
    <input type="search" id="omnibarInput"
      autoFocus={props.autoFocus}
      value={query}
      placeholder="Type help for help."
      className={`
        sticky top-1
        border rounded-lg block w-full ${ textAndPaddingClasses }
        text-[#223] bg-white/75 border-slate-200
        dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
      `}
      onKeyUp={(e) => {
        if (e.code === 'Escape') {
          updateQuery('');
        }
      }}
      onChange={(e) => {
        updateQuery(e.target.value);
      }}
    />
    <div className={`absolute top-0 right-0 ${ textAndPaddingClasses }`}>
      <button tabIndex={-1} className="text-black/50 dark:text-white/50" onClick={clearQuery}>&#x2716;</button>
    </div>
  </div>
}
