import { useContext } from "react";
import { PageContext, PakContext } from "../contexts";
import PasswordEditor from "../editors/PasswordEditor";
import { CreatePassword, PasswordFields } from "../lib/pak";

export default function PageNewPassword() {
  console.log('rendering PageNewPassword')

  const pageContextState = useContext(PageContext);
  const pak = useContext(PakContext);

  if (pak == null) {
    throw new Error('pak is null. Is this component a child component of PakContextProvider?')
  }

  const savePassword = (data: PasswordFields) => {
    // TODO: This does not cascade changes via React to the pages, pak is edited in-place.
    CreatePassword(pak, data)
    console.log(pak)
    closePage()
  }

  function closePage() {
    pageContextState.popPage()
  }

  // TODO: Move these styles or page object into somewhere common.
  return <div className="
    min-h-screen w-screen
    text-[#333] bg-[#FFE]
    dark:text-[#EED] dark:bg-[#323]
  ">
    <button onClick={() => closePage()}>X</button>
    <PasswordEditor onUserSubmit={(data) => savePassword(data)} onUserCancel={() => closePage()} />
  </div>
}
