const styling = {
  button: {
    formButton: `
      px-2 py-2 border rounded
      text-orange-950
      font-medium
      bg-orange-300/50 border-orange-500/50
      hover:bg-orange-400/50 transition-colors
      focus-visible:border-orange-700 
      dark:bg-[#5c535c] dark:border-[#5c535c] dark:text-zinc-50 dark:hover:bg-[#311c31]
    `,
  },
  input: {
    omnibarInput: `
      border rounded-lg block p-1
      text-[#223] bg-white/75 border-slate-200
      dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
    `,
    formInput: `
      border rounded-lg block p-1
      text-[#223] bg-white/75 border-slate-200
      dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
    `,
  },
  textarea: {
    formTextArea: `
      border rounded-lg block p-1
      text-[#223] bg-white/75 border-slate-200
      dark:text-[#EEE] dark:bg-black/60 dark:border-slate-600
    `,
  },
  tile: {
    tileComponent: `
      px-4
      py-4
      rounded-md border
      shadow
      flex 
      flex-col
      items-start
      gap-2
      shadow-orange-200/30
      bg-orange-50 border-orange-300/30
      dark:bg-[#000]/25 dark:border-[#000]/25
    `,
  },
};

export default styling;
