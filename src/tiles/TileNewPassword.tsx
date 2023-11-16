import { useContext } from 'react'
import { PageContext } from '../contexts'

export function TileNewPassword() {
  const { pushPage } = useContext(PageContext)

  function openNewPassword() {
    pushPage({
      ov: 'pakrypt.page:newpassword',
    })
  }
  
  return <div>
    <button onClick={() => openNewPassword()}>New Password</button>
  </div>
}
