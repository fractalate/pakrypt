import { useState } from "react";
import InputTextOmnibar from "./components/InputTextOmnibar";
import { randomId } from "./lib/rand";

export default function Omnibar() {
  const [results, setResults] = useState([] as string[])

  async function onChange(query: string) {
    if (query === 'help') {
      setResults(['help here', 'help online']);
    } else if (query === 'theme') {
      setResults(['swap theme']);
    } else if (query === 'light') {
      setResults(['set light theme']);
    } else if (query === 'dark') {
      setResults(['set dark theme']);
    } else {
      setResults([]);
    }
  }

  function swapTheme() {
    (window as any).swapTheme(); // TODO: Hacky
  }
  function setLightTheme() {
    (window as any).setTheme('light'); // TODO: Hacky
  }
  function setDarkTheme() {
    (window as any).setTheme('dark'); // TODO: Hacky
  }

  const tiles = results.map((result) => {
    if (result === 'swap theme') {
      return <p key={randomId()}>
        <button onClick={swapTheme}>
          {result}
        </button>
      </p>
    }
    if (result === 'set light theme') {
      return <p key={randomId()}>
        <button onClick={setLightTheme}>
          {result}
        </button>
      </p>
    }
    if (result === 'set dark theme') {
      return <p key={randomId()}>
        <button onClick={setDarkTheme}>
          {result}
        </button>
      </p>
    }
    return <p key={randomId()}>{result}</p>
  });

  return <div className="p-1.5">
    <InputTextOmnibar onChange={onChange}/>
    {tiles}
  </div>
}
