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
readFile(event)
{
  //readFile
  this.setState({fileName: event.target.value});


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


for (let i = 1, len=arr.length; i < len; i++) {
  let v = arr[i].y;
  min = (v < min) ? v : min;
  max = (v > max) ? v : max;
}

return [min, max];

}





  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>¿Cuantas K desea utilizar?</p>
        <input type="text" class="form-control" name="kMeans" value={this.state.kMeans} onChange={this.setKmeansNumber} />
        <p>¿Qué archivo desea utilizar?</p>

        <select value={this.state.fileName} onChange={this.readFile}>
          <option value="data.txt">Iris</option>
          <option value="data2.txt">Ejemplo 2</option>
        </select>

      </div>
    );
  }
}

export default App;
