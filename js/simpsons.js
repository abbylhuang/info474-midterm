(function() {

  let data = ""; // keep data in global scope
  let svgContainer = ""; // keep SVG reference in global scope
  let div = "";
  let avg = 0;

  // load data and make scatter plot after window loads
  window.onload = function() {
    // TODO: use d3 select, append, and attr to append a 500x500 SVG to body
    svgContainer = d3.select('body').append('svg')
      .attr("class", "graph-svg-component")
      .attr('width', 1000)
      .attr('height', 510);

    // TODO: use d3.csv to load in Admission Predict data and then call the
    // makeScatterPlot function and pass it the data
    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    // https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
    d3.csv('./data/Seasons_(SimpsonsData).csv')
      .then((data) => makeScatterPlot(data));
      //console.log(data)
  }

  // make scatter plot with trend line
  function makeScatterPlot(csvData) {
    data = csvData;

    // get an array of gre scores and an array of chance of admit
    let years = data.map((row) => parseInt(row["Year"]));
    let AvgViewers = data.map((row) => parseFloat(row["Avg. Viewers (mil)"]));

    let AvgViewersSum = 0;
    AvgViewers.map((d) => (AvgViewersSum += d)); 
    //console.log(AvgViewersSum)
    avg = (AvgViewersSum / AvgViewers.length);
    avg = Math.round(avg*10)/10;
    console.log(avg)

    // TODO: go to findMinMax and fill it out below
    let axesLimits = findMinMax(years, AvgViewers);
    //console.log(axesLimits);

    // TODO: go to drawTicks and fill it out below
    let mapFunctions = drawTicks(axesLimits);
    //console.log(mapFunctions);

    // TODO: go to plotData function and fill it out  + add legend
    plotData(mapFunctions);
    Legend();

  }
  //create legend for actual versus estimated
  function Legend() {
    svgContainer.append("rect")
        .attr("x", 800)
        .attr("y", 35)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "#58B8EF");

    svgContainer.append("rect")
        .attr("x", 800)
        .attr("y", 60)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "grey");
  
    svgContainer.append("text")
        .text("Actual")
        .attr("x", 830)
        .attr("y", 42)
        .attr("dy",".60em")
        .style("text-anchor","left")

    svgContainer.append("text")
        .text("Expected")
        .attr("x", 830)
        .attr("y", 68)
        .attr("dy",".60em")
        .style("text-anchor","left")
  }

  // plot all the data points on the SVG
  function plotData(map) {
    let xMap = map.x;
    let yMap = map.y;

    // append data to SVG and plot as points
    // Use the selectAll, data, enter, append, and attr functions to plot all
    // the data points. selectAll should be passed a parameter '.dot'
    // data should be passed the global data variable as a parameter
    // The points should have attributes:
    // 'cx' -> xMap
    // 'cy' -> yMap
    // 'r' -> 3
    // 'fill' -> #4286f4
    // See here for more details:
    // https://www.tutorialsteacher.com/d3js/data-binding-in-d3js
    svgContainer.selectAll('.dot')
      .data(data)
      .enter()
      .append('rect')
        .attr('x', (d) => xMap(d) - 11)
        //add text for the count on top
        .attr('y', yMap)
        .attr('width', 25) 
        .attr('height', (d) => 450 - yMap(d))
        //.attr('fill', '#58B8EF')
        .attr('fill', function(d) {
            if (d.Data == "Actual") {
               return "#58B8EF"; 
            }
            return "grey"
        })
        // add tooltip functionality to points
        //do the circles move over here
        .on("mouseover", (d) => {
            div.transition()
              .duration(200)
              .style("opacity", .9);
  
            div.html("Season #" + d.Year + 
              "<br/>" + "Year: " + d.Year + 
              "<br/>" + "Episodes: " + d.Episodes +
              "<br/>" + "Avg Viewers (mil): " + d['Avg. Viewers (mil)'] +
              "<br/>" + "Most Watched Episode: " + d['Most watched episode'] +
              "<br/>" + "Viewers (mil): " + d["Viewers (mil)"])
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 30) + "px");
          })
  
          .on("mouseout", (d) => {
            div.transition()
              .duration(500)
              .style("opacity", 0);
      });

      

    // make tooltip
    div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    //add average horizontal trenline
    svgContainer.append('line')
    .attr("x1", 50)
    .attr("y1", map.yScale(avg))
    .attr("x2", 900)
    .attr("y2", map.yScale(avg))
    .attr("stroke-width", 2)
    .style("stroke-dasharray", ("3,3"))
    .attr("stroke", "#c1c0c0");

    //add the trendline # of avg number box
    svgContainer.append("rect")
    .attr("x", 905)
    .attr("y", 285)
    .attr("width", 35)
    .attr("height", 25)
    .style("fill", "#c1c0c0")
    .style("opacity", 0.3);

    svgContainer.append("text")
    .text(avg)
    .attr("x", 922)
    .attr("y", 293)
    .attr("dy",".70em")
    .style('font-weight', 'bold')
    .style("text-anchor","middle")

  }

  // draw the axes and ticks
  function drawTicks(limits) {
    // return gre score from a row of data
    let xValue = function(d) { return +d["Year"]; }

    // TODO: Use d3 scaleLinear, domain, and range to make a scaling function. Assign
    // the function to variable xScale. Use a range of [50, 450] and a domain of
    // [limits.greMin - 5, limits.greMax]
    // See here for more details:
    // https://www.tutorialsteacher.com/d3js/scales-in-d3
    let xScale = d3.scaleLinear()
      .domain([limits.yearMin - 1, limits.yearMax])
      .range([50, 900]);

    // xMap returns a scaled x value from a row of data
    let xMap = function(d) { return xScale(xValue(d)); };

    // TODO: Use d3 axisBottom and scale to make the x-axis and assign it to xAxis
    // xAxis will be a function
    // See here for more details:
    // https://www.tutorialsteacher.com/d3js/axes-in-d3
    let xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(20)
      .tickFormat(d3.format("d"));

    // TODO: use d3 append, attr, and call to append a "g" element to the svgContainer
    // variable and assign it a 'transform' attribute of 'translate(0, 450)' then
    // call the xAxis function
    svgContainer.append('g')
      .attr('transform', 'translate(0, 450)')
      .style('font-weight', 'bold')
      .call(xAxis);

    svgContainer.append('text')
      .attr('x', 450)
      .attr('y', 500)
      .text('Years')
      .style('font-weight', 'bold');
      //.attr('transform', 'rotate(90)');

    // return Chance of Admit from a row of data
    let yValue = function(d) { return +d["Avg. Viewers (mil)"]}

    // TODO: make a linear scale for y. Use a domain of [limits.admitMax, limits.admitMin - 0.05]
    // Use a range of [50, 450]
    let yScale = d3.scaleLinear()
      .domain([limits.avgVMax, limits.avgVMin - 0.05])
      .range([50, 450]);

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) { return yScale(yValue(d)); };

    // TODO: use axisLeft and scale to make the y-axis and assign it to yAxis
    let yAxis = d3.axisLeft().scale(yScale);

    // TODO: append a g element to the svgContainer
    // assign it a transform attribute of 'translate(50, 0)'
    // lastly, call the yAxis function on it
    svgContainer.append('g')
      .attr('transform', 'translate(50, 0)')
      .style('font-weight', 'bold')
      .call(yAxis);

    svgContainer.append('text')
      .attr('transform', 'translate(15, 350)rotate(-90)')
      .style('font-weight', 'bold')
      .text('Avg. Viewers (in millions)');
    
    //add numbers to bars
    svgContainer.selectAll(".text")        
      .data(data)
      .enter()
      .append("text")
          .attr("class","label")
          .attr("x", (function(d) { return xMap(d); }  ))
          .attr("y", function(d) { return yMap(d) - 3; })
          .style('text-anchor', "middle")
          .style('font-weight', 'bold')
          .text(function(d) { return d["Avg. Viewers (mil)"]; });

    // return mapping and scaling functions
    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };
  }

  // find min and max for years and avgViewers
  function findMinMax(years, AvgViewers) {

    // TODO: Use d3.min and d3.max to find the min/max of the years array
    let yearMin = d3.min(years);
    let yearMax = d3.max(years);

    // round x-axis limits
    yearMax = Math.round(yearMax*10)/10;
    yearMin = Math.round(yearMin*10)/10;

    console.log(yearMin, yearMax);

    // TODO: Use d3.min and d3.max to find the min/max of the viewers array

    let avgVMin = d3.min(AvgViewers);
    let avgVMax = d3.max(AvgViewers);

    // round y-axis limits to nearest 0.05
    avgVMax = Number((Math.ceil(avgVMax*20)/20).toFixed(2));
    avgVMin = Number((Math.ceil(avgVMin*20)/20).toFixed(2));

    // return formatted min/max data as an object
    return {
      yearMin : yearMin,
      yearMax : yearMax,
      avgVMin : avgVMin,
      avgVMax : avgVMax
    }
  }

})();
