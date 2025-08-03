========================
CODE SNIPPETS
========================
TITLE: Install Valtio using npm
DESCRIPTION: This snippet shows the command to install the Valtio library using the npm package manager. It's the first step to set up Valtio in your project, allowing you to use its state management capabilities.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install valtio
```

----------------------------------------

TITLE: Set up Valtio Starter Project Locally
DESCRIPTION: This bash script outlines the process to clone the Valtio repository, install its dependencies, build the library, navigate to the 'starter' example, install its specific dependencies, and finally start the development server. It uses `pnpm` for package management.

SOURCE: https://github.com/pmndrs/valtio/blob/main/examples/starter/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
git clone https://github.com/pmndrs/valtio

# install project dependencies & build the library
cd valtio && pnpm install

# move to the examples folder & install dependencies
cd examples/starter && pnpm install

# start the dev server
pnpm dev
```

----------------------------------------

TITLE: Start Next.js Development Server
DESCRIPTION: This snippet shows how to initiate the Next.js development server using either npm or yarn. Running this command will typically make the application accessible at http://localhost:3000 in your browser.

SOURCE: https://github.com/pmndrs/valtio/blob/main/website/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
```

----------------------------------------

TITLE: Add Todo and Initiate Countdown in Valtio (TypeScript/TSX)
DESCRIPTION: An enhanced `addTodo` function that processes form submission, extracts deadline and description, creates a new todo item in `store.todos`, and then immediately calls the `countdown` function for the newly added todo. This demonstrates how to integrate module-scoped mutation logic into an action.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
const addTodo = (e: React.SyntheticEvent, reset: VoidFunction) => {
  e.preventDefault()
  const target = e.target as typeof e.target & {
    deadline: { value: Date }
    description: { value: string }
  }
  const deadline = target.deadline.value
  const description = target.description.value
  const now = Date.now()
  store.todos.push({
    description,
    status: 'pending',
    id: now,
    timeLeft: new Date(deadline).getTime() - now,
  })
  // clear the form
  reset()
  countdown(store.todos.length - 1)
}
```

----------------------------------------

TITLE: Define Valtio Proxy Store for To-Do App
DESCRIPTION: This TypeScript snippet defines the central state store for a to-do application using Valtio's `proxy` function. It includes type definitions for `Status`, `Filter`, and `Todo`, and initializes the store with `filter` and `todos` properties, setting up the application's global state.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
import { proxy, useSnapshot } from 'valtio'

type Status = 'pending' | 'completed'
type Filter = Status | 'all'
type Todo = {
  description: string
  status: Status
  id: number
}

export const store = proxy<{
  filter: Filter;
  todos: Todo[];
}>({
  filter: 'all',
  todos: [],
})
```

----------------------------------------

TITLE: Extend To-Do Type with TimeLeft Property
DESCRIPTION: This TypeScript snippet updates the `Todo` type definition to include a new `timeLeft` property, which is a number. This modification allows tracking a countdown for each to-do item, enabling more complex time-based logic within the application.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_5

LANGUAGE: ts
CODE:
```
type Todo = {
  description: string
  status: Status
  id: number
  timeLeft: number
}
```

----------------------------------------

TITLE: Install Website Dependencies (Documentation Development)
DESCRIPTION: Installs dependencies specifically for the documentation website using pnpm. This command sets up the local environment required to develop and view documentation changes.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_7

LANGUAGE: shell
CODE:
```
pnpm install
```

----------------------------------------

TITLE: Start Documentation Development Server
DESCRIPTION: Starts the local development server for the documentation website using pnpm. This allows contributors to view their documentation changes live in a web browser at http://localhost:3000.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_8

LANGUAGE: shell
CODE:
```
pnpm run dev
```

----------------------------------------

TITLE: Install derive-valtio package
DESCRIPTION: Instructions to install the derive-valtio package using npm.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/derive.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install derive-valtio
```

----------------------------------------

TITLE: Create React Countdown Component with Nested Valtio Snapshot
DESCRIPTION: This React/TypeScript snippet defines a `Countdown` component that displays the remaining time for a specific to-do item. It demonstrates an advanced Valtio technique by using `useSnapshot` on a nested proxy object (`store.todos[index]`), allowing fine-grained reactivity for individual todo items without re-rendering the entire list.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
import { useSnapshot } from 'valtio'
import { formatTimeDelta, calcTimeDelta } from './utils'
import { store } from './App'

export const Countdown = ({ index }: { index: number }) => {
  const snap = useSnapshot(store.todos[index])
  const delta = calcTimeDelta(snap.timeLeft)
  const { days, hours, minutes, seconds } = formatTimeDelta(delta)
  return (
    <span className="countdown-time">
      {delta.total < 0 ? '-' : ''}
      {days}
      {days ? ':' : ''}
      {hours}:{minutes}:{seconds}
    </span>
  )
}
```

----------------------------------------

TITLE: Install Project Dependencies (Core Development)
DESCRIPTION: Installs all necessary project dependencies for core development using pnpm. This command is a prerequisite for setting up the development environment after cloning or forking the repository.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_3

LANGUAGE: shell
CODE:
```
pnpm install
```

----------------------------------------

TITLE: Basic Usage of proxyMap with Valtio
DESCRIPTION: Demonstrates the basic initialization and usage of `proxyMap`, showing how to set, get, and delete entries, and how the `size` property updates.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/proxyMap.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
import { proxyMap } from 'valtio/utils'

const state = proxyMap()
state.size // ---> 0

state.set(1, 'hello')
state.size // ---> 1

state.delete(1)
state.size // ---> 0
```

