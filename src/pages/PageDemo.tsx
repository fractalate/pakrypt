import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

class Explosion extends Error {}

class TimeBomb {
  name: string
  message: string
  ticks: number

  constructor(name: string, ticks: number) {
    this.name = name
    this.message = 'BOOM! ' + name + ' blew up after ' + ticks + ' ticks!'
    this.ticks = ticks + 1
    this.tick()
  }

  tick() {
    if (localStorage.getItem('bomb.control.' + this.name)) {
      if (this.ticks > 0) {
        console.log(this.name + ': ' + (--this.ticks) + '!')
      }
      if (this.ticks == 0) {
        throw new Explosion(this.message)
      }
    }
  }
}

(window as any).armBomb = (control: string) => {
  localStorage.setItem('bomb.control.' + control, 'hot')
  console.log(control + ' is hot.')
}

(window as any).defuseBombs = () => {
  const toDelete: string[] = []
  for (let i = 0; i < localStorage.length; ++i) {
    const k = localStorage.key(i)
    if (k?.startsWith('bomb.control.')) {
      toDelete.push(k)
    }
  }
  for (const key of toDelete) {
    localStorage.removeItem(key)
    console.log(key.replace('bomb.control.', '') + ' is defused.')
  }
}

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

function entryAdd(container: MyContainer, name: string, value: number): MyContainer {
  for (const entry of container.entries) {
    if (entry.name === name) {
      throw new Error('Duplicate name.')
    }
  }
  const entry = { name, value }
  return {
    entries: [...container.entries, entry],
  }
}

function entryUpdate(container: MyContainer, name: string, value: number): MyContainer {
  let updated = false;
  const entries = container.entries.map((entry) => {
    if (entry.name === name) {
      updated = true;
      return { ...entry, value }
    }
    return entry
  })
  if (!updated) {
    throw new Error('Name not found.')
  }
  return {
    entries,
  }
}

function entryDelete(container: MyContainer, name: string): MyContainer {
  const entries = container.entries.filter((entry) => {
    return entry.name != name
  })
  if (container.entries.length == entries.length) {
    throw new Error('Name not found.')
  }
  return {
    entries,
  }
}

interface InputsEntryAdd {
  name: string,
  value: number,
}

export default function PageDemo() {
  try {
    const b = useMemo(() => {
      return new TimeBomb('bbb', 2)
    }, [])

    b.tick()
  
    const container0 = useMemo(() => {
      let container = newMyContainer()
      container = entryAdd(container, 'Gremlins', 2)
      container = entryAdd(container, 'Imps', 1)
      return container
    }, [])

    const [container, setContainer] = useState(container0)
    const [editing0, setEditing0] = useState(null as null | string)
    const [editing1, setEditing1] = useState(null as null | string)

    const {
      register,
      handleSubmit,
      reset,
    } = useForm<InputsEntryAdd>()

    const onSubmit: SubmitHandler<InputsEntryAdd> = (data) => {
      setContainer(entryAdd(container, data.name, data.value))
      reset()
    }

    const entries0 = container.entries.map((entry) => <div key={ entry.name } className="my-1 p-1 bg-gray-100">
      <div>
        { entry.name } = {
          (entry.name === editing0) ?
            <button onClick={() => {
              setContainer(entryUpdate(container, entry.name, entry.value + 1))
            }}><b>{entry.value}</b></button>
          :
            <>{entry.value}</>
        }
        { (entry.name === editing0) ?
          <button className="ml-2 p-2 rounded-xl bg-blue-500 text-white shadow" onClick={() => {
            setEditing0(null)
          }}>Done</button>
        : <>
            <button className="ml-2 mr-1 p-2 rounded-xl bg-blue-500 text-white shadow" onClick={() => {
              setEditing0(entry.name)
            }}>Edit</button>
            <button className="ml-2 mr-1 p-2 rounded-xl bg-red-500 text-white shadow" onClick={() => {
              setContainer(entryDelete(container, entry.name))
            }}>Delete</button>
          </>
        }
      </div>
    </div>)

    const entries1 = container.entries.map((entry) => <div key={ entry.name } className="my-1 p-1 bg-gray-100">
      <div>
        { entry.name } = {
          (entry.name === editing1) ?
            <button onClick={() => {
              setContainer(entryUpdate(container, entry.name, entry.value + 1))
            }}><b>{entry.value}</b></button>
          :
            <>{entry.value}</>
        }
        { (entry.name === editing1) ?
          <button className="ml-2 p-2 rounded-xl bg-blue-500 text-white shadow" onClick={() => {
            setEditing1(null)
          }}>Done</button>
        : <>
            <button className="ml-2 mr-1 p-2 rounded-xl bg-blue-500 text-white shadow" onClick={() => {
              setEditing1(entry.name)
            }}>Edit</button>
            <button className="ml-2 mr-1 p-2 rounded-xl bg-red-500 text-white shadow" onClick={() => {
              setContainer(entryDelete(container, entry.name))
            }}>Delete</button>
          </>
        }
      </div>
    </div>)

    return <div>
      <div className="m-1 p-1 bg-gray-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">
            Name<div className="px-1 inline"/>
            <input type="text" autoComplete="off" {...register('name', { required: true })} />
          </label>
          <div className="block m-1"/>
          <label htmlFor="value">
            Value<div className="px-1 inline"/>
            <input type="number" autoComplete="off" {...register('value', { required: true, valueAsNumber: true })} />
          </label>
          <div className="block m-1"/>
          <button type="submit" className="p-2 rounded-xl bg-blue-500 text-white shadow">+ Add</button>
        </form>
      </div>
      <div className="m-1 p-1 bg-gray-300">
        { entries0 }
      </div>
      <div className="m-1 p-1 bg-gray-300">
        { entries1 }
      </div>
    </div>
  } catch (err) {
    if (!(err instanceof Explosion)) {
      throw err
    }
  }
  return <div className="h-screen w-screen bg-red-500 text-white p-[43%]">
    <div>

    </div>
    <button className="bg-red-900 p-3 rounded-xl shadow-xl " onClick={() => (window as any).defuseBombs()}>Defuse&nbsp;Bombs</button>
    <button className="bg-red-900 p-3 rounded-xl shadow-xl " onClick={() => window.location.reload()}>Try&nbsp;Again</button>
  </div>
}
