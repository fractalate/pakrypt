import styling from '../lib/styling'

export default function TileHelp() {
  return <div className={styling.tile.tileComponentCommand}>
    <p className="mb-2">Use the search bar to find your things.</p>
    <p className="mt-2 mb-2">Commands:</p>
    <ul className="list-disc list-inside">
      <li><b>new password</b></li>
      <li><b>theme</b> or <b>light</b> or <b>dark</b> to switch the theme.</li>
      <li><b>*</b> (asterisk) to list all items and commands.</li>
    </ul>
  </div>
}
