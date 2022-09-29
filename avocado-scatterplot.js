import * as d3 from 'd3';

let dataset = './datasets/avocado.csv';

let width = window.innerWidth;
let height = window.innerHeight;

const parseRow = (d) => {
    return {
        date: new Date(d.Date),
        averagePrice: +d.AveragePrice,
        totalVolume: +d.TotalVolume,
        type: d.type,
        year: +d.Year,
        region: d.region
    };
}

const xValue = d => d.date;
const yValue = d => d.averagePrice;
const typeColor = d => {
    if (d.type === "conventional") {
        return "red ";
    } else if (d.type === "organic") {  
        return "green";
    }
}

const margin = { top: 20, right: 20, bottom: 40, left: 40 };

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

d3.csv(dataset, parseRow).then(data => {
    console.log(data);
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([height - margin.bottom, margin.top]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);
    svg.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('r', 2)
        .attr('fill', d => typeColor(d));
});