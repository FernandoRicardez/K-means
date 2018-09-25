import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props)
  {
      super(props);
      this.state = {
          dataSet: {},
          centroids:[],
          clusters:[],
          kMeans: 2,
          nDimensions: 0
      };

      //Bindings
      this.setKmeansNumber = this.setKmeansNumber.bind(this);
      this.readFile = this.readFile.bind(this);
      this.calculateInitialCentroids = this.calculateInitialCentroids.bind(this);
      this.kMeansAlgorithm = this.kMeansAlgorithm.bind(this);
      this.distance = this.distance.bind(this);

  }


//Kmeans Algorithm

//Read data file
readFile(e)
{
  //readFile
  let file = e.target.files;

  let reader = new FileReader();
  reader.readAsText(file[0]);

  reader.onload=(e)=>{
    // console.log('data', e.target.result);

    let arrPoints = {};
    let dataSetee = [];

    const lines = e.target.result.split(/[\r\n]+/g);
    for(var i = 0; i < lines.length; i++) {

      // console.log(i + ' --> ' + lines[i]);
      const pointer = lines[i].split(',');
      this.setState({nDimensions: pointer.length});
      for(var j = 0; j < pointer.length; j++){
        // console.log(i  + ':' + j +  '-->' + pointer[j]);
        // arrPoints.push(pointer[j]);
        var varname = "d"+j;

        arrPoints[varname] = parseFloat(pointer[j]);


      }

      dataSetee.push(arrPoints);
      arrPoints = {};
    }

    // console.log(dataSetee);
    this.setState({dataSet:dataSetee});
    var myJsonString = JSON.stringify(dataSetee);

    this.calculateInitialCentroids()
  }



}

setKmeansNumber(event)
{
  this.setState({kMeans: event.target.value});

}

kMeansAlgorithm()
{

    var dataSet = this.state["dataSet"];
    var nDim = this.state["nDimensions"];
    var kMeans = this.state["kMeans"];
    var centroids = this.state["centroids"];
    var clusters = [];

    // for(var i=0;i< kMeans;i++)
    // {
    //   clusters.push(tempCluster);
    // }
    var repeat = false;

      for(var i = 0; i< dataSet.length; i++)
      {

        var firstCentroid =  centroids.map(centroids => centroids[0]);
      //  console.log(dataSet[i])
        var distanceMin = this.distance(dataSet[i],firstCentroid);
        var minJ = 0;
        //console.log(firstCentroid);
        for(var j= 0; j< kMeans; j++)
        {
            var point = dataSet[i]; // == 1,2,3,4
            var centroid =  centroids.map(centroids => centroids[j]);
            var v = this.distance(dataSet[i],centroid)
            if(v<distanceMin)
            {
              distanceMin = v;
              minJ = j;
            }
        }
        // update the clusters
        clusters.push(minJ);
      }
      console.log(clusters)




}

distance(p1,p2)
{

  var nDim = this.state["nDimensions"];
  var sum = 0;
    for(var i=0; i< nDim;i++)
    {
      sum+= Math.pow((p1["d"+i]-p2[i]),2);
    }
    return Math.sqrt(sum);
}

calculateInitialCentroids()
{
  var dataSetee = this.state["dataSet"];
  var nDim = this.state["nDimensions"];
  var kMeans = this.state["kMeans"];
  let centroids =[];


  for(var i = 0; i<nDim;i++){
    var columnName = "d" + i;
    var column =  dataSetee.map(dataSetee => dataSetee[columnName]);
    var min = column[0];
    var max = column[0];


    for (let j = 0; j < column.length; j++) {
      let v = column[j];
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
      }
  //  console.log("min: "+ min+ "  max: " + max);
    var k2=1;
    var arr2 =[];
    for(var k =0; k < kMeans;k++)
    {

      var distance = max-min;
      var step = distance/(kMeans*2);

      arr2.push(min+(step*k2));
      k2+=2;
    }
    centroids.push(arr2);

  }

  this.setState({centroids:centroids});
  console.log( centroids);
  this.kMeansAlgorithm();




}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <br/>
        <p>¿Cuantas K desea utilizar?</p>
        <input type="text" className="form-control" name="kMeans" value={this.state.kMeans} onChange={this.setKmeansNumber} />
        <p>¿Qué archivo desea utilizar?</p>

        <input type="file" name="file" onChange={(e)=>this.readFile(e)} />

      </div>
    );
  }
}

export default App;
