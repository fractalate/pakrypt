const styling = {
  button: {
    formButton: `
      p-1 border rounded-lg
      bg-slate-300 border-slate-200
      dark:bg-[#5c535c] dark:border-[#5c535c]
    `,
    dangerButton: `
      p-1 border rounded-lg
      bg-red-300 border-red-200
      dark:bg-red-800 dark:border-red-900
    `,
  },
  input: {
    searchInput: `
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
    tileComponentCommand: `
      p-2
      rounded-xl border
      shadow
      bg-orange-50 border-slate-200
      dark:bg-[#FFF]/5 dark:border-[#FFF]/5
    `,
    tileComponentEntry: `
      p-2
      rounded-xl border
      shadow
      bg-orange-100/50 border-slate-200
      dark:bg-[#000]/40 dark:border-[#000]/40
    `,
  },
  page: {
    regular: `
      w-full max-w-[100ch]
      flex flex-col gap-4
    `,
  },
  pageOuter: {
    regular: `
      min-h-screen w-screen
      text-[#333] bg-[#FFE]
      dark:text-[#EED] dark:bg-[#323]
      flex flex-row justify-center
      p-1
    `,
  },
}

export default styling
