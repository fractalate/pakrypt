import { useContext } from 'react'
import { PakmanStateContext } from '../Contexts'
import styling from '../lib/styling'
import { Pakman } from '../pak/Pakman'

function getYourPakIs(pakman: Pakman): JSX.Element {
  if (pakman.ov == 'pakrypt.pakmanstate:unloaded') {
    return <>not loaded</>
  } else if (pakman.ov == 'pakrypt.pakmanstate:loaded') {
    return <>locked</>
  } else if (pakman.ov == 'pakrypt.pakmanstate:unlocked') {
    return <>ready to be used</>
  }
  return pakman // Relying on type == never here.
}

function getSoYouCan(pakman: Pakman): JSX.Element {
  if (pakman.ov == 'pakrypt.pakmanstate:unloaded') {
    return <>create a <b>new pak</b> or <b>open a pak</b></>
  } else if (pakman.ov == 'pakrypt.pakmanstate:loaded') {
    return <><b>unlock your pak</b></>
  } else if (pakman.ov == 'pakrypt.pakmanstate:unlocked') {
    return <>view and manage your data</>
  }
  return pakman // Relying on type == never here.
}

export default function TileHelp() {
  const { pakman } = useContext(PakmanStateContext)

  const yourPakIs = getYourPakIs(pakman)
  const soYouCan = getSoYouCan(pakman)
  return <div className={styling.tile.tileComponentCommand}>
    <p className="mb-2">Use the search bar to find your things. Your things are bundled together in a "pak". Your pak is {yourPakIs}. So you can {soYouCan}.</p>
    <p className="mt-2 mb-2">Commands:</p>
    <ul className="list-disc list-inside">
      <li><b>new password</b></li>
      <li><b>unlock pak</b></li>
      <li><b>lock pak</b></li>
      <li><b>open pak</b></li>
      <li><b>new pak</b></li>
      <li><b>close pak</b></li>
      <li><b>theme</b> or <b>light</b> or <b>dark</b> to switch the theme.</li>
      <li><b>*</b> (asterisk) to list all items and commands.</li>
    </ul>
  </div>
}
