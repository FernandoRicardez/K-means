import React, { Component } from 'react';
import logo from './logo.svg';
import P5Wrapper from 'react-p5-wrapper';
import graph from './graph/graph2';
import './App.css';
import Button from '@material-ui/core/Button';  
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


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

class nVectors extends Component {

  constructor(props)
  {
      super(props);
      this.state = {
          dataSet: {},
          vectors:[],
          clusters:[],
          nVectors: 10,
          nTimes:50,
          nDimensions: 0,
          graph:false,
          minmax: [],
          clusterCount:[]
      };

      //Bindings
      this.setVectorsNumber = this.setVectorsNumber.bind(this);
      this.readFile = this.readFile.bind(this);
      this.calculateInitialvectors = this.calculateInitialvectors.bind(this);
      this.VectorsAlgorithm = this.VectorsAlgorithm.bind(this);
      this.pointProduct = this.pointProduct.bind(this);
      this.sumVector = this.sumVector.bind(this);
      this.categorize = this.categorize.bind(this);
      this.graph = this.graph.bind(this);
      this.setTimesNumber = this.setTimesNumber.bind(this);
  }


//nVectors Algorithm

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

    this.calculateInitialvectors()
  }

}

setVectorsNumber(event)
{
  this.setState({nVectors: event.target.value});

}
setTimesNumber(event)
{
  this.setState({nTimes: event.target.value});

}

VectorsAlgorithm()
{

    var dataSet = this.state["dataSet"];
    var nDim = this.state["nDimensions"];
    var nVectors = this.state["nVectors"];
    var vectors = this.state["vectors"];
    var nTimes = this.state["nTimes"];
    var clusters = [];

    for(var nVeces=0;nVeces<nTimes;nVeces++)
    {

        var firstVector =  vectors[0];
        var currPoint = dataSet[Math.floor(Math.random() * dataSet.length)];
        var pointProductMax = this.pointProduct(currPoint,firstVector);
        var maxJ = 0;
        //console.log(firstCentroid);
        for(var j= 0; j< nVectors; j++)
        {
            var currVector = vectors[j]
            var v = this.pointProduct(currPoint,currVector)
            if(v>pointProductMax)
            {
              pointProductMax = v;
              maxJ = j;
            }
        }
        // update the clusters
        vectors[maxJ]=this.sumVector(vectors[maxJ],currPoint);


      this.setState({vectors:vectors});
    } 
    console.log("vectors");
    console.log(vectors);
    this.categorize();


}

sumVector(v1,v2)    
{
   
    var nDim = this.state["nDimensions"];
    
    for(var i =0;i<nDim;i++)
    {
        v1["d"+i]=v1["d"+i]+v2["d"+i];
    }

    return v1;
}

categorize()
{

      var dataSet = this.state["dataSet"];
      var nDim = this.state["nDimensions"];
      var nVectors = this.state["nVectors"];
      var vectors = this.state["vectors"];

      var clusters = [];
    var clusterCount = [];
      for(var i=0; i<nVectors;i++)
      {
        clusterCount[i]=0;
      }
      // for(var i=0; i<dataSet.length;i++)
      // {
      //  //Calcular max W
      //  var firstVector =  vectors[0];
      //  //  console.log(dataSet[i])
      //    var pointProductMax = this.pointProduct(dataSet[i],firstVector);
      //    var maxJ = 0;
      //    //console.log(firstCentroid);
      //    for(var j= 0; j< nVectors; j++)
      //    {
      //        var point = dataSet[i]; // == 1,2,3,4
      //        var currVector = vectors[j]
      //        var v = this.pointProduct(dataSet[i],currVector)
      //        if(v>pointProductMax)
      //        {
      //          pointProductMax = v;
      //          maxJ = j;
      //        }
             
            
      //    }
      //    clusterCount[maxJ]++;
      //    clusters[i] = maxJ;
      // }

      for(var i = 0; i< dataSet.length; i++)
      {

        var firstVector =  vectors[0];

        var distanceMin = this.distance(dataSet[i],firstVector);
        var minJ = 0;
        for(var j= 0; j< nVectors; j++)
        {
            var point = dataSet[i]; // == 1,2,3,4
            var currVector =  vectors[j];
            var v = this.distance(dataSet[i],currVector)
            if(v<distanceMin)
            {
              distanceMin = v;
              minJ = j;
            }
        }
        // update the clusters
        clusters[i] = minJ;
        clusterCount[minJ]++;


      }
      
      console.log(clusters);
      this.setState({clusters:clusters});
  
      this.setState({clusterCount:clusterCount});
  
      this.graph();
      

}

