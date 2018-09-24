import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props)
  {
      super(props);
      this.state = {
          dataSet: [],
          centroids:[],
          clusters:[],
          kMeans: '0',
          fileName:''
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

    let arrPoints = [];
    let dataSetee = [];

    const lines = e.target.result.split(/[\r\n]+/g);
    for(var i = 0; i < lines.length; i++) {

      // console.log(i + ' --> ' + lines[i]);
      const pointer = lines[i].split(',');

      for(var j = 0; j < pointer.length; j++){
        // console.log(i  + ':' + j +  '-->' + pointer[j]);
        arrPoints.push(pointer[j]);
      }

      dataSetee.push(arrPoints);
      arrPoints = [];
    }

    // console.log(dataSetee);

    var myJsonString = JSON.stringify(dataSetee);
    console.log(myJsonString);
  }


  this.calculateInitialCentroids();
}

setKmeansNumber(event)
{
  this.setState({kMeans: event.target.value});

}

updateCentroids()
{

}

calculateInitialCentroids()
{

/*
for (let i = 1, len=arr.length; i < len; i++) {
  let v = arr[i].y;
  min = (v < min) ? v : min;
  max = (v > max) ? v : max;
}

return [min, max];
*/

}





  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>¿Cuantas K desea utilizar?</p>
        <input type="text" className="form-control" name="kMeans" value={this.state.kMeans} onChange={this.setKmeansNumber} />
        <p>¿Qué archivo desea utilizar?</p>

        <input type="file" name="file" onChange={(e)=>this.readFile(e)} />

      </div>
    );
  }
}

export default App;
