import React, { useEffect, useRef, useState } from "react";

interface InputOmnibarProps {
  onChange: (query: string) => any;
  autoFocus?: boolean;
}

export const textAndPaddingClasses = 'text-sm p-2.5';

export default function InputOmnibar(props: InputOmnibarProps) {
  const queryRef = useRef(null as null | HTMLInputElement);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const listener = () => {
      clearQuery();
    };
    window.addEventListener('InputOmnibar.clear()', listener);
    return () => {
      window.removeEventListener('InputOmnibar.clear()', listener);
    };
  });

  function updateQuery(newQuery: string) {
    setQuery(newQuery);
    props.onChange(newQuery);
  }

  function clearQuery() {
    updateQuery('');
    if (queryRef.current) {
      queryRef.current.focus();
    }
  }

  // TODO: I need to test that the label here DOES get read by a screen reader. I believe this is how to do it with the hidden class and aria-hidden="false".
  return <div>
    <label htmlFor="omnibarInput" className="hidden" aria-hidden="false">Type commands here:</label>
    <input type="search" name="omnibarInput" ref={queryRef}
      autoFocus={props.autoFocus}
      value={query}
      placeholder="Type help for help."
      className={`
        border rounded-lg block w-full ${ textAndPaddingClasses }
        text-[#223] bg-white/75 border-slate-200
        dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
      `}
      onChange={(e) => {
        updateQuery(e.target.value);
      }}
    />
    <div className={`absolute top-0 right-0 ${ textAndPaddingClasses }`}>
      <button tabIndex={-1} className="text-black/50 dark:text-white/50" onClick={clearQuery}>&#x2716;</button>
    </div>
  </div>
}

InputOmnibar.clear = () => {
  const event = new Event('InputOmnibar.clear()');
  window.dispatchEvent(event);
};
