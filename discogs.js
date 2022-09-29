import * as d3 from 'd3';

let file = "datasets/discogs_20081014_releases.xml"

d3.xml(file).then(function(data) {
    console.log(data);
});