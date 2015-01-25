# D3 TopoJSON Template

A project template that uses [D3](http://d3js.org) and [TopoJSON](https://github.com/mbostock/topojson) to generate a [choropleth map](http://en.wikipedia.org/wiki/Choropleth_map) of the USA. The [template](http://jonchretien.github.io/d3-topojson-template/) also has top level filters, tooltips for each state, and a slider to navigate the date range.

## Notes

- The map uses the [Albers USA projection](https://github.com/mbostock/d3/wiki/Geo-Projections#wiki-albersUsa).
- There's currently no date formatting, but you could either handle it natively or by using a library like [Moment.js](http://momentjs.com/).
- Keyboard controls for the slider are bound to the left and right arrow keys.
- Tested in the latest versions of Chrome, Safari, and Firefox.

## Data Structure

``` js
[
    {
        "name": "Alabama",
        "dates": {
            "2013-09-01": {
                "buzzes": 0,
                "doodads": 4,
                "fizzes": 1,
                "gizmos": 1,
                "widgets": 1
            },
        }
        "id": 0
    },
    ...
]
```

## Run site locally

1.  Clone the repo.

    `git clone https://github.com/jonchretien/d3-topojson-template.git && cd d3-topojson-template`

2.  Install the NPM dependencies.

    `npm install`

3. Run watch tasks and start up a HTTP server.

    `npm run dev`

## Build the project.

    `npm run build`

## License

D3 Boilerplate TopoJSON is released under the [MIT License](http://mit-license.org).