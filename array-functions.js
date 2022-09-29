import * as d3 from 'd3';

//--------------------
// ARRAY FUNCTIONS ---
//--------------------

const init = [
  { name: 'Alice', age: 21 },
  { name: 'Bob', age: 23 },
]

const desiredResult = [
  { name: "Bob", age: 23 },
  { name: "Alice", age: 21 },
  { name: "Joe", age: 26 },
  { name: "Mary",age: 24 },
  { name: "John",age: 25 },
]

let process = init.reduce((acc, { name, age }) => {
  acc.push({ [name]: age });
  return acc;
}, []); // outputs [{ "Alice": 21 }, { "Bob": 23 }]

// alternate way of reconstructing the array

let processType2 = init.reduce((acc, d) => {
  acc[d.name] = d.age;
  return acc;
}, {}); // outputs { "Alice": 21, "Bob": 23 }

// using d3 to sort the array
let sortedResult = desiredResult.sort((a, b) => d3.ascending(a.age, b.age))
console.log(sortedResult);