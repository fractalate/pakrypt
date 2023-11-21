interface MyContainer {
  entries: MyEntry[],
}

interface MyEntry {
  name: string,
  value: number, 
}

function newMyContainer(): MyContainer {
  return {
    entries: [],
  }
}

function entryAdd(obj: MyContainer, name: string, value: number): MyContainer {
  const entry = { name, value }
  return {
    entries: [...obj.entries, entry],
  }
}

function entryUpdate(obj: MyContainer, name: string, value: number): MyContainer {
  const entries = obj.entries.map((entry) => {
    if (entry.name == name) {
      return { ...entry, value }
    }
    return entry
  })
  return {
    entries,
  }
}

function entryDelete(obj: MyContainer, name: string): MyContainer {
  const entries = obj.entries.filter((entry) => {
    return entry.name != name
  })
  return {
    entries,
  }
}

export default function PageDemo() {
  return <div>The demo will happen around here.</div>
}
