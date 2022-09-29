import * as d3 from 'd3';

let dataset = './datasets/values.json';

let width = window.innerWidth;
let height = window.innerHeight;  

let margin = { top: 20, right: 20, bottom: 40, left: 40 };

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

let data = [];

let makeData = async () => {

d3.json(dataset).then(d => {
  // loop through the array with the data
  d.forEach(d => {
    let datapoint = {
      value: d,
      occurrence: 1
    }
    // check if the a datapoint with the same value already exists within the data array
    let index = data.findIndex(e => e.value === datapoint.value);
    // if it does, increase the occurrence of that datapoint by 1
    if (index !== -1) {
      data[index].occurrence++;
    } else {
      // if it doesn't, add the datapoint to the data array
      data.push(datapoint);
    }
  });

  // sort the data array by the value of the datapoints
  data.sort((a, b) => a.value - b.value);

  console.log(data);
})
}

// making a histogram with d3
const histogram = async () => {
  let x = d3.scaleLinear()
      .domain([d3.extent(data, d => d.value)])
      .range([0, width - margin.left - margin.right]);
  
  let y = d3.scaleLinear()
      .domain([0, d3.extent(data, d => d.occurrence)])
      .range([height - margin.top - margin.bottom, 0]);
  
  let xAxis = d3.axisBottom(x);
  let yAxis = d3.axisLeft(y);

  await makeData();
  let bins = d3.bin()
      .value(d => d.value)
      .domain(x.domain())
      .thresholds(x.ticks(data.length));

  console.log(bins(data));

  svg.selectAll("rect")
  .data(bins(data))
  .join("rect") 
    .attr("x", 1)
    
}


histogram() 


