import * as d3 from 'd3';

export const menu = () => {
  let id;
  let label;
  let options;
  let listeners = d3.dispatch('change');

  const my = (selection) => {
    selection.selectAll("label")
      .data([null])
      .join("label")
      .attr("for", id)
      .text(label)

    selection.selectAll("select")
      .data([null])
      .join("select")
      .attr("id", id)
      .attr("name", id)
      .on("change", event => {
        listeners.call("change", null, event.target.value);
      })
      .selectAll('option')
      .data(options)
      .join("option")
      .attr("value", d => d.value)
      .text(d => d.text)

  };

  my.id = function (value) {
    return arguments.length ? (id = value, my) : id;
  }

  my.label = function (value) { // using normal function syntax to have access to function.arguments
    return arguments.length ? (label = value, my) : label;
  }

  my.options = function (value) {
    return arguments.length ? (options = value, my) : options;
  }

  my.on = function () {
    let value = listeners.on.apply(listeners, arguments);
    return value === listeners ? my : value;
  }


  return my;
}