----------------------------------------

TITLE: Define Valtio Actions for To-Do State Mutations
DESCRIPTION: This TypeScript snippet defines several action functions (`addTodo`, `removeTodo`, `toggleDone`, `setFilter`) that directly mutate the Valtio `store`. These functions encapsulate the logic for modifying the to-do list and filter, demonstrating the straightforward way to update proxy state in Valtio.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_3

LANGUAGE: ts
CODE:
```
const addTodo = (description: string) => {
  store.todos.push({
    description,
    status: 'pending',
    id: Date.now(),
  })
}

const removeTodo = (id: number) => {
  const index = store.todos.findIndex((todo) => todo.id === id)
  if (index >= 0) {
    store.todos.splice(index, 1)
  }
}

const toggleDone = (id: number, currentStatus: Status) => {
  const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending'
  const todo = store.todos.find((todo) => todo.id === id)
  if (todo) {
    todo.status = nextStatus
  }
}

const setFilter = (filter: Filter) => {
  store.filter = filter
}
```

----------------------------------------

TITLE: Install Babel Plugin Module Resolver
DESCRIPTION: These commands provide instructions for installing the `babel-plugin-module-resolver` package, which is essential for enabling path alias resolution in Babel-powered projects. Both npm and Yarn installation methods are provided.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-easily-access-the-state-from-anywhere-in-the-application.mdx#_snippet_3

LANGUAGE: shell
CODE:
```
npm install babel-plugin-module-resolver
```

LANGUAGE: shell
CODE:
```
yarn add babel-plugin-module-resolver
```

----------------------------------------

TITLE: Basic Usage of proxySet with Valtio
DESCRIPTION: This example demonstrates the fundamental usage of `proxySet` from `valtio/utils`. It shows how to initialize a `proxySet` with an array of values and perform common Set operations like `add` and `delete`, illustrating that its API mirrors the native JavaScript `Set`.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/proxySet.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { proxySet } from 'valtio/utils'

const state = proxySet([1, 2, 3])

state.add(4)
state.delete(1)
state.forEach((v) => console.log(v)) // --->  2,3,4
```

----------------------------------------

TITLE: Wire Valtio Action to React Button
DESCRIPTION: This React/TypeScript snippet shows a simple example of how to connect a Valtio action, `removeTodo`, to a UI element's event handler. Clicking the button will trigger the `removeTodo` function, directly updating the global Valtio state without complex callbacks.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
<button className="remove" onClick={() => removeTodo(id)}>
  x
</button>
```

----------------------------------------

TITLE: Render Valtio State in React with useSnapshot
DESCRIPTION: This React/TypeScript snippet demonstrates how to consume Valtio state within a functional component using the `useSnapshot` hook. It creates a reactive snapshot of the `store` and renders a list of filtered to-do items, ensuring the component re-renders efficiently only when relevant state properties change.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
const Todos = () => {
  const snap = useSnapshot(store)
  return (
    <ul>
      {snap.todos
        .filter(({ status }) => status === snap.filter || snap.filter === 'all')
        .map(({ description, status, id }) => {
          return (
            <li key={id}>
              <span data-status={status} className="description">
                {description}
              </span>
              <button className="remove">x</button>
            </li>
          )
        })}
    </ul>
  )
}
```

----------------------------------------

TITLE: Create and Use Valtio proxyMap Utility in JavaScript
DESCRIPTION: Demonstrates how to use the `proxyMap` utility from `valtio/utils` to create a reactive map. It shows initialization with an array of key-value pairs, and common Map-like operations such as `set`, `delete`, `get`, and `forEach` to manage and iterate over state.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_19

LANGUAGE: JavaScript
CODE:
```
import { proxyMap } from 'valtio/utils'

const state = proxyMap([
  ['key', 'value'],
  ['key2', 'value2'],
])
state.set('key', 'value')
state.delete('key')
state.get('key') // ---> value
state.forEach((value, key) => console.log(key, value)) // ---> "key", "value", "key2", "value2"
```

----------------------------------------

TITLE: Valtio: Using `proxy()` for Reactive State Management
DESCRIPTION: This example demonstrates how `proxy()` creates a reactive object. Mutations to the proxy trigger subscriptions, even for nested objects. It shows how `subscribe` reacts to changes and how different proxies can be linked.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-valtio-works.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
import { proxy, subscribe } from 'valtio'

const s1 = proxy({})
subscribe(s1, () => {
  console.log('s1 is changed!')
})
s1.a = 1 // s1 is changed!
++s1.a // s1 is changed!
delete s1.a // s1 is changed!
s1.b = 2 // s1 is changed!
s1.b = 2 // (not changed)
s1.obj = {} // s1 is changed!
s1.obj.c = 3 // s1 is changed!
const s2 = s1.obj
subscribe(s2, () => {
  console.log('s2 is changed!')
})
s1.obj.d = 4 // s1 is changed! and s2 is changed!
s2.d = 5 // s1 is changed! and s2 is changed!
const s3 = proxy({})
subscribe(s3, () => {
  console.log('s3 is changed!')
})
s1.o = s3
s3.p = 'hello' // s1 is changed! and s3 is changed!
s2.q = s3
s3.p = 'hi' // s1 is changed! s2 is changed! and s3 is changed!
s1.x = s1
s1.a += 1 // s1 is changed!
```

----------------------------------------

