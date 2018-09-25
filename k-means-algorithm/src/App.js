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
 
    this.calculateInitialCentroids(dataSetee)    
  }



}

setKmeansNumber(event)
{
  this.setState({kMeans: event.target.value});

}

updateCentroids()
{

}

calculateInitialCentroids(dataSetee)
{

  var nDim = this.state["nDimensions"];
  var kMeans = this.state["kMeans"];
  
  for(var i = 0; i<nDim;i++){
    var columnName = "d" + i;
    var column =  dataSetee.map(dataSetee => dataSetee[columnName]);    
    var min = column[0];
    var max = column[0];
    
    
    for (let j = 0, len=column.length; j < len; j++) {
      let v = column[j];
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }
    

    
  }





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
