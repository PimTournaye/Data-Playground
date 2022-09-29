import * as d3 from 'd3';

let width = 1270;
let height = 1000;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const n = 100;

svg.append('g')
  .selectAll('rect')
  .data(d3.range(n))
  .join('rect')
  .attr('y', d => d * 20)
  .attr('width', width)
  .attr('height', 10)
  .attr('mask', "url(#mask)");

svg.append('g') // create a new group element
  .selectAll('rect') // select all rect elements in this group
  .data(d3.range(n)) // associate the rect with the given array and iterate over it
  .join('rect') // create a new rect for each element in the array
  .attr('x', d => d * 20) // set the x attribute of the rect
  .attr('width', 10) // set the width attribute of the rect
  .attr('height', height) // set the height attribute of the rect
  .attr('mask', "url(#mask2)"); // set the mask attribute of the rect

// MASK 1
const mask = svg.append('mask')
  .attr('id', 'mask');

mask.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'black');

mask.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', 400)
  .attr('fill', 'white');

// MASK 2
const mask2 = svg.append('mask')
  .attr('id', 'mask2');

mask2.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'white');

mask2.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', 400)
  .attr('fill', 'black');