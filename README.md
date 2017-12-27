# CupDB

A text based key-value database for Node and Electron.

## Usage

```bash
npm install cupdb
```

```js
const cup = require('cupdb')
const db = cup('data.db')

// set
await db.setItem('a', 123)
await db.setItem('b', 'BBB')
await db.setItem('c', ['a', 'b', 'c'])
awiat db.setItem('d', {x: 100, y: 200})

// get
await db.getItem('a') // 123
await db.getItem('b') // BBB
(await db.getItem('c')).join(',') // a,b,c
(await db.getItem('d')).x // 100

// close
await db.close()
```

## API

__cup(file_path)__

Return an instance of CupDB, the data will be saved to `file_path`.

__db.setItem(key, value)__

Set item with `key` and `value`.

__db.getItem(key)__

Get item with `key`, `undefined` will be returned if not found.

__db.getItems(keys)__

Get items with `keys`, the returned value is an array.

```js
db.getItems(['k1', 'k2', 'k3']) // resule: [v1, v2, v3]
```

__db.getAll()__

Get all items, the returned value is an array.

__db.getKeys()__

Get all keys of items.

__db.remove(key)__

Remove the item with `key`.

```js
db.remove('abc')

// or remove severail items in one command
db.remove(['abc', 'd2', 'd3', 'd4'])
```

__db.find(filter)__

Find items by `filter`, the `filter` is a function, the returned value is an array.

```js
db.find((key, value) => {
  return /^my_/.test(key) && typeof value === 'string'
})
```

__db.dump()__

Organize and persist data to the hard disk.

__db.close()__

Close current db, the `db.dump()` method will be called by `db.close()`.

## License

MIT.