TITLE: Use Valtio with Vanilla JavaScript
DESCRIPTION: This example illustrates how to use Valtio's core functionalities (`proxy`, `subscribe`, `snapshot`) in a plain JavaScript environment without React. It shows how to create a reactive state, subscribe to its mutations, and obtain an immutable snapshot of the state at any given time.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/devtools.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const state = proxy({ count: 0, text: 'hello' })

subscribe(state, () => {
  console.log('state is mutated')
  const obj = snapshot(state) // A snapshot is an immutable object
})
```

----------------------------------------

TITLE: Mutate Valtio State with Recursive Countdown Function (TypeScript/TSX)
DESCRIPTION: Defines a recursive `countdown` function in module scope that directly mutates a `store.todos` item. It handles cases where a todo is removed, completed, or overdue, and decrements `timeLeft` every second, allowing state updates independent of React components.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/introduction/getting-started.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
const countdown = (index: number) => {
  const todo = store.todos[index]
  // user removed todo case
  if (!todo) return
  // todo done of overdue case
  if (todo.status !== 'pending') {
    return
  }
  // time over
  if (todo.timeLeft < 1000) {
    todo.timeLeft = 0
    todo.status = 'overdue'
    return
  }
  setTimeout(() => {
    todo.timeLeft -= 1000
    countdown(index)
  }, 1000)
}
```

----------------------------------------

TITLE: Conventional Commit Example: New Feature
DESCRIPTION: Demonstrates the 'feat' commit type for adding new features, adhering to the conventional commit specification. The message format includes the type, a colon, a space, and a lowercase description.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_0

LANGUAGE: text
CODE:
```
feat: add a 'foo' type support
```

----------------------------------------

TITLE: Basic Usage of `snapshot` with Valtio Proxies
DESCRIPTION: This example demonstrates the core functionality of Valtio's `snapshot` function. It shows how `snapshot` creates an immutable copy of a proxy's state and efficiently returns the same reference for unchanged states, optimizing re-renders. The snippet also illustrates how a new snapshot is generated upon state mutation.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/snapshot.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import { proxy, snapshot } from 'valtio'

const store = proxy({ name: 'Mika' })
const snap1 = snapshot(store) // an efficient copy of the current store values, unproxied
const snap2 = snapshot(store)
console.log(snap1 === snap2) // true, no need to re-render

store.name = 'Hanna'
const snap3 = snapshot(store)
console.log(snap1 === snap3) // false, should re-render
```

----------------------------------------

TITLE: Initial Snapshot Creation with Nested Objects
DESCRIPTION: This snippet illustrates the initial creation of a snapshot for a proxy containing nested objects and arrays. It sets up a complex `author` proxy with a `books` array, serving as a foundational example for understanding Valtio's copy-on-write mechanism with deeply structured data.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/snapshot.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```
const author = proxy({
  firstName: 'f',
  lastName: 'l',
  books: [{ title: 't1' }, { title: 't2' }],
})

const s1 = snapshot(author)
```

----------------------------------------

TITLE: Valtio: Creating Immutable Snapshots with `snapshot()`
DESCRIPTION: This example illustrates the `snapshot()` function, which creates an immutable, plain JavaScript object from a proxy. It shows how snapshots are memoized when the proxy hasn't changed and how new snapshots are generated upon mutation, even if the values become deep equal again.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-valtio-works.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
import { proxy, snapshot } from 'valtio'

const p = proxy({})
const s1 = snapshot(p) // is {} but not wrapped by a proxy
const s2 = snapshot(p)
s1 === s2 // is true because p wasn't changed
p.a = 1 // mutate the proxy
const s3 = snapshot(p) // is { a: 1 }
p.a = 1 // mutation bails out and proxy is not updated
const s4 = snapshot(p)
s3 === s4 // is still true
p.a = 2 // mutate it
const s5 = snapshot(p) // is { a: 2 }
p.a = 1 // mutate it back
const s6 = snapshot(p) // creates a new snapshot
s3 !== s6 // is true (different snapshots, even though they are deep equal)
p.obj = { b: 2 } // attaching a new object, which will be wrapped by a proxy
const s7 = snapshot(p) // is { a: 1, obj: { b: 2 } }
p.a = 2 // mutating p
const s8 = snapshot(p) // is { a: 2, obj: { b: 2 } }
s7 !== s8 // is true because a is different
s7.obj === s8.obj // is true because obj is not changed
```

----------------------------------------

TITLE: Subscribe to all Valtio proxy state changes
DESCRIPTION: This example demonstrates how to use the `subscribe` function to listen for any changes occurring within a Valtio proxy state. It initializes a proxy, subscribes to its updates, logs the new state, and shows how to unsubscribe.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/subscribe.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
import { proxy, subscribe } from 'valtio'

const state = proxy({ count: 0 })

