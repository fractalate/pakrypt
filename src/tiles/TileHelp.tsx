import { useContext } from 'react'
import { PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import { Pakman } from '../pak/Pakman'

function getYourPakIs(pakman: Pakman): JSX.Element {
  if (pakman.ov === 'pakrypt.pakman_state:nil') {
    return <>not open</>
  } else if (pakman.ov === 'pakrypt.pakman_state:locked') {
    return <>locked</>
  } else if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
    return <>ready to be used</>
  }
  return pakman // never
}

function getSoYouCan(pakman: Pakman): JSX.Element {
  if (pakman.ov === 'pakrypt.pakman_state:nil') {
    return <>create a <b>new pak</b>, <b>open a pak</b>, or <b>import a pak</b></>
  } else if (pakman.ov === 'pakrypt.pakman_state:locked') {
    return <><b>unlock your pak</b></>
  } else if (pakman.ov === 'pakrypt.pakman_state:unlocked') {
    return <>view and manage your data; e.g. make a <b>new password</b>, <b>note</b>, or <b>file</b></>
  }
  return pakman // never
}

export default function TileHelp() {
  const { pakman } = useContext(PakmanStateContext)

  const yourPakIs = getYourPakIs(pakman)
  const soYouCan = getSoYouCan(pakman)
  return <div className={styling.tile.tileComponentCommand}>
    <p className="mb-2">Use the search bar to find your things. Your things are bundled together in a "pak". Your pak is {yourPakIs}. So you can {soYouCan}.</p>
    <p className="mt-2 mb-2">Commands:</p>
    <ul className="mt-2 mb-2 list-disc list-inside">
      <li><b>new password</b></li>
      <li><b>new note</b></li>
      <li><b>new file</b></li>
      <li><b>unlock pak</b></li>
      <li><b>lock pak</b></li>
      <li><b>open pak</b></li>
      <li><b>export pak</b></li>
      <li><b>import pak</b></li>
      <li><b>copy pak</b></li>
      <li><b>new pak</b></li>
      <li><b>close pak</b></li>
      <li><b>change passphrase</b></li>
      <li><b>version</b></li>
      <li><b>theme</b> or <b>light</b> or <b>dark</b> to switch the theme.</li>
      <li><b>*</b> (asterisk) or (space bar) to list all items and commands.</li>
    </ul>
    <p className="mt-2">
      <a href="https://www.pakrypt.com/guide.html" className="font-bold">&#x1f517; User Guide</a>
    </p>
  </div>
}
