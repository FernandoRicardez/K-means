import React, { Component } from 'react';
import logo from './logo.svg';
import P5Wrapper from 'react-p5-wrapper';
import graph from './graph/graph';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class Kmeans extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSet: {},
      centroids: [],
      clusters: [],
      kMeans: 2,
      nDimensions: 0,
      graph: false,
      minmax: [],
      clusterCount: [],
      dimOptions: [],
      dimUno: 0,
      dimDos: 1,
      iterationNumber: 0
    };

    //Bindings
    this.setKmeansNumber = this.setKmeansNumber.bind(this);
    this.readFile = this.readFile.bind(this);
    this.calculateInitialCentroids = this.calculateInitialCentroids.bind(this);
    this.kMeansAlgorithm = this.kMeansAlgorithm.bind(this);
    this.distance = this.distance.bind(this);
    this.distance2 = this.distance2.bind(this);
    this.updateCentroids = this.updateCentroids.bind(this);
    this.graph = this.graph.bind(this);
    this.setDim1 = this.setDim1.bind(this);
    this.setDim2 = this.setDim2.bind(this);

  }


  //Kmeans Algorithm

  //Read data file
  readFile(e) {
    //readFile
    let file = e.target.files;

    let reader = new FileReader();
    reader.readAsText(file[0]);

    reader.onload = (e) => {
      // console.log('data', e.target.result);

      let arrPoints = {};
      let dataSetee = [];

      const lines = e.target.result.split(/[\r\n]+/g);
      for (var i = 0; i < lines.length; i++) {

        // console.log(i + ' --> ' + lines[i]);
        const pointer = lines[i].split(',');
        this.setState({ nDimensions: pointer.length });
        for (var j = 0; j < pointer.length; j++) {
          // console.log(i  + ':' + j +  '-->' + pointer[j]);
          // arrPoints.push(pointer[j]);
          var varname = "d" + j;

          arrPoints[varname] = parseFloat(pointer[j]);


        }

        dataSetee.push(arrPoints);
        arrPoints = {};
      }

      // console.log(dataSetee);
      this.setState({ dataSet: dataSetee });
      var myJsonString = JSON.stringify(dataSetee);

      this.calculateInitialCentroids()
    }



  }

  setKmeansNumber(event) {
    this.setState({ graph: false });
    this.setState({ kMeans: event.target.value });
    //this.calculateInitialCentroids();
  }

  kMeansAlgorithm() {

    var dataSet = this.state["dataSet"];
    var nDim = this.state["nDimensions"];
    var kMeans = this.state["kMeans"];
    var centroids = this.state["centroids"];
    var clusters = [];

    var iterationNumber = this.state["iterationNumber"];

    iterationNumber++;

    this.setState({ iterationNumber: iterationNumber })
    // for(var i=0;i< kMeans;i++)
    // {
    //   clusters.push(tempCluster);
    // // }
    // var repeat = false;

    for (var i = 0; i < dataSet.length; i++) {

      var firstCentroid = centroids[0];
      //  console.log(dataSet[i])
      var distanceMin = this.distance(dataSet[i], firstCentroid);
      var minJ = 0;
      //console.log(firstCentroid);
      for (var j = 0; j < kMeans; j++) {
        var point = dataSet[i]; // == 1,2,3,4
        var centroid = centroids[j];
        var v = this.distance(dataSet[i], centroid)
        if (v < distanceMin) {
          distanceMin = v;
          minJ = j;
        }
      }
      // update the clusters
      clusters.push(minJ);


    }
    this.setState({ clusters: clusters });
    this.updateCentroids();




  }

  updateCentroids() {

    var dataSet = this.state["dataSet"];
    var nDim = this.state["nDimensions"];
    var kMeans = this.state["kMeans"];
    var centroids = this.state["centroids"];
    var clusters = this.state["clusters"];
    var dimSum = [];
    var clusterCount = []


    for (var i = 0; i < kMeans; i++) {

      clusterCount[i] = 0;
      dimSum[i] = [];
      for (var j = 0; j < nDim; j++) {
        dimSum[i][j] = 0;

      }

    }

    for (var i = 0; i < dataSet.length; i++) {
      var cluster = clusters[i];
      clusterCount[cluster]++;
      for (var j = 0; j < nDim; j++) {
        dimSum[cluster][j] += dataSet[i]["d" + j];
      }
    }
    for (var i = 0; i < kMeans; i++) {
      for (var j = 0; j < nDim; j++) {
        dimSum[i][j] /= clusterCount[i];
      }
    }
    //console.log(dimSum);
    var seguir = false;
    for (var i = 0; i < kMeans; i++) {
      var oldCentroid = centroids[i];
      var newCentroid = dimSum[i];
      if (this.distance2(oldCentroid, newCentroid) > 0.01) {
        seguir = true;
      }
    }
    if (seguir) {
      this.setState({ clusterCount: clusterCount });
      this.setState({ centroids: dimSum });
      // console.log( "centroids");
      // console.log( dimSum);
      this.kMeansAlgorithm();
    }
    else {


      this.graph();
    }


  }

  setDim1(event) {
    this.setState({ dimUno: event.target.value });
  }

  setDim2(event) {
    this.setState({ dimDos: event.target.value });
  }

  graph() {
    this.setState({ graph: true });
  }

  distance(p1, p2) {

    var nDim = this.state["nDimensions"];
    var sum = 0;
    for (var i = 0; i < nDim; i++) {
      sum += Math.pow((p1["d" + i] - p2[i]), 2);
    }
    return Math.sqrt(sum);
  }

  distance2(p1, p2) {

    var nDim = this.state["nDimensions"];
    var sum = 0;
    for (var i = 0; i < nDim; i++) {
      sum += Math.pow((p1[i] - p2[i]), 2);
    }
    return Math.sqrt(sum);
  }
  calculateInitialCentroids() {
    var dataSetee = this.state["dataSet"];
    var nDim = this.state["nDimensions"];
    var kMeans = this.state["kMeans"];
    let centroids = [];
    var minmax = [];
    var option = []

    for (var i = 0; i < nDim; i++) {
      var columnName = "d" + i;
      var column = dataSetee.map(dataSetee => dataSetee[columnName]);
      var min = column[0];
      var max = column[0];
      minmax[i] = [];
      option.push(i);


      for (let j = 0; j < column.length; j++) {
        let v = column[j];
        min = (v < min) ? v : min;
        max = (v > max) ? v : max;
      }
      minmax[i][0] = min;
      minmax[i][1] = max;
      //  console.log("min: "+ min+ "  max: " + max);

    }
    this.setState({ minmax: minmax });

    for (var k = 0; k < kMeans; k++) {

      var arr2 = [];
      var potentialCentroid = dataSetee[Math.floor(Math.random() * dataSetee.length)];
      for (var l = 0; l < nDim; l++) {
        arr2.push(potentialCentroid["d" + l]);
      }

      centroids.push(arr2);
    }
    console.log(centroids);;

    this.setState({ centroids: centroids });


    this.setState({ dimOptions: option });

    this.kMeansAlgorithm();
  }



  render() {
    var dataSet = this.state["dataSet"];
    if (this.state["graph"])
      return (
        <div className="App">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <div className="col-sm-3">
                <p>¿Cuantas K desea utilizar?</p>
                <TextField
                  id="kMeans"
                  label="kMeans Number"
                  name="kMeans"
                  value={this.state.kMeans}
                  onChange={this.setKmeansNumber}
                />
                <h3>Número de iteraciones: {0/3}</h3>
                {/* <p>¿Qué archivo desea utilizar?</p>

                  <input
                    id="file"
                    type="file"
                    onChange={(e)=>this.readFile(e)}
                  />
                  <label htmlFor="raised-button-file">
                    <Button variant="raised" component="span" >
                    Upload
                    </Button>
                  </label>  */}
                {this.state["clusterCount"].map(function (x, i = 1) { return <p>cluster {++i}: {x}</p> })}

              </div>

              <h3>Seleccione las dimensiones:</h3>

              <Select
                value={this.state.dimUno}
                onChange={this.setDim1}
                inputProps={{
                  name: 'age',
                  id: 'age-simple',
                }}
              >
                {this.state["dimOptions"].map(function (x) { return <MenuItem value={x}>{x}</MenuItem> })}
              </Select>

              <Select
                value={this.state.dimDos}
                onChange={this.setDim2}
                inputProps={{
                  name: 'age',
                  id: 'age-simple',
                }}
              >
                {this.state["dimOptions"].map(function (x) { return <MenuItem value={x}>{x}</MenuItem> })}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <div className="col-sm-9 orange">
                <br />
                <P5Wrapper sketch={graph} dimUno={this.state["dimUno"]} dimDos={this.state["dimDos"]} clusters={this.state["clusters"]} dataSet={this.state["dataSet"]} centroids={this.state["centroids"]} minmax={this.state["minmax"]} kMeans={this.state["kMeans"]} />
              </div>
            </Grid>
          </Grid>
        </div>
      );
    else
      return (
        <div className="App">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <div className="col-sm-3">
                <Paper elevation={3}>
                  <p>¿Cuantas K desea utilizar?</p>
                  <TextField
                    id="kMeans"
                    name="kMeans"
                    value={this.state.kMeans}
                    onChange={this.setKmeansNumber}
                  />
                </Paper>

                <Paper elevation={3}>
                  <p>¿Qué archivo desea utilizar?</p>


                  <Input
                    onChange={(e) => this.readFile(e)}
                    id="file"
                    type="file"
                  />
                  <label htmlFor="file">
                    <Button variant="raised" component="span" >
                      Upload
                </Button>
                  </label>
                </Paper>
              </div>



            </Grid>
            <Grid item xs={6}>
              <div className="col-sm-9 orange" >Seleccione un archivo para continuar
              </div>
            </Grid>
          </Grid>
          <br />
          <div className="row">


          </div>
        </div>

      );


  }
}

export default Kmeans;