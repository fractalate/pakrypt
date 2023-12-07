import { useContext } from 'react'
import { PageContext } from '../Contexts'
import styling from '../lib/styling'

export default function TileNewPassword() {
  const { pushPage } = useContext(PageContext)

  function openNewPassword() {
    pushPage({
      ov: 'pakrypt.page:new_password',
    })
  }
  
  return <div className={styling.tile.tileComponentCommand}>
    <button className={styling.button.formButton} onClick={() => openNewPassword()}>New Password</button>
  </div>
}
