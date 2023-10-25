import { PropsWithChildren } from "react";

function CommandTile(props: PropsWithChildren) {
  return <div className="
    px-1 py-2 rounded border-1
    bg-[#DDD]/90 border-slate-200
    dark:bg-[#443]/90 dark:border-slate-700
  ">
    {props.children}
  </div>
}

function ItemTile(props: PropsWithChildren) {
  return <div className="
    px-1 py-2 rounded border-1
    bg-[#EEE]/90 border-slate-200
    dark:bg-[#665]/90 dark:border-slate-700
  ">
    {props.children}
  </div>
}

export default function Tile(props: PropsWithChildren & { commandTile?: boolean }) {
  if (props.commandTile) {
    return <CommandTile>
      {props.children}
    </CommandTile>
  }
  return <ItemTile>
    {props.children}
  </ItemTile>
}
