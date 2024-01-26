import {
  version,
  copyright,
  repository,
} from '../../package.json'
import styling from '../lib/styling'

export default function TileVersion() {

  return <div className={styling.tile.tileComponentCommand}>
    <p className="mb-2">
      Pakrypt {version}<br />
      { copyright}
    </p>
    <p>
      <a href={ repository.url } className="font-bold">&#x1f517; GitHub Project</a>
    </p>
  </div>
}
