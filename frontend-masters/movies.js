import * as d3 from 'd3';
import inflation from 'us-inflation'
import * as d3Annotation from 'd3-svg-annotation'
import textures from 'textures';

let width = window.innerWidth;
let height = window.innerHeight;

//let file = "datasets/movies.json"
let dataURL = "https://gist.githubusercontent.com/sxywu/b94eb86c807b05080d7ee470bd1e815c/raw/bc0e59845dae332100acaa73f510580ccbe317bd/110_movies.json"

let parseData = (d) => {
  return {
    title: d.Title,
    year: +d.Year,
    released: new Date(d.Released),
    runtime: +d.Runtime.split(" ")[0],
    genre: d.Genre,
    director: d.Director,
    writer: d.Writer,
    actors: d.Actors,
    language: d.Language,
    awards: d.Awards.match(/(\d+) win/) ? +d.Awards.match(/(\d+) win/)[1] : 0,
    nominations: d.Awards.match(/(\d+) nomination/) ? +d.Awards.match(/(\d+) nomination/)[1] : 0,
    metascore: +d.Metascore,
    imdbRating: +d.imdbRating * 10,
    rottenRating: +d.Ratings[1].Value.split("%")[0],
    imdbVotes: +d.imdbVotes.replace(',', ''), // weird comma stuff
    dvd: new Date(d.DVD),
    boxOffice: d.BoxOffice,
    production: d.Production,
  }
}
let data = d3.json(dataURL);
data = Object.values(await data); // convert to array
let cleanData = await data.map(parseData); // clean and parse/prepare data

// Using Vega-Lite for rapid prototyping and exploration
d3.select('body').append('div').attr('id', 'vega');

let winsMetascores = await data.map(d => {
  let wins = d.awards;
  return {
    wins: +wins,
    score: d.metascore,
    title: d.title
  }
});

let yearScoreGenre = await data.map(d => {
  return {
    date: d.released,
    score: d.metascore,
    genre: d.genre ? d.genre.split(", ")[0] : "N/A"
  }
});

let monthGenrePopularity = await cleanData.map(d => {
  return d.genre.split(", ").map(g => {
    return {
      date: d.released,
      genre: g,
      popularity: d.imdbVotes
    }
  })
}).flat();

let winsMetascorePlot = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { values: winsMetascores },
  mark: "point",
  encoding: {
    x: { type: "quantitative", field: "score" },
    y: { type: "quantitative", field: "wins" },
  }
}

let yearMetascorGenrePlot = {
  width: width - 500,
  height: height,
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { values: yearScoreGenre },
  mark: "point",
  encoding: {
    x: { type: 'temporal', field: 'date' },
    y: { type: 'quantitative', field: 'score' },
    color: { type: 'nominal', field: 'genre' }
  },
}

let monthGenrePlot = {
  width: width - width / 5,
  height: height - height / 10,
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { values: monthGenrePopularity },
  mark: "rect",
  encoding: {
    x: { type: 'ordinal', field: 'date', timeUnit: 'month' },
    y: { type: 'nominal', field: 'genre' },
    color: { type: 'quantitative', field: 'popularity', aggregate: 'median' }
  },
}

//vegaEmbed('#vega', monthGenrePlot);

// D3.js viz
const startYear = 2008;
const numYears = 10;
const genreColors = ["#e683b4", "#53c3ac", "#8475e8"];
const holidayC010rs = {
  summer: "#eb6a5b",
  winter: "#51aae8"
}
const margin = { top: 200, right: 200, bottom: 200, left: 100 };

// Filtering data to only include movies from the last 10 years and the relevant data to the plot
const filteredData = await cleanData.map(d => {
  const boxOffice = parseInt(d.boxOffice.replace(/[\$\,]/g, ''));
  const year = d.year
  return {
    title: d.title,
    date: d.released,
    year: year,
    genre: d.genre ? d.genre.split(", ")[0] : "N/A",
    boxOffice: boxOffice && inflation({ year, amount: boxOffice })
  }
}).filter(d => d.year && d.boxOffice >= startYear)

// Making our SVG canvas
let svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

// Mean box office figure, used to determine what y0 would be
const meanBoxOffice = d3.mean(filteredData, d => d.boxOffice);

// get the top genres and make an array with the top 3 genres' names
const topGenres = filteredData.reduce((acc, d) => {
  if (acc[d.genre]) {
    acc[d.genre] += 1;
  } else {
    acc[d.genre] = 1;
  }
  return acc;
}, {});

const topThreeGenres = Object.entries(topGenres).sort((a, b) => b[1] - a[1]).slice(0, 3).map(d => d[0]); //make into array of key value pairs, take the top 3, and then make into array of just the keys

// SCALES
// x-axis
const [minDate, maxDate] = d3.extent(filteredData, d => d.date);
const xScale = d3.scaleTime()
  .domain([
    d3.timeYear.floor(minDate),
    d3.timeYear.ceil(maxDate)
  ])
  .range([margin.left, width - margin.right]);

// y-axis
const boxExtent = d3.extent(filteredData, d => d.boxOffice - meanBoxOffice);
const yScale = d3.scaleLinear()
  .domain(boxExtent)
  .range([height - margin.bottom, margin.top]);

// color scale
const colorScale = d3.scaleOrdinal()
  .domain(topThreeGenres)
  .range(genreColors);

// Graphics
const area = d3.area()
  .x(d => xScale(d.date))
  .y0(d => yScale(0))
  .y1(d => yScale(d.value))
  .curve(d3.curveCatmullRom.alpha(0.5));

const curves = svg.selectAll('path.curve')
  .data(filteredData)
  .join('path')
  .classed('curve', true)
  .attr('d', d => area([
      { date: d3.timeMonth.offset(d.date, -2), value: 0},
      { date: d.date, value: d.boxOffice - meanBoxOffice },
      { date: d3.timeMonth.offset(d.date, 2), value: 0}
    ])
    )
  .attr('fill', d => colorScale(d.genre))
  .attr('stroke', 'white')
  .attr('opacity', 0.8);


// AXIS

const xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.timeFormat('%Y'))

const yAxis = d3.axisLeft(yScale)
  .tickFormat(d => '$' + parseInt((d + meanBoxOffice) / 1000000) + 'M');


svg.append('g')
    .classed('x-axis', true)
    .call(xAxis)
    .attr('transform', `translate(0, ${yScale(0)})`)

svg.append('g')
    .classed('y-axis', true)
    .call(yAxis)
    .attr('transform', `translate(${margin.left}, 0)`)
    .select('.domain')
    .remove();

const annotationData = filteredData.filter(d => (d.boxOffice - meanBoxOffice) > 200000000) 
.map(d => {
  return {
      note: {title: d.title, align: "middle", wrap: 150, orientation: "leftRight"},
      x: xScale(d.date),
      y: yScale(d.boxOffice - meanBoxOffice),
      dx: 20,
      dy: 0,
    }
  }
);
 
const makeAnnotations = d3Annotation.annotation()
  .type(d3Annotation.annotationLabel)
  .annotations(annotationData);

svg.append('g')
  .classed('annotation-group', true)
  .call(makeAnnotations);

