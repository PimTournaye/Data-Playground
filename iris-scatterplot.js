import * as d3 from 'd3';

let dataset = './datasets/iris.csv';

let width = window.innerWidth;
let height = window.innerHeight;

let rows = [
  "sepal_length",
  "sepal_width",
  "petal_length",
  "petal_width",
  "species"
]

// Convert data from strings to numbers with the + operator
const parseRow = (d) => {
  d.sepal_length = +d.sepal_length,
    d.sepal_width = +d.sepal_width,
    d.petal_length = +d.petal_length,
    d.petal_width = +d.petal_width,
    d.species = d.species
  return d;
}

const xValue = d => d.petal_length;
const yValue = d => d.sepal_length;
const speciesColor = d => {
  if (d.species === "setosa") {
    return "red";
  } else if (d.species === "versicolor") {
    return "green";
  } else if (d.species === "virginica") {
    return "blue";
  }
}

const proximityRadius = (d, set) => {
  let radius = 5;
  // calculate a proximity radius depending on the width and height of the screen
  let relativeProximity = 0.01 * Math.sqrt(width * height);
  // check the distance between the current point and all other points
  // if the distance is less than 10, increase the radius per point in that proximity
  for (let i = 0; i < set.length; i++) {
    let x1 = xValue(d);
    let y1 = yValue(d);
    let x2 = xValue(set[i]);
    let y2 = yValue(set[i]);
    let distanceX = ((x1 - x2) ** 2);
    let distanceY = ((y1 - y2) ** 2);
    if (Math.sqrt(distanceX + distanceY) > 1000) {
      console.log('matched', d.species, set[i].species);
      radius += 5;
    } else {
      console.log('no match', d.species, set[i].species);
    }
  }
  return radius;
}

const margin = { top: 20, right: 20, bottom: 40, left: 40 };

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

const main = async () => {
  const data = await d3.csv(dataset, parseRow);

  // const x = d3.scaleLinear() //has a domain and a range. Domain is the input or dataspace, range is the output or screen space
  //           .domain([
  //             d3.min(data, xValue), // keeps track of the minimum value in the dataset corresponding to the xValue key
  //             d3.max(data, xValue) // keeps track of the maximum value in the dataset corresponding to the xValue key
  //           ])

  const x = d3.scaleLinear()
    .domain(d3.extent(data, xValue)) // extent is a shorthand for min and max as shown above
    .range([margin.left, width - margin.right]) // make sure to include the margins

  const y = d3.scaleLinear()
    .domain(d3.extent(data, yValue)) // extent is a shorthand for min and max as shown above
    .range([height - margin.bottom, margin.top]) // make sure to include the margins

  const marks = data.map(d => ({
    x: x(xValue(d)),
    y: y(yValue(d)),
    color: speciesColor(d)  
    })
  )

  svg.selectAll('circle').data(marks)
    .join('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => 5)  
    .attr('fill', d => d.color)

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y))

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
}

main();