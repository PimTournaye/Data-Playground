import * as d3 from 'd3';

//--------------------
// SELECTIONS --------
//--------------------

let width = window.innerWidth;
let height = window.innerHeight;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)


let time = 0;

setInterval(() => {
  const data = d3.range(15).map(d => ({
    x: d * 50 + 25,
    y: height / 2 + Math.sin(d * 0.5 + time) * 200,
  }))

  const circles = svg
    .selectAll('circle')
    .data(data)
    .join('circle') // set into data point, only triggers the first time
      .attr('r', 20)
      .attr('cx', d => d.x) 
      .attr('cy', d => d.y)
      // connect the circles with a line from lineData

  const line = svg
    .selectAll('path')
    .data([null])
    .join('path')
      .attr('d', d3.line()
        .x(d => d.x)
        .y(d => d.y)
        (data)) // data is the array of objects used to create the line
      .attr('stroke', 'black')
      .attr('fill', 'none')


  time = time + 0.1;
}, 50  );