interface InputOmnibarProps {
  onChange: (query: string) => any;
  autoFocus?: boolean;
}

export default function InputOmnibar(props: InputOmnibarProps) {
  // TODO: I need to test that the label here DOES get read by a screen reader. I believe this is how to do it with the hidden class and aria-hidden="false".
  return <>
    <label htmlFor="omnibarInput" className="hidden" aria-hidden="false">Type commands here:</label>
    <input type="text" id="omnibarInput" autoFocus={props.autoFocus}
      placeholder="Type help for help."
      className="
        border text-sm rounded-lg block w-full p-2.5
        text-[#223] bg-white/75 border-slate-200
        dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
      "
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    />
  </>
}
