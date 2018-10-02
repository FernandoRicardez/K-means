import React, { Component } from 'react';
import logo from './logo.svg';
import P5Wrapper from 'react-p5-wrapper';
import graph from './graph/graph';
import './App.css';
import Button from '@material-ui/core/Button';  
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input';


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

  constructor(props)
  {
      super(props);
      this.state = {
          dataSet: {},
          centroids:[],
          clusters:[],
          kMeans: 2,
          nDimensions: 0,
          graph:false,
          minmax: []
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
    // // }
    // var repeat = false;

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
      this.setState({clusters:clusters});
        this.updateCentroids();




}

updateCentroids()
{

      var dataSet = this.state["dataSet"];
      var nDim = this.state["nDimensions"];
      var kMeans = this.state["kMeans"];
      var centroids = this.state["centroids"];
      var clusters = this.state["clusters"];
      var dimSum = [];
      var clusterCount = []

        for(var i=0; i<nDim; i++)
        {
          dimSum[i] = [];
          for(var j=0; j<kMeans; j++) 
          {
            dimSum[i][j] = 0;
          }
            clusterCount[i]=0;
        }

      for(var i=0; i<dataSet.length;i++)
      {
          var cluster = clusters[i];
          clusterCount[cluster]++;
          for(var j=0; j<nDim;j++)
          {
            dimSum[j][cluster]+= dataSet[i]["d"+j];
          }
      }
      for(var i=0; i<kMeans;i++)
      {
        for(var j=0;j<nDim;j++)
        {
          dimSum[j][i]/= clusterCount[i];
        }
      }
      //console.log(dimSum);
      var seguir = false;
      for (var i = 0; i < kMeans; i++) {
          var oldCentroid =  centroids.map(centroids => centroids[i]);
          var  newCentroid = dimSum.map(dimSum => dimSum[i]);
          if(this.distance2(oldCentroid,newCentroid) > 0.01)
          {
            seguir = true;
          }
      }
      if(seguir)
      {
          this.setState({centroids:dimSum   });
          // console.log( "centroids");
          // console.log( dimSum);
          this.kMeansAlgorithm();
      }
      else {

        
          this.graph();
      }


}

graph()
{
  this.setState({graph:true});
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

distance2(p1,p2)
{

  var nDim = this.state["nDimensions"];
  var sum = 0;
    for(var i=0; i< nDim;i++)
    {
      sum+= Math.pow((p1[i]-p2[i]),2);
    }
    return Math.sqrt(sum);
}
calculateInitialCentroids()
{
  var dataSetee = this.state["dataSet"];
  var nDim = this.state["nDimensions"];
  var kMeans = this.state["kMeans"];
  let centroids =[];
  var minmax = [];

  for(var i = 0; i<nDim;i++){
    var columnName = "d" + i;
    var column =  dataSetee.map(dataSetee => dataSetee[columnName]);
    var min = column[0];
    var max = column[0];
    minmax[i] = [];


    for (let j = 0; j < column.length; j++) {
      let v = column[j];
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
      }
      minmax[i][0] = min;
      minmax[i][1] = max;
  //  console.log("min: "+ min+ "  max: " + max);
    var arr2 =[];
    var potentialCentroid = dataSetee[ Math.floor(Math.random() * dataSetee.length)];
    for(var k =0; k < kMeans;k++)
    {

      arr2.push(potentialCentroid["d"+k]);
    
    }
    centroids.push(arr2);

  }
  this.setState({minmax:minmax});

  
  this.setState({centroids:centroids});
 
  this.kMeansAlgorithm();
}



  render() {
    var dataSet = this.state["dataSet"];
    if(this.state["graph"])
      return (
        <div className="App">
            <div className="row">
              <div className="col-sm-3">
                <p>¿Cuantas K desea utilizar?</p>
                <TextField
                id="kMeans"
                label="kMeans Number"
                name="kMeans" 
                value={this.state.kMeans} 
                onChange={this.setKmeansNumber}
                />
                <p>¿Qué archivo desea utilizar?</p>

                 {/* <input
                  id="file"
                  type="file"
                  onChange={(e)=>this.readFile(e)}
                /> */}
                <label htmlFor="raised-button-file">
                  <Button variant="raised" component="span" >
                  Upload
                  </Button>
                </label> 
              </div>
            
              <div className="col-sm-9 orange">    
                <br/>
                <P5Wrapper sketch={graph} clusters={this.state["clusters"]} dataSet={this.state["dataSet"]} centroids={this.state["centroids"]} minmax={this.state["minmax"]}  kMeans={this.state["kMeans"]} />
              </div>
          </div>
        </div>
      );
      else
        return (
          <div className="App">
            <br/>
            <div className="row">
              <div className="col-sm-3">
              <p>¿Cuantas K desea utilizar?</p>
              <TextField
                id="kMeans"
                name="kMeans" 
                value={this.state.kMeans} 
                onChange={this.setKmeansNumber}
              />
              <p>¿Qué archivo desea utilizar?</p>

              </div>
                <Input
                  onChange={(e)=>this.readFile(e)} 
                  id="file"
                  type="file"
                />
              <label htmlFor="file">
                <Button variant="raised" component="span" >
                  Upload
                </Button>
              </label> 
              <div className="col-sm-9 orange" >Seleccione un archivo para continuar
              </div>
            </div>
            <Button variant="contained" color="primary">
            Hello World
            </Button>
          </div>
          
        );
       

  }
}

export default Kmeans;