// Subscribe to all changes to the state proxy (and its child proxies)
const unsubscribe = subscribe(state, () =>
  console.log('state has changed to', state),
)
// Unsubscribe by calling the result
unsubscribe()
```

----------------------------------------

TITLE: Valtio Array Proxy Unexpected Behavior Example
DESCRIPTION: Demonstrates a common pattern of array manipulation (forEach, splice, push) that can lead to unexpected results when working with Valtio array proxies, especially concerning subscriptions and snapshots.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/some-gotchas.mdx#_snippet_8

LANGUAGE: javascript
CODE:
```
const byId = {}
arr.forEach((item) => {
  byId[item.id] = item
})
arr.splice(0, arr.length)
arr.push(newValue())
someUpdateFunc(byId)
Object.keys(byId).forEach((key) => arr.push(byId[key]))
```

----------------------------------------

TITLE: Subscribe to multiple Valtio proxies with watch
DESCRIPTION: Demonstrates how to use `watch` to subscribe to changes in multiple Valtio proxy objects. The `get` function is used within the callback to register proxies for observation. The callback runs immediately to establish initial subscriptions and then reruns whenever any of the watched proxies change.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/watch.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { proxy } from 'valtio'
import { watch } from 'valtio/utils'

const userState = proxy({ user: { name: 'Juuso' } })
const sessionState = proxy({ expired: false })

watch((get) => {
  // `get` adds `sessionState` to this callback's watched proxies
  get(sessionState)
  const expired = sessionState.expired
  // Or call it inline
  const name = get(userState).user.name
  console.log(`${name}'s session is ${expired ? 'expired' : 'valid'}`)
})
// 'Juuso's session is valid'
sessionState.expired = true
// 'Juuso's session is expired'
```

----------------------------------------

TITLE: Handle Promises in Valtio Proxied Objects with Vanilla JS
DESCRIPTION: This example demonstrates how to store and resolve Promises within a Valtio proxied object using vanilla JavaScript. It shows how `snapshot` resolves the promise and updates the DOM, then re-assigns a new promise to the store for continuous updates.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/guides/async.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
// vanillajs example
const countDiv: HTMLElement | null = document.getElementById('count')
if (countDiv) countDiv.innerText = '0'

const store = proxy({
  count: new Promise((r) => setTimeout(() => r(1), 1000)),
})

subscribe(store, () => {
  const value = snapshot(store).count
  if (countDiv && typeof value === 'number') {
    countDiv.innerText = String(value)
    store.count = new Promise((r) => setTimeout(() => r(value + 1), 1000))
  }
})
```

----------------------------------------

TITLE: Handling Classes and Methods with Valtio Snapshots
DESCRIPTION: This example demonstrates how Valtio's `snapshot` function interacts with JavaScript classes and their methods. It shows that snapshots preserve the original prototype, allowing methods to be called directly on the snapshot. Crucially, it illustrates that method invocations on the snapshot operate on the frozen snapshot's state, ensuring predictable behavior.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/snapshot.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
import { proxy, snapshot } from 'valtio'

