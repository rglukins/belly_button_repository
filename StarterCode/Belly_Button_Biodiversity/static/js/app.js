function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  let mdSampleURL = `/metadata/${sample}`;
  // console.log(mdSampleURL);
  d3.json(mdSampleURL).then(function(data) {
    // console.log(data);
    var md = data;
    // console.log(md)
    
    mdPanel = d3.select(`#sample-metadata`);

    mdPanel.html("");

    Object.entries(md).forEach(([key, value]) => {
      // console.log(key, value)
      let row = mdPanel.append('p');
      //var cell = mdPanel.append("td");
      row.text(`${key}:${value}`);
      })
    });
}
   

    // BONUS: Build the Gauge Chart
    
function buildGauge(sample) {
  let mdSampleURL = `/metadata/${sample}`;
  // console.log(mdSampleURL);
  d3.json(mdSampleURL).then(function(data) {
    //console.log(data);
    var md = data.WFREQ;
    console.log(md)

      // Enter the washing frequency between 0 and 180
  var level = parseFloat(md) * 20;
    
  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
    
      // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);
    
      var data = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: level,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(0, 105, 11, .5)",
              "rgba(10, 120, 22, .5)",
              "rgba(14, 127, 0, .5)",
              "rgba(110, 154, 22, .5)",
              "rgba(170, 202, 42, .5)",
              "rgba(202, 209, 95, .5)",
              "rgba(210, 206, 145, .5)",
              "rgba(232, 226, 202, .5)",
              "rgba(240, 230, 215, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];
    
      var layout = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
    
      var GAUGE = document.getElementById("gauge");
      Plotly.newPlot(GAUGE, data, layout);
    })}
    


     
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let target_sample = `/samples/${sample}`;
  // console.log(target_sample);
  d3.json(target_sample).then(function(data) {
    let sample_values = data.sample_values;
    let otu_ids = data.otu_ids;
    let otu_labels = data.otu_labels;
     
    //Build the Bubble Chart using the sample data
  let trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids
    }
  };

  let bubbleData = [trace1];

  var layout = {
    title: 'Sample Frequency',
    showlegend: false,
    height: 600,
    width: 1500
  };

  Plotly.newPlot('bubble', bubbleData, layout);

  // Begin sorting and slicing of data to create the pie chart.
  // Create an array of arrays that will allow sorting by value
  let pieList = [];
  for (let i = 1; i < sample_values.length; i++) {
    pieList.push([sample_values[i], otu_ids[i], otu_labels[i]])
  };

  // sort by descending value and store in variable
  // console.log(pieList);
  let pieValuesSorted = pieList.sort(function compareFunction(a, b) {
      return b[0] - a[0];
  });
  // console.log(pieValuesSorted);

  // slice the top ten most frequence samples
  let slicedPie = pieValuesSorted.slice(0,10);
  // console.log(slicedPie);

  // recreate the arrays in order to use as variables in the pie chart
  let pieSampleValues = [];
  for (let i = 0; i < slicedPie.length; i++) {
    pieSampleValues.push(slicedPie[i][0])
  };
  // console.log(pieSampleValues);

  let pieOtuIds = [];
  for (let i = 0; i < slicedPie.length; i++) {
    pieOtuIds.push(slicedPie[i][1])
  };
  // console.log(pieOtuIds);

  let pieOtuLabels = [];
  for (let i = 0; i < slicedPie.length; i++) {
    pieOtuLabels.push(slicedPie[i][2])
  };
  // console.log(pieOtuLabels);

    
  let pieData = [{ 
    values: pieSampleValues, // need to set new values by ordering the data and creating new variables
    labels: pieOtuIds,
    type: 'pie',
    hoverinfo: pieOtuLabels
  }];
    
  let pieLayout = {
    title: "10 Most Frequent Samples",
    height: 400,
    width: 500
  };
    
  Plotly.newPlot('pie', pieData, pieLayout);
  
})}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