distance(v1,v2)
{
  
  var nDim = this.state["nDimensions"];
  var sum = 0;
    for(var i=0; i< nDim;i++)
    {
      sum+= Math.pow((v1["d"+i]-v2["d"+i]),2);
    }
    return Math.sqrt(sum);

}

graph()
{
  this.setState({graph:true});
}

pointProduct(v1,v2)
{

  var nDim = this.state["nDimensions"];
  var sum = 0;
    for(var i=0; i< nDim;i++)
    {
      sum+=(v1["d"+i]*v2["d"+i]);
    }
    return sum;
}


calculateInitialvectors()
{
  var dataSetee = this.state["dataSet"];
  var nDim = this.state["nDimensions"];
  var nVectors = this.state["nVectors"];
  let vectors =[];
  var minmax = [];

  //this is for the graph
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
  }
  this.setState({minmax:minmax});
  //Ends graph

  for(var i=0; i<nVectors;i++)
  {
    vectors.push(dataSetee[ Math.floor(Math.random() * dataSetee.length)]);
  }


  
  this.setState({vectors:vectors});
 
  this.VectorsAlgorithm();
}



  render() {
    var dataSet = this.state["dataSet"];
    if(this.state["graph"])
      return (
        <div className="App">
            <div className="row">
              <div className="col-sm-3">
              <p>¿Cuantos vectores desea utilizar?</p>
                <TextField
                id="nVectors"
                label="nVectors Number"
                name="nVectors" 
                value={this.state.nVectors} 
                onChange={this.setVectorsNumber}
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
                {this.state["clusterCount"].map(function(x,i=1){return <p>cluster {++i}: {x}</p>})}
       
              </div>
            
              <div className="col-sm-9 orange">    
                <br/>
                <P5Wrapper sketch={graph} clusters={this.state["clusters"]} dataSet={this.state["dataSet"]} centroids={this.state["vectors"]} minmax={this.state["minmax"]}  kMeans={this.state["nVectors"]} />
              </div>
          </div>
        </div>
      );
      else
        return (
          <div className="App">
          <div className="row">
              <div className="col-sm-3">
          <Grid container spacing={24}>
          <Grid item xs ={6}>
          <div className="col-sm-9 orange" >Seleccione un archivo para continuar
              </div>
          </Grid>
          <Grid item xs={6}>

          <Paper elevation={3}>
          <p>¿Cuantos vectores desea utilizar?</p>
              <TextField
                id="nVectors"
                name="nVectors" 
                value={this.state.nVectors} 
                onChange={this.setVectorsNumber}
              />
          </Paper>
          <p>¿Cuantas veces se realizará el entrenaimento?</p>
                <TextField
                id="nVectors"
                label="nVectors Number"
                name="nVectors" 
                value={this.state.nTimes} 
                onChange={this.TimesNumber}
                />
         
          <Paper elevation={3}>
          <p>¿Qué archivo desea utilizar?</p>
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
          </Paper>
          </Grid>
          
          
          
          
          </Grid>
            <br/>
            
              
              

              
              
              </div>
              
            </div>
            
          </div>
          
        );
       

  }
}

export default nVectors;