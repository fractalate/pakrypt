import { PropsWithChildren, useEffect } from "react";
import './Overlay.css';
import ReactDOM from "react-dom/client";

// TODO: I need to really evaluate this for memory leaks.
export default function Overlay(props: PropsWithChildren) {
  function OverlayInner(props: PropsWithChildren) {
    // See Overlay.css for "overlay" class.
    return <div className={"absolute h-screen w-full overflow-y-scroll"}>
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
    const content = <OverlayInner>
      <svg className="absolute h-screen w-full">
        <line x1="75%" y1="0" x2="75%" y2="100%" className="stroke-[#EED] dark:stroke-[#434]" style={{
          strokeWidth: 20, // TODO: I want centimeters or something.
        }}></line>
      </svg>
      {/* TODO: Why does position: relative help here? Otherwise the SVG is on top of Omnibar */}
      <div className="relative p-1.5">
        {props.children}
      </div>
    </OverlayInner>;
    ReactDOM.createRoot(div).render(content);
    container.appendChild(div);
    return () => {
      // TODO: Does removing the child delete the ReactDOM objects being tracked behind the scenes?
      container.removeChild(div);
    };
  });
  
  return <></>;
}
