import * as d3 from 'd3';

let dataset = '../datasets/iris.csv';

const width = window.innerWidth;
const height = window.innerHeight;

const parseRow = (d) => {
  d.sepal_length = +d.sepal_length,
    d.sepal_width = +d.sepal_width,
    d.petal_length = +d.petal_length,
    d.petal_width = +d.petal_width;
  return d;
}

const margin = { top: 20, right: 20, bottom: 40, left: 40 };

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);

const parent = [
  { species: "setosa", color: "red", children: [] },
  { species: "versicolor", color: "green", children: [] },
  { species: "virginica", color: "blue", children: [] },
];

let color = d3.scaleOrdinal()
  .range(d3.schemeCategory10);

let radius = Math.min(width, height) / 2 - 50;

// parse the data set and create a object for each species
const readData = async () => d3.csv(dataset, (d) => {
  if (d.species === "setosa") {
    parent[0].children.push(parseRow(d));
  } else if (d.species === "versicolor") {
    parent[1].children.push(parseRow(d));
  } else if (d.species === "virginica") {
    parent[2].children.push(parseRow(d));
  }
}).then(() => {
  return parent;
  });



let nodeData = { children: await readData() };

let partition = d3.partition().size([2 * Math.PI, radius]);

let root = d3.hierarchy(nodeData).sum(d => d.sepal_width);

partition(root);

let arc = d3.arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => d.y0)
  .outerRadius(d => d.y1);

console.log(root.descendants());

svg.selectAll('path')
  .data(root.descendants())
  .join('path')
  .attr('display', d => d.depth ? null : 'none')
  .attr('d', arc)
  .attr('fill', d => color((d.children ? d : d.parent).data.species))
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
