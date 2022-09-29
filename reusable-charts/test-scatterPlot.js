import * as d3 from 'd3';
import { scatterPlot } from './scatterPlot';
import { menu } from './menu';

let dataset = '../datasets/iris.csv';

let width = window.innerWidth;
let height = window.innerHeight;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };

// Convert data from strings to numbers with the + operator
const parseRow = (d) => {
  d.sepal_length = +d.sepal_length,
    d.sepal_width = +d.sepal_width,
    d.petal_length = +d.petal_length,
    d.petal_width = +d.petal_width,
    d.species = d.species
  return d;
}

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const menuContainer = d3.select('body')
  .append('div')
  .attr('class', 'menu-container');

const xMenu = menuContainer.append('div');
const yMenu = menuContainer.append('div');

const main = async () => {
  const data = await d3.csv(dataset, parseRow);
  const plot = scatterPlot()
    .width(width)
    .height(height)
    .data(data)
    .xValue(d => d.petal_length)
    .yValue(d => d.sepal_length)
    .margin(margin)
    .symbol(d => d.species)
    .radius(5)
    .color(d => {
      if (d.species === "setosa") {
        return "red";
      } else if (d.species === "versicolor") {
        return "green";
      } else if (d.species === "virginica") {
        return "blue";
      }
    });

  const options = [
    { value: 'petal_length', text: 'Petal Length', type: "quantitative" },
    { value: 'sepal_length', text: 'Sepal Length', type: "quantitative" },
    { value: 'petal_width', text: 'Petal Width', type: "quantitative" },
    { value: 'sepal_width', text: 'Sepal Width', type: "quantitative" },
    { value: 'species', text: 'Species', type: "categorical" }
  ];

  const getType = (value, data) => {
    return data.find(d => d.value === value).type;
  }


  svg.call(plot);
  xMenu.call(menu().id('x-axis').label('X Axis').options(options).on('change', (value) => {
    svg.call(plot.xValue(d => d[value]).xType(getType(value, options)));
  }));
  yMenu.call(menu().id('y-axis').label('Y Axis').options(options).on('change', (value) => {
    svg.call(plot.yValue(d => d[value]).yType(getType(value, options)));
  }));

}

main();