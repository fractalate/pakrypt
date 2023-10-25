import { useState } from "react";
import InputOmnibar from "./components/InputOmnibar";
import { randomId } from "./lib/rand";
import Tile from "./tiles/Tile";
import { TileNote } from "./tiles/TileNote";
import { LayoutStickyControls } from "./lib/layout";

interface OmnibarProps {
  autoFocus?: boolean;
}

export default function Omnibar(props: OmnibarProps) {
  const [results, setResults] = useState([] as string[])

  async function onChange(query: string) {
    if (query.length > 0 && 'help'.startsWith(query)) {
      setResults(['Type "theme" to demonstrate the themes.']);
    } else if (/^n(o(t(e)?)?)?$/i.test(query)) {
      setResults(['new note'])
    } else if (query === 'theme') {
      setResults(['swap theme', 'set light theme', 'set dark theme', 'mytheme.com']);
    } else if (query === 'light') {
      setResults(['set light theme']);
    } else if (query === 'dark') {
      setResults(['set dark theme']);
    } else if (query === 'long') {
      const results = [];
      for (let i = 0; i < 100; ++i) {
        results.push('' + i);
      }
      setResults(results);
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

  function isCommandTile(result: string) {
    return result === 'swap theme' || result === 'set light theme' || result === 'set dark theme' || result === 'new note';
  }

  function TileFacade(props: { result: string }) {
    let stuff;
    if (props.result === 'new note') {
      stuff = <TileNote />
    } else if (props.result === 'swap theme') {
      stuff = <Tile commandTile={isCommandTile(props.result)}>
        <button onClick={swapTheme}>
          {props.result}
        </button>
      </Tile>
    } else if (props.result === 'set light theme') {
      stuff = <Tile commandTile={isCommandTile(props.result)}>
        <button onClick={setLightTheme}>
          {props.result}
        </button>
      </Tile>
    } else if (props.result === 'set dark theme') {
      stuff = <Tile commandTile={isCommandTile(props.result)}>
        <button onClick={setDarkTheme}>
          {props.result}
        </button>
      </Tile>
    } else {
      stuff = <Tile commandTile={isCommandTile(props.result)}>
        {props.result}
      </Tile>
    }

    return <div key={randomId()} className="pt-1">
      {stuff}
    </div>
  }

  const tiles = results.map((result) => <TileFacade result={result} />);

  return <div className="p-1.5">
    <div className={LayoutStickyControls}>
      <InputOmnibar autoFocus={props.autoFocus} onChange={onChange} />
    </div>
    <div>
      {tiles}
    </div>
  </div>
}