class Author {
  firstName = 'f'
  lastName = 'l'
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

const state = proxy(new Author())
const snap = snapshot(state)

// the snapshot has the Author prototype
console.log(snap instanceof Author) // true

state.firstName = 'f2'

// Invocations use the snapshot's state, e.g. this is still 'f' because
// inside `fullName`, `this` will be the frozen snapshot instance and not
// the mutable state proxy
console.log(snap.fullName()) // 'f l'
```

----------------------------------------

TITLE: Valtio State Proxy Definition
DESCRIPTION: Defines a basic Valtio proxy state object with nested properties `count` and `text` within `obj`. This state structure is used in subsequent examples to demonstrate various re-rendering behaviors with `useSnapshot`.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/some-gotchas.mdx#_snippet_0

LANGUAGE: js
CODE:
```
const state = proxy({
  obj: {
    count: 0,
    text: 'hello',
  },
})
```

----------------------------------------

TITLE: Initialize and manage state history with proxyWithHistory in JavaScript
DESCRIPTION: This JavaScript example demonstrates how to use `proxyWithHistory` from `valtio-history` to create a state object that supports undo and redo operations. It shows initialization, modifying the state, and then reverting or re-applying changes using `state.undo()` and `state.redo()` methods. The `state.value` property provides access to the current snapshot of the state.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/proxyWithHistory.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { proxyWithHistory } from 'valtio-history'

const state = proxyWithHistory({ count: 0 })
console.log(state.value) // ---> { count: 0 }
state.value.count += 1
console.log(state.value) // ---> { count: 1 }
state.undo()
console.log(state.value) // ---> { count: 0 }
state.redo()
console.log(state.value) // ---> { count: 1 }
```

----------------------------------------

TITLE: Conventional Commit Example: Bug Fix with Scope
DESCRIPTION: Illustrates the 'fix' commit type for bug fixes, showcasing the optional scope in parentheses. This format helps specify the affected module or area within the commit message.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_1

LANGUAGE: text
CODE:
```
fix(react): change the 'bar' parameter type
```

----------------------------------------

TITLE: Correctly mutate and reset Valtio ref objects
DESCRIPTION: This example illustrates the proper way to interact with `ref` objects within a Valtio proxy. It shows that `ref` objects should be mutated directly (e.g., using `push` or `splice`) and explicitly warns against reassigning them, which would break the `ref`'s purpose.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/ref.mdx#_snippet_1

LANGUAGE: js
CODE:
```
// ✅ do mutate
store.users[0].uploads.push({ id: 1, name: 'Juho' })
// ✅ do reset
store.users[0].uploads.splice(0)

// ❌ don't reassign
store.users[0].uploads = []
```

----------------------------------------

TITLE: Get Internal States (Valtio APIDOC)
DESCRIPTION: Exposes the internal states of Valtio. Modifying these states may lead to incorrect behavior. This function requires a thorough understanding of the Valtio source code.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/hacks/internals.mdx#_snippet_0

LANGUAGE: APIDOC
CODE:
```
unstable_getInternalStates()
```

----------------------------------------

TITLE: Optimize derive re-computation using sub-objects
DESCRIPTION: Demonstrates how to optimize `derive` re-computation by using `get` on sub-objects. This prevents re-computation when unrelated properties of the parent object are updated, improving performance.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/derive.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```
const baseProxy = proxy({
  counter1And2: {
    counter1: 0,
    counter2: 0,
  },
  counter3: 0,
  counter4: 0,
})

const countersOneAndTwoSelectors = derive({
  sum: (get) =>
    get(baseProxy.counter1And2).counter1 + get(baseProxy.counter1And2).counter2,
})
```

----------------------------------------

TITLE: Subscribe to specific portions of Valtio state
DESCRIPTION: This example illustrates how to subscribe to changes within specific nested objects or arrays inside a Valtio proxy. It shows separate subscriptions for `state.obj` and `state.arr`, demonstrating granular change detection.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/subscribe.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
const state = proxy({ obj: { foo: 'bar' }, arr: ['hello'] })

subscribe(state.obj, () => console.log('state.obj has changed to', state.obj))
state.obj.foo = 'baz'
subscribe(state.arr, () => console.log('state.arr has changed to', state.arr))
state.arr.push('world')
```

----------------------------------------

TITLE: Create a circular reference within a Valtio proxy state in JavaScript
DESCRIPTION: Illustrates how to establish a circular reference within a Valtio proxy state. In this example, a property ('bar') of an object ('obj') points back to the object itself, demonstrating a less common but possible state structure.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-split-and-compose-states.mdx#_snippet_3

LANGUAGE: js
CODE:
```
const state = proxy({
  obj: { foo: 3 }
})

state.obj.bar = state.obj // 🤯
```

----------------------------------------

TITLE: Mutating Nested Object and Taking New Snapshot
DESCRIPTION: This example demonstrates how to mutate a nested property within a Valtio proxy and subsequently create a new snapshot. Specifically, it modifies a book title within the `author` proxy. This highlights how Valtio's copy-on-write strategy selectively updates only the changed parts of the state.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/snapshot.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:
```
author.books[1].title = 't2b'
const s2 = snapshot(author)
```

----------------------------------------

TITLE: Conditionally Update Local State with Valtio Subscription
DESCRIPTION: This approach demonstrates how to manually subscribe to Valtio state changes and conditionally update a local React state using `useState` and `useEffect`. The first example shows a basic implementation, while the second provides a more robust fix to ensure the initial state is correctly processed and to prevent race conditions where state might change before the subscription is active.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-avoid-rerenders-manually.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
const Component = () => {
  const [count, setCount] = useState(state.count)
  useEffect(
    () =>
      subscribe(state, () => {
        if (state.count % 2 === 0) {
          // conditionally update local state
          setCount(state.count)
        }
      }),
    [],
  )
  return <>{count}</>
}
```

LANGUAGE: jsx
CODE:
```
const Component = () => {
  const [count, setCount] = useState(state.count)
  useEffect(() => {
    const callback = () => {
      if (state.count % 2 === 0) {
        // conditionally update local state
        setCount(state.count)
      }
    }
    const unsubscribe = subscribe(state, callback)
    callback()
    return unsubscribe
  }), [])
  return <>{count}</>
}
```

----------------------------------------

TITLE: Create a Valtio Proxy Object
DESCRIPTION: Demonstrates how to initialize a basic proxy object using `proxy` from Valtio, tracking changes to its properties.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/basic/proxy.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { proxy } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })
```

----------------------------------------

TITLE: Manage Set-like Collections with Valtio proxySet Utility
DESCRIPTION: Demonstrates the `proxySet` utility from `valtio/utils`, which creates a proxy mimicking native JavaScript Set behavior. It shows how to initialize, add, delete, and iterate over elements in a proxySet, and notes its usability within other proxies.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_18

LANGUAGE: js
CODE:
```
import { proxySet } from 'valtio/utils'

const state = proxySet([1, 2, 3])
//can be used inside a proxy as well
//const state = proxy({
//    count: 1,
//    set: proxySet()
//})

state.add(4)
state.delete(1)
state.forEach((v) => console.log(v)) // 2,3,4
```

----------------------------------------

TITLE: Correct Valtio Vanilla Module Import
DESCRIPTION: Demonstrates the correct way to import Valtio's framework-agnostic modules for non-React projects by importing directly from 'valtio/vanilla' or 'valtio/vanilla/utils'. This avoids unnecessary React dependencies and build errors.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/some-gotchas.mdx#_snippet_12

LANGUAGE: typescript
CODE:
```
import { proxy, snapshot, subsribe } from 'valtio/vanilla'
// this also applies for the utils
import { proxyMap, deepClone } from 'valtio/vanilla/utils'
```

----------------------------------------

TITLE: Import Valtio and Lighterhtml Modules in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates importing `render` and `html` from `lighterhtml` and a default export `pk` from `valtio` directly via unpkg.com. This pattern is suitable for browser-based module usage without a build step.

SOURCE: https://github.com/pmndrs/valtio/blob/main/examples/subscribe/index.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import { render, html } from '//unpkg.com/lighterhtml?module' import pk from '//unpkg.com/valtio@1.3.0?module'
```

----------------------------------------

TITLE: Simplify Valtio State Access with useProxy Utility
DESCRIPTION: Introduces the `useProxy` utility from `valtio/utils` to simplify developer experience by returning a shallow proxy state and its snapshot. It notes that mutation is only allowed at the root level and the special proxy must be used directly in a function scope.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_16

