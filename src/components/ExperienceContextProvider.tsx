import { PropsWithChildren, useState } from "react";
import { ExperienceContext } from "../Contexts";
import { Experience } from "../lib/experience";

export default function ExperienceContextProvider({ children }: PropsWithChildren) {
  const [experiences, setExperiences] = useState([] as any[])

  function pushExperience(experience: any) {
    setExperiences([...experiences, experience])
  }

  function popExperience() {
    setExperiences(experiences.slice(0, experiences.length - 1))
  }

  const experience: Experience = {
    pushExperience,
    popExperience,
  }

  return <ExperienceContext.Provider value={experience}>
    {experiences.length == 0 && children}
    {experiences.length > 0 && experiences[experiences.length - 1]}
  </ExperienceContext.Provider>
}
