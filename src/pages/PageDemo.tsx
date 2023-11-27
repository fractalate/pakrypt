import { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

// 2023-11-26 -- Expand the functionality here to be able to have a record be deleted, but don't ruin the in-progress editing of an entry. it can show something to indicate it will be re-instating a new record when it's finally saved. An alternative user-facing functionality could be to disable editing and make a warning in that spot to indicate the backing data is deleted.

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
  if (!name) {
    throw new Error('Shame name.')
  }
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
  let updated = false
  const entries = container.entries.map((entry) => {
    if (entry.name === name) {
      updated = true
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

interface InputsEntryEdit {
  name: string,
  value: number,
}

export default function PageDemo() {
  const container0 = useMemo(() => {
    let container = newMyContainer()
    container = entryAdd(container, 'Gremlins', 2)
    container = entryAdd(container, 'Imps', 1)
    return container
  }, [])

  const [container, setContainer] = useState(container0)
  const [editing0, setEditing0] = useState(null as null | string)
  const [editingRef0, setEditingRef0] = useState(null as null | MyEntry)
  const [editing1, setEditing1] = useState(null as null | string)
  const [editingRef1, setEditingRef1] = useState(null as null | MyEntry)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<InputsEntryAdd>()

  const onSubmit: SubmitHandler<InputsEntryAdd> = (data) => {
    setContainer(entryAdd(container, data.name, data.value))
    reset()
  }

  const {
    register: registerEdit0,
    handleSubmit: handleSubmitEdit0,
    reset:  resetEdit0,
    setValue: setValueEdit0,
  } = useForm<InputsEntryEdit>()

  const onSubmitEdit0: SubmitHandler<InputsEntryEdit> = (data) => {
    setContainer(entryUpdate(container, data.name, data.value))
    setEditing0(null)
    setEditingRef0(null)
    resetEdit0()
  }

  const {
    register: registerEdit1,
    handleSubmit: handleSubmitEdit1,
    reset: resetEdit1,
    setValue: setValueEdit1,
  } = useForm<InputsEntryEdit>()

  const onSubmitEdit1: SubmitHandler<InputsEntryEdit> = (data) => {
    setContainer(entryUpdate(container, data.name, data.value))
    setEditing1(null)
    setEditingRef1(null)
    resetEdit1()
  }

  const entries0 = container.entries.map((entry) => <div key={ entry.name } className="my-1 p-1 bg-gray-100">
    <div>
      { entry.name } = { (entry.name === editing0) ?
          <form className="inline" onSubmit={handleSubmitEdit0(onSubmitEdit0)}>
            <input type="hidden" autoComplete="off" {...registerEdit0('name', { required: true }) } />
            <input type="number" autoComplete="off" {...registerEdit0('value', { required: true, valueAsNumber: true })} />
            <button type="submit" className="ml-2 p-2 rounded-xl bg-blue-500 text-white shadow">Done</button>
            {(editingRef0 == entry) ? '' : '⚠️'}
          </form>
        :
          <>
            {entry.value}
            <button className="ml-2 mr-1 p-2 rounded-xl bg-blue-500 text-white shadow" onClick={() => {
              setEditing0(entry.name)
              setEditingRef0(entry)
              setValueEdit0('name', entry.name)
              setValueEdit0('value', entry.value)
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
      { entry.name } = { (entry.name === editing1) ?
          <form className="inline" onSubmit={handleSubmitEdit1(onSubmitEdit1)}>
            <input type="hidden" autoComplete="off" {...registerEdit1('name', { required: true }) } />
            <input type="number" autoComplete="off" {...registerEdit1('value', { required: true, valueAsNumber: true })} />
            <button type="submit" className="ml-2 p-2 rounded-xl bg-blue-500 text-white shadow">Done</button>
            {(editingRef1 == entry) ? '' : '⚠️'}
          </form>
        :
          <>
            {entry.value}
            <button className="ml-2 mr-1 p-2 rounded-xl bg-blue-500 text-white shadow" onClick={() => {
              setEditing1(entry.name)
              setEditingRef1(entry)
              setValueEdit1('name', entry.name)
              setValueEdit1('value', entry.value)
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
}