LANGUAGE: js
CODE:
```
import { useProxy } from 'valtio/utils'

const state = proxy({ count: 1 })

const Component = () => {
  // useProxy returns a special proxy that can be used both in render and callbacks
  // The special proxy has to be used directly in a function scope. You can't destructure it outside the scope.
  const $state = useProxy(state)
  return (
    <div>
      {$state.count}
      <button onClick={() => ++$state.count}>+1</button>
    </div>
  )
}
```

----------------------------------------

TITLE: Initialize Valtio Proxy State
DESCRIPTION: Demonstrates how to create a reactive proxy object using `proxy` from Valtio, making a plain JavaScript object self-aware for state management. This object can then be mutated directly.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_0

LANGUAGE: jsx
CODE:
```
import { proxy, useSnapshot } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })
```

----------------------------------------

TITLE: Navigate to Website Directory
DESCRIPTION: Changes the current working directory to the 'website' folder. This is the initial step for contributors looking to work on the project's documentation.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_6

LANGUAGE: shell
CODE:
```
cd website
```

----------------------------------------

TITLE: Create and attach derived proxies with derive
DESCRIPTION: Demonstrates how to create a new proxy derived from an existing one, and how to attach derived properties to an existing proxy using the `derive` utility.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/utils/derive.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
import { derive } from 'derive-valtio'

// create a base proxy
const state = proxy({
  count: 1,
})

// create a derived proxy
const derived = derive({
  doubled: (get) => get(state).count * 2,
})

// alternatively, attach derived properties to an existing proxy
derive(
  {
    tripled: (get) => get(state).count * 3,
  },
  {
    proxy: state,
  },
)
```

----------------------------------------

TITLE: Subscribe to All Valtio State Changes
DESCRIPTION: Shows how to subscribe to all changes in a Valtio proxy state using the `subscribe` function. It demonstrates how to register a callback function that executes on any state modification and how to unsubscribe by calling the returned function.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_5

LANGUAGE: jsx
CODE:
```
import { subscribe } from 'valtio'

// Subscribe to all state changes
const unsubscribe = subscribe(state, () =>
  console.log('state has changed to', state),
)
// Unsubscribe by calling the result
unsubscribe()
```

----------------------------------------

TITLE: Build Valtio Library
DESCRIPTION: Builds the Valtio library using pnpm. This step compiles the source code and is essential after making changes to ensure the library functions correctly. A watch mode is also available for continuous building.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_4

LANGUAGE: shell
CODE:
```
pnpm run build
```

----------------------------------------

TITLE: Use Valtio in Vanilla JavaScript Environments
DESCRIPTION: Shows how Valtio can be used independently of React in vanilla JavaScript applications. It covers creating a proxy, subscribing to state mutations, and taking immutable snapshots of the state.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_15

LANGUAGE: js
CODE:
```
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
// import { ... } from 'valtio/vanilla/utils'

const state = proxy({ count: 0, text: 'hello' })

subscribe(state, () => {
  console.log('state is mutated')
  const obj = snapshot(state) // A snapshot is an immutable object
})
```

----------------------------------------

TITLE: Adapting to Impure proxy(obj) Behavior in Valtio v2
DESCRIPTION: Explains the change in `proxy(obj)` behavior from v1 (pure, deep copy) to v2 (impure, deep modification). It shows the recommended way of using `proxy` that works in both versions, and how to use `deepClone` from `valtio/utils` in v2 if object reuse is necessary to maintain v1's deep copy behavior.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/guides/migrating-to-v2.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
import { proxy } from 'valtio'

// This works in both v1 and v2
const state = proxy({ count: 1, obj: { text: 'hi' } })

// This works in both v1 and v2
state.obj = { text: 'hello' }
```

LANGUAGE: javascript
CODE:
```
// v1
import { proxy } from 'valtio'

const initialObj = { count: 1, obj: { text: 'hi' } }
const state = proxy(initialObj)
// and do something later with `initialObj`

const newObj = { text: 'hello' }
state.obj = newObj
// and do something later with `newObj`
```

LANGUAGE: javascript
CODE:
```
// v2
import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

const initialObj = { count: 1, obj: { text: 'hi' } }
const state = proxy(deepClone(initialObj))
// and do something later with `initialObj`

const newObj = { text: 'hello' }
state.obj = deepClone(newObj)
// and do something later with `newObj`
```

----------------------------------------

TITLE: Importing Valtio for Vanilla JavaScript Environments
DESCRIPTION: This snippet provides the correct import statement for using Valtio's `proxy` and `snapshot` functions in vanilla JavaScript environments. It specifies importing from `valtio/vanilla` to ensure proper compatibility and functionality when not using a framework like React.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/advanced/snapshot.mdx#_snippet_5

LANGUAGE: JavaScript
CODE:
```
import { proxy, snapshot } from 'valtio/vanilla'
```

----------------------------------------

TITLE: Run Project Tests (Core Development)
DESCRIPTION: Executes the project's test suite using pnpm. Running tests is crucial to verify that changes haven't introduced regressions and that new features or fixes work as intended.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_5

LANGUAGE: shell
CODE:
```
pnpm run test
```

----------------------------------------

