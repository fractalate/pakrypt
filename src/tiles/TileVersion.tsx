import {
  version,
  copyright,
  repository,
} from '../../package.json'
import styling from '../lib/styling'

export default function TileVersion() {

  // TODO: Pre-release: Ensure this list of commands reflects the set of commands that can be performed.
  return <div className={styling.tile.tileComponentCommand}>
    <p className="mb-2">
      Pakrypt {version}<br />
      { copyright}
    </p>
    <p>
      <a href={ repository.url } className="font-bold">&#x1f517; Project Site</a>
    </p>
  </div>
}
