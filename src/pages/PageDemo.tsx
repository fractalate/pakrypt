import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

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

function entryAdd(con: MyContainer, name: string, value: number): MyContainer {
  const entry = { name, value }
  return {
    entries: [...con.entries, entry],
  }
}

function entryUpdate(con: MyContainer, name: string, value: number): MyContainer {
  const entries = con.entries.map((entry) => {
    if (entry.name == name) {
      return { ...entry, value }
    }
    return entry
  })
  return {
    entries,
  }
}

function entryDelete(con: MyContainer, name: string): MyContainer {
  const entries = con.entries.filter((entry) => {
    return entry.name != name
  })
  return {
    entries,
  }
}

interface InputsEntryAdd {
  name: string,
  value: number,
}

export default function PageDemo() {
  const con0 = useMemo(() => {
    let con = newMyContainer()
    con = entryAdd(con, 'Gremilins', 2)
    con = entryAdd(con, 'Imps', 1)
    return con
  }, [])

  const [con, setCon] = useState(con0)

  const {
    register,
    handleSubmit,
  } = useForm<InputsEntryAdd>()

  const onSubmit: SubmitHandler<InputsEntryAdd> = (data) => {
    // TODO
  }

  const entries = con.entries.map((entry) => <div key={ entry.name } className="my-1 p-1 bg-gray-100">
    <div>{ entry.name } = { entry.value }</div>
  </div>)

  return <div>
    <div className="m-1 p-1 bg-gray-300">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
          Name<div className="px-1 inline"/>
          <input type="text" {...register('name')} />
        </label>
        <div className="block m-1"/>
        <label htmlFor="value">
          Value<div className="px-1 inline"/>
          <input type="number" {...register('value')} />
        </label>
        <div className="block m-1"/>
        <button type="submit" className="m-2 p-2 rounded-xl bg-blue-500 text-white shadow">+ Add</button>
      </form>
    </div>
    <div className="m-1 p-1 bg-gray-300">
      { entries }
    </div>
  </div>
}