TITLE: Valtio: Optimized Snapshot Creation and Memoization
DESCRIPTION: This snippet demonstrates how valtio optimizes snapshot creation. When only a part of the state changes, `snapshot()` intelligently reuses unchanged parts of the previous snapshot, ensuring referential equality for unchanged branches.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-valtio-works.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
const state = proxy({ a: { aa: 1 }, b: { bb: 2 } })
const snap1 = snapshot(state)
console.log(snap1) // ---> { a: { aa: 1 }, b: { bb: 2 } }
++state.a.aa
const snap2 = snapshot(state)
console.log(snap2) // ---> { a: { aa: 2 }, b: { bb: 2 } }
snap1.b === snap2.b // this is `true`, it doesn't create a new snapshot because no properties are changed.
```

----------------------------------------

TITLE: Watch Valtio State Changes with watch Utility
DESCRIPTION: Demonstrates the `watch` utility from `valtio/utils`, which allows subscribing to state changes by accessing parts of the state within a callback. It automatically tracks dependencies based on accessed properties and returns a function to stop watching.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_8

LANGUAGE: jsx
CODE:
```
import { watch } from 'valtio/utils'

const state = proxy({ count: 0 })
const stop = watch((get) => {
  console.log('state has changed to', get(state)) // auto-subscribe on use
})
```

----------------------------------------

TITLE: Using class for state and actions
DESCRIPTION: This pattern organizes state and actions within a JavaScript class, then proxies an instance of that class. It provides a structured, object-oriented approach to managing state and its associated behaviors.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-organize-actions.mdx#_snippet_4

LANGUAGE: js
CODE:
```
class State {
  count = 0
  name = 'foo'
  inc() {
    ++this.count
  }
  setName(name) {
    this.name = name
  }
}

export const state = proxy(new State())
```

----------------------------------------

TITLE: Format Code with Prettier
DESCRIPTION: Automatically formats the code according to the project's style guidelines using pnpm. This command should be run before committing to ensure consistent code style across the codebase.

SOURCE: https://github.com/pmndrs/valtio/blob/main/CONTRIBUTING.md#_snippet_2

LANGUAGE: shell
CODE:
```
pnpm run fix:format
```

----------------------------------------

TITLE: Integrate Babel Module Resolver for Path Aliases
DESCRIPTION: This JavaScript configuration snippet for `babel.config.js` demonstrates how to add the `module-resolver` plugin to Babel. It specifies the project's root directory, file extensions to resolve, and defines specific aliases like `@state` to map to actual file paths, enabling Babel to correctly resolve simplified import statements.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-easily-access-the-state-from-anywhere-in-the-application.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```
module.exports = {
  // ...
  plugins: [
    // The other existing plugins
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.json', '.svg', '.png'],
        alias: {
          '@state': './src/state'
        }
      }
    ]
    // ...
  ]
}
```

----------------------------------------

TITLE: Integrate Valtio with Redux DevTools Extension
DESCRIPTION: Demonstrates how to integrate Valtio with the Redux DevTools Extension for debugging and manipulating plain objects and arrays in the state. It shows how to initialize devtools for a Valtio proxy.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_14

LANGUAGE: jsx
CODE:
```
import { devtools } from 'valtio/utils'

const state = proxy({ count: 0, text: 'hello' })
const unsub = devtools(state, { name: 'state name', enabled: true })
```

----------------------------------------

TITLE: Basic Valtio State Management with React Context
DESCRIPTION: This JSX code snippet illustrates a fundamental pattern for integrating Valtio states with React context. It shows how to initialize a Valtio proxy state using `useRef` within a provider component, make it available through `createContext`, and then consume and update the state in a functional component using `useContext` and `useSnapshot`.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-use-with-context.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
import { createContext, useContext } from 'react'
import { proxy, useSnapshot } from 'valtio'

const MyContext = createContext()

const MyProvider = ({ children }) => {
  const state = useRef(proxy({ count: 0 })).current
  return <MyContext.Provider value={state}>{children}</MyContext.Provider>
}

const MyCounter = () => {
  const state = useContext(MyContext)
  const snap = useSnapshot(state)
  return (
    <>
      {snap.count} <button onClick={() => ++state.count}>+1</button>
    </>
  )
}
```

----------------------------------------

TITLE: Subscribe to a Specific Key with subscribeKey Utility
DESCRIPTION: Illustrates using `subscribeKey` from `valtio/utils` to subscribe to changes of a specific primitive property within the Valtio state. The provided callback receives the new value of the key whenever it changes.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_7

LANGUAGE: jsx
CODE:
```
import { subscribeKey } from 'valtio/utils'

const state = proxy({ count: 0, text: 'hello' })
subscribeKey(state, 'count', (v) =>
  console.log('state.count has changed to', v),
)
```

----------------------------------------

TITLE: Combine multiple Valtio proxy states into a single parent state in JavaScript
DESCRIPTION: Shows how to create individual Valtio proxy states ('obj1State', 'obj2State') and then compose them into a new parent proxy state. This allows for modular state management and combination.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-split-and-compose-states.mdx#_snippet_2

LANGUAGE: js
CODE:
```
const obj1State = proxy({ a: 1 })
const obj2State = proxy({ a: 2 })

const state = proxy({
  obj1: obj1State,
  obj2: obj2State
})
```

----------------------------------------

TITLE: Implement Class Getters and Setters with Valtio Proxy and Snapshot
DESCRIPTION: Demonstrates how to define and use class getters and setters with Valtio's `proxy` and `snapshot` functions. It illustrates how changes via setters affect the proxy and how snapshots behave differently regarding getter re-evaluation and setter mutations.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/guides/computed-properties.mdx#_snippet_9

