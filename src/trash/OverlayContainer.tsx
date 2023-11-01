import { PropsWithChildren } from "react";

export default function OverlayContainer(props: PropsWithChildren) {
  return <div className="overlay-container">
    {props.children}
  </div>
}
