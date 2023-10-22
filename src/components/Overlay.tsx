import { PropsWithChildren, useEffect } from "react";
import './Overlay.css';
import ReactDOM from "react-dom/client";

const bgColorDefault = 'bg-white';

interface OverlayProps {
  transparent?: boolean;
  busy?: boolean;
}

// TODO: I need to really evaluate this for memory leaks.
export default function Overlay(props: PropsWithChildren & OverlayProps) {
  function Overlay(props: PropsWithChildren & OverlayProps) {
    // See Overlay.css for "overlay" class.
    return <div className={"absolute top-0 right-0 left-0 bottom-0 h-screen w-full overflow-y-scroll"}>
      {props.children}
    </div>;
  }

  useEffect(() => {
    const container = document.querySelector('.overlay-container');
    if (container === null) {
      throw new Error('Could not find element with class overlay-contaier. Did you create the <OverlayContainer> component?');
    }
    const div = document.createElement('div');
    div.className = "overlay";
    const content = <Overlay {...props}>
      {props.children}
    </Overlay>;
    ReactDOM.createRoot(div).render(content);
    container.appendChild(div);
    return () => {
      // TODO: Does removing the child delete the ReactDOM objects being tracked behind the scenes?
      container.removeChild(div);
    };
  });

  return <></>;
}
