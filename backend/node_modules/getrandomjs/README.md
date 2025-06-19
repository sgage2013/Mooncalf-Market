# getRandomJs for NPM

link to npm package:

```
https://www.npmjs.com/package/getrandomjs?activeTab=explore
```

Have you ever been tired of having to get a random element from an array, string, or object and you have to use Math.floor(Math.random()\* el.length)?

Well now this process is simplified!

With getrandomjs, you can pass in a string, array, min/max, or object and get a random element back!

If you decide to not pass anything in, it will just give you a random number between 1-100.

How to use?

In the root of the project, Run:

```
npm i getrandomjs
```

Then you can import into a JS file using:

```
const random = require('getrandomjs')
```

Feel free to rename the const to whatever works easiest for you!

Now you can just use

```
random()
```

Example with Object:

```
const random = require('getrandomjs');

let obj = {a: 1, b: 2, c:3}
random(obj) // => random value from obj, either 1,2, or 3

```

Example with Array:

```
const random = require('getrandomjs');

let arr = [1,2,3,4,5]

random(arr) // => random value in arr

```

```
const random = require('getrandomjs');

let min = 0
let max = 10

random(min, max) // returns a random number between 0 and 10

```

```
const random = require('getrandomjs');

random('hello world') //randon char within the string

```

```
const random = require('getrandomjs');

random() //random number between 0 and 100
```

Happy coding!
