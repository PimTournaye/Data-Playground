import * as d3 from 'd3';

export const scatterPlot = () => {
  let width;
  let height;
  let margin;

  let data;

  let xValue;
  let yValue;
  let xType;
  let yType;

  let radius;
  let color;
  let symbol;

  const my = (selection) => {
    const x = (xType === 'categorical'
      ? d3.scalePoint().domain(data.map(xValue)).padding(0.5)
      : d3.scaleLinear().domain(d3.extent(data, xValue)) // extent is a shorthand for min and max as shown above
      ).range([margin.left, width - margin.right]);
    const y = (yType === "categorical"
      ? d3.scalePoint()
        .domain(data.map(yValue)).padding(0.5)
      : d3.scaleLinear()
        .domain(d3.extent(data, yValue)) // extent is a shorthand for min and max as shown above
    ).range([height - margin.bottom, margin.top]);
    const symbolScale = d3.scaleOrdinal()
      .domain(data.map(symbol))
      .range(d3.symbolsFill)

    const symbolGenerator = d3.symbol()

    const marks = data.map(d => ({
      x: x(xValue(d)),
      y: y(yValue(d)),
      color: color(d),
      pathD: symbolGenerator.type(symbolScale(symbol(d)))()
    }));

    const t = d3.transition()
      .duration(1000);

    const positionElements = (selection) => {
      selection.attr('transform', d => `translate(${d.x}, ${d.y})`)
    }
    const initializeScale = (selection) => {
      selection.attr('opacity', 0)
    }

    const updateScale = (enter) => {
      enter.transition(t)
        .attr('opacity', 0.4)
    }
    // Code to draw the marks without transitions
    // selection.selectAll('path').data(marks)
    //   .join('path')
    //   .attr('d', d => d.pathD)
    //   .attr('transform', d => `translate(${d.x}, ${d.y})`)
    //   .attr('fill', d => d.color)

    selection.selectAll('path').data(marks)
      .join(
        (enter) => enter
          .append('path')
          .attr('d', d => d.pathD)
          .attr('fill', d => d.color)
          .call(initializeScale)
          .call(positionElements)
          .call(updateScale),
        (update) => update.transition(t).delay((d, i) => i * 8)
          .call(positionElements),
        (exit) => exit.remove()
      )
      .transition(t)
      .attr('d', d => d.pathD)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .attr('fill', d => d.color)

    // AXIS STUFF
    selection.selectAll('.y-axis')
      .data([null]) // D3.join expects a data array, so we pass in a single null value so it only makes one <g> element
      .join('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))

    selection.selectAll('.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))

  };

  my.width = function (value) { // using normal function syntax to have access to function.arguments
    return arguments.length ? (width = +value, my) : width;
  }

  my.height = function (value) {
    return arguments.length ? (height = +value, my) : height;
  }

  my.margin = function (value) {
    return arguments.length ? (margin = value, my) : margin;
  }

  my.data = function (value) {
    return arguments.length ? (data = value, my) : data;
  }

  my.xValue = function (value) {
    return arguments.length ? (xValue = value, my) : xValue;
  }

  my.yValue = function (value) {
    return arguments.length ? (yValue = value, my) : yValue;
  }

  my.xType = function (value) {
    return arguments.length ? (xType = value, my) : xType;
  }

  my.yType = function (value) {
    return arguments.length ? (yType = value, my) : yType;
  }

  my.radius = function (value) {
    return arguments.length ? (radius = +value, my) : radius;
  }

  my.color = function (value) {
    return arguments.length ? (color = value, my) : color;
  }

  my.symbol = function (value) {
    return arguments.length ? (symbol = value, my) : symbol;
  }

  return my;
}