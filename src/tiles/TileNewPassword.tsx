import { useContext } from 'react'
import { PageContext } from '../Contexts'

export function TileNewPassword() {
  const { pushPage } = useContext(PageContext)

  function openNewPassword() {
    pushPage({
      ov: 'pakrypt.page:new_password',
    })
  }
  
  return <div>
    <button onClick={() => openNewPassword()}>New Password</button>
  </div>
}
