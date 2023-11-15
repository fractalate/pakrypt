import { useContext } from 'react'
import Button from '../components/Button'
import { PageContext } from '../contexts'

export function TileNewPassword() {
  const { setPage } = useContext(PageContext)

  function openNewPassword() {
    setPage({
      ov: 'pakrypt.page:newpassword',
    })
  }
  
  return <div>
    <Button onClick={() => openNewPassword()}>New Password</Button>
  </div>
}
