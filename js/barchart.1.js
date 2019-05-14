

(function() {

  let data = ""; // keep data in global scope
  let svgContainer = ""; // keep SVG reference in global scope

  // load data and make scatter plot after window loads
  window.onload = function() {
    // TODO: use d3 select, append, and attr to append a 500x500 SVG to body
    svgContainer = d3.select('body').append('svg')
      .attr('width', 500)
      .attr('height', 500);

    svgContainer.append('text')
      .attr('x', 150)
      .attr('y', 20)
      .text('GRE Score vs Chance of Admit');

    // TODO: use d3.csv to load in Admission Predict data and then call the
    // makeScatterPlot function and pass it the data
    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    // https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
    d3.csv('data/Admission_Predict.csv')
      .then((data) => makeScatterPlot(data));
  }

  // make scatter plot with trend line
  function makeScatterPlot(csvData) {

    data = csvData;
    console.log(data);
    // get an array of gre scores and an array of chance of admit
    let greScores = data.map((row) => parseInt(row["GRE Score"]));
    let admissionRates = data.map((row) => parseFloat(row["Admit"]));

    // TODO: go to findMinMax and fill it out below
    let axesLimits = findMinMax(greScores, admissionRates);
    console.log(axesLimits);

    // TODO: go to drawTicks and fill it out below
    let mapFunctions = drawTicks(axesLimits);
    console.log(mapFunctions);
    // TODO: go to plotData function and fill it out
    plotData(mapFunctions);

    // plot the trend line using gre scores, admit rates, axes limits, and
    // scaling + mapping functions
    plotTrendLine(greScores, admissionRates, axesLimits, mapFunctions);

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
        .attr('x', (d) => xMap(d) - 2)
        .attr('y', yMap)
        .attr('width', 4)
        .attr('height', (d) => 450 - yMap(d))
        .attr('fill', '#4286f4');

  }


  // draw the axes and ticks
  function drawTicks(limits) {
    // return gre score from a row of data
    let xValue = function(d) { return +d["GRE Score"]; }

    // TODO: Use d3 scaleLinear, domain, and range to make a scaling function. Assign
    // the function to variable xScale. Use a range of [50, 450] and a domain of
    // [limits.greMin - 5, limits.greMax]
    // See here for more details:
    // https://www.tutorialsteacher.com/d3js/scales-in-d3
    let xScale = d3.scaleLinear()
      .domain([limits.greMin - 5, limits.greMax])
      .range([50, 450]);

    // xMap returns a scaled x value from a row of data
    let xMap = function(d) { return xScale(xValue(d)); };

    // TODO: Use d3 axisBottom and scale to make the x-axis and assign it to xAxis
    // xAxis will be a function
    // See here for more details:
    // https://www.tutorialsteacher.com/d3js/axes-in-d3
    let xAxis = d3.axisBottom()
      .scale(xScale);

    // TODO: use d3 append, attr, and call to append a "g" element to the svgContainer
    // variable and assign it a 'transform' attribute of 'translate(0, 450)' then
    // call the xAxis function
    svgContainer.append('g')
      .attr('transform', 'translate(0, 450)')
      .call(xAxis);

    svgContainer.append('text')
      .attr('x', 200)
      .attr('y', 500)
      .text('GRE Scores');

    // return Chance of Admit from a row of data
    let yValue = function(d) { return +d.Admit}

    // TODO: make a linear scale for y. Use a domain of [limits.admitMax, limits.admitMin - 0.05]
    // Use a range of [50, 450]

    let yScale = d3.scaleLinear()
      .domain([limits.admitMax, limits.admitMin - 0.05])
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
      .call(yAxis);

    svgContainer.append('text')
      .attr('transform', 'translate(15, 300)rotate(-90)')
      .text('Chance of Admit');
    // return mapping and scaling functions
    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };

  }



  // find min and max for GRE Scores and Chance of Admit
  function findMinMax(greScores, admissionRates) {

    // TODO: Use d3.min and d3.max to find the min/max of the greScores array
    let greMin = d3.min(greScores);
    let greMax = d3.max(greScores);

    // round x-axis limits
    greMax = Math.round(greMax*10)/10;
    greMin = Math.round(greMin*10)/10;

    console.log(greMin, greMax);

    // TODO: Use d3.min and d3.max to find the min/max of the  admissionRates array

    let admitMin = d3.min(admissionRates);
    let admitMax = d3.max(admissionRates);

    // round y-axis limits to nearest 0.05
    admitMax = Number((Math.ceil(admitMax*20)/20).toFixed(2));
    admitMin = Number((Math.ceil(admitMin*20)/20).toFixed(2));

    // return formatted min/max data as an object
    return {
      greMin : greMin,
      greMax : greMax,
      admitMin : admitMin,
      admitMax : admitMax
    }

  }


  // plot trend a line on SVG
  // greScores -> array of greScores
  // admitRates -> array of Chance of Admit
  // limits -> min/max data for GRE Scores and Chance of Admit
  // scale -> scaling functions for x and y

  function plotTrendLine(greScores, admitRates, limits, scale) {

    // use linear regression code from previous lab to get coefficients
    let leastSquareCoefficients = linearRegression(greScores, admitRates);
    let a = leastSquareCoefficients.a;
    let b = leastSquareCoefficients.b;

    // find and initial and end points for the trend line
    let x1 = limits.greMin;
    let y1 = a*x1 + b;
    let x2 = limits.greMax;
    let y2 = a*x2 + b;
    let trendData = [[x1,y1,x2,y2]];

    // append trend line to SVG and assign attributes
    let xScale = scale.xScale;
    let yScale = scale.yScale;
    let trendLine = svgContainer.selectAll('.trendLine')
      .data(trendData)
      .enter()
      .append('line')
        .attr('x1', function(d) { return  xScale(d[0]); })
        .attr("y1", function(d) { return yScale(d[1]); })
  			.attr("x2", function(d) { return xScale(d[2]); })
  			.attr("y2", function(d) { return yScale(d[3]); })
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
  }


  /*********************************************************
                      Regression Functions
*********************************************************/

function linearRegression(independent, dependent)
  {
      let lr = {};

      let independent_mean = arithmeticMean(independent);
      let dependent_mean = arithmeticMean(dependent);
      let products_mean = meanOfProducts(independent, dependent);
      let independent_variance = variance(independent);

      lr.a = (products_mean - (independent_mean * dependent_mean) ) / independent_variance;

      lr.b = dependent_mean - (lr.a * independent_mean);

      return lr;
  }


  function arithmeticMean(data)
  {
      let total = 0;

      // note that incrementing total is done within the for loop
      for(let i = 0, l = data.length; i < l; total += data[i], i++);

      return total / data.length;
  }


  function meanOfProducts(data1, data2)
  {
      let total = 0;

      // note that incrementing total is done within the for loop
      for(let i = 0, l = data1.length; i < l; total += (data1[i] * data2[i]), i++);

      return total / data1.length;
  }


  function variance(data)
  {
      let squares = [];

      for(let i = 0, l = data.length; i < l; i++)
      {
          squares[i] = Math.pow(data[i], 2);
      }

      let mean_of_squares = arithmeticMean(squares);
      let mean = arithmeticMean(data);
      let square_of_mean = Math.pow(mean, 2);
      let variance = mean_of_squares - square_of_mean;

      return variance;
  }

})();
