import { useMemo, useState } from "react";
import { PageContext } from "../Contexts";
import { v4 as uuid } from "uuid";
import PageMain from "./PageMain";
import PageNewNote from "./PageNewNote";
import PageNewPassword from "./PageNewPassword";
import PageEditPassword from "./PageEditPassword";
import PageDemo from "./PageDemo";
import { ChoosePage, ChosenPage } from ".";

function Page({ page }: { page: ChoosePage }): JSX.Element {
  const ov = page.ov;
  if (ov === "pakrypt.page:main") {
    return <PageMain />;
  } else if (ov === "pakrypt.page:new_note") {
    return <PageNewNote />;
  } else if (ov === "pakrypt.page:new_password") {
    return <PageNewPassword />;
  } else if (ov === "pakrypt.page:edit_password") {
    return <PageEditPassword entry={page.entry} />;
  } else if (ov === "pakrypt.page:demo") {
    return <PageDemo />;
  }
  return ov; // This will cause a type error when the if's above are not exhaustive.
}

export default function Pages() {
  const initialPage: ChosenPage = useMemo(() => {
    const page: ChoosePage = {
      //ov: 'pakrypt.page:demo', // TODO: Turn this back to :main
      ov: "pakrypt.page:main",
    };
    return [page, uuid(), <Page page={page} />];
  }, []);

  const [pages, setPages] = useState([initialPage]); // Remember: don't modify this in-place.

  const pageContextState = useMemo(() => {
    return {
      pages,
      pushPage: (page: ChoosePage) => {
        setPages([...pages, [page, uuid(), <Page page={page} />]]);
      },
      popPage: () => {
        setPages(pages.slice(0, -1));
      },
    };
  }, [pages, setPages]);

  const rendered = pages.map(([, id, component], index) => (
    <div key={id} className={index < pages.length - 1 ? "hidden" : ""}>
      {component}
    </div>
  ));

  return (
    <PageContext.Provider value={pageContextState}>
      {rendered}
    </PageContext.Provider>
  );
}
