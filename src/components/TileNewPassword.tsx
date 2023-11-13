import { useCallback, useContext } from "react";
import Button from "./Button";
import { ExperienceContext } from "../Contexts";
import PagePasswordEdit from "../pages/PagePasswordEdit";

export function TileNewPassword() {
  const exp = useContext(ExperienceContext);

  function openNewPassword() {
    exp.pushExperience(<Example />);
  }

  const Example = useCallback(() => {
    return <PagePasswordEdit
      onUserSubmit={(data) => {
        // TODO
      }}
      onUserCancel={() => {
        exp.popExperience();
      }}
    />
  }, [exp]);
  
  
  return <div>
    <Button onClick={() => openNewPassword()}>New Password</Button>
  </div>
}
