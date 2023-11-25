import { useContext } from "react";
import { PageContext } from "../Contexts";
import styling from "../lib/styling";
import { PakPassword1r0 } from "../pak/Pak";

export default function TilePassword({ entry }: { entry: PakPassword1r0 }) {
  const { pushPage } = useContext(PageContext);

  function openEditPassword() {
    pushPage({
      ov: "pakrypt.page:edit_password",
      entry,
    });
  }

  function copyPassword() {}

  return (
    <div className={styling.tile.tileComponent}>
      <div className="text-base font-semibold">{entry.title}</div>
      <div className="">{entry.subtitle || entry.username}</div>
      <div className="flex flex-row gap-2">
        <button
          className={styling.button.formButton}
          onClick={() => openEditPassword()}
        >
          Edit
        </button>
        <button
          className={styling.button.formButton}
          onClick={() => copyPassword()}
        >
          Copy Password
        </button>
      </div>
    </div>
  );
}