LANGUAGE: javascript
CODE:
```
class Counter {
  count = 1
  get doubled() {
    return this.count * 2
  }
  set doubled(newValue) {
    this.count = newValue / 2
  }
}

const state = proxy(new Counter())
const snap = snapshot(state)

// Changing the state works as expected
state.doubled = 4
console.log(state.count) // 2
// And the snapshot value doesn't change
console.log(snap.doubled) // 2
```

----------------------------------------

TITLE: React.memo with Nested Valtio Proxies
DESCRIPTION: Illustrates an advanced pattern for integrating `React.memo` with Valtio by passing a proxy of a nested object directly to a memoized child component. The child then uses `useSnapshot` on this specific proxy, allowing `React.memo` to correctly track and optimize renders based on changes within that particular nested proxy.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/some-gotchas.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
const state = proxy({
  objects: [
    { id: 1, label: 'foo' },
    { id: 2, label: 'bar' },
  ],
})

const ObjectList = React.memo(() => {
  const stateSnap = useSnapshot(state)

  return stateSnap.objects.map((object, index) => (
    <Object key={object.id} objectProxy={state.objects[index]} />
  ))
})

const Object = React.memo(({ objectProxy }) => {
  const objectSnap = useSnapshot(objectProxy)

  return objectSnap.bar
})
```

----------------------------------------

TITLE: Valtio: Integrating Reactive State in React with `useSnapshot()`
DESCRIPTION: This React component demonstrates `useSnapshot()` for consuming valtio state within functional components. It shows how to read state from the immutable snapshot and how to mutate the original proxy directly, ensuring re-renders when state changes.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-valtio-works.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
import { proxy, useSnapshot } from 'valtio'

const s1 = proxy({
  counter: 0,
  text: 'Good morning from valtio',
  foo: {
    boo: 'baz'
  }
})

const MyComponent = () => {
  // Using destructuring
  const { text, counter } = useSnapshot(state)

  // Multilevel destructiong works as well
  const { text, counter, { foo }} = useSnapshot(state)

  // Assigning to a snapshot obeject
  const snap = useSnapshot(state)


  return (() => {
    <div id="main">
      <h1>{ `${foo} - ${text}` }</h1>
      {/* - or - */}
      <h1>{ `${snap.foo.bar} = `${snap.text}}</h1>
      <div>
        <input
          type="input"

          {/* we use snapshot for reading */}
          value={text}

          {/* the line above equivalent to this */}
          value={snap.text}

          {/* we use the proxy (s1) for mutations */}
          onChange={e => {
            s1.text = e.target.value
          }}
        />
      </div>
      <div>
        { counter }
        <button onClick={() => s1.counter++}> + </button>
        <button onClick={() => s1.counter--}> - </button>
      </di>
    </div>
  })

}
```

----------------------------------------

TITLE: Define Valtio State Proxy
DESCRIPTION: This JavaScript code defines a Valtio state object using the `proxy` function. It exports the `state` object along with `useSnapshot` and `subscribe` for easy access and reactivity management throughout the application. This snippet is typically placed in a dedicated state file.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-easily-access-the-state-from-anywhere-in-the-application.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
import { proxy, useSnapshot, subscribe } from 'valtio'
const state = proxy({
  foos: [],
  bar: { ... },
  boo: false
})
export { state, useSnapshot, subscribe }
```

----------------------------------------

TITLE: Action functions defined in module
DESCRIPTION: This pattern defines action functions as separate exports in the module, making them independent of the main state proxy. This approach is preferred for better code splitting and modularity.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/how-tos/how-to-organize-actions.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { proxy } from 'valtio'

export const state = proxy({
  count: 0,
  name: 'foo',
})

export const inc = () => {
  ++state.count
}

export const setName = (name) => {
  state.name = name
}
```

----------------------------------------

TITLE: Subscribe to Valtio State Changes in useEffect for Transient Updates
DESCRIPTION: Illustrates how to gain more control over transient state updates by subscribing to Valtio state changes within a `useEffect` hook. This allows for custom logic to run on state mutations without necessarily re-rendering the component.

SOURCE: https://github.com/pmndrs/valtio/blob/main/README.md#_snippet_12

LANGUAGE: jsx
CODE:
```
function Foo() {
  const total = useRef(0)
  useEffect(() => subscribe(state.arr, () => {
    total.current = state.arr.reduce((p, c) => p + c)
  }), [])
  // ...
```

----------------------------------------

TITLE: Valtio getVersion API Internal Mechanism Overview
DESCRIPTION: This API documentation details the internal workings of Valtio's `getVersion` helper and its significance in the framework's reactivity system. It explains how Valtio tracks updates to proxied objects using a global version number, assigning the latest version to mutated proxies and their parents. The document clarifies that `snapshot` relies on this mechanism to determine when a new snapshot is necessary, and advises against using `getVersion` directly in most application code due to its internal nature.

SOURCE: https://github.com/pmndrs/valtio/blob/main/docs/api/hacks/getVersion.mdx#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Function: getVersion(proxyObject)
Purpose: Checks if a proxied object has been updated by retrieving its internal version number.
Internal Mechanism:
  - Updates to proxied objects increment a global version number.
  - Mutated proxies and their parent proxies are assigned the latest version.
  - Used internally by `snapshot` to determine if a new snapshot is necessary based on proxy version changes.
Parameters:
  - proxyObject: The Valtio proxied object to check.
Usage Recommendation: Not typically useful or recommended for direct use in application code, as `snapshot` and `useSnapshot` handle version tracking internally.
```