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
          kMeans: 0
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

  this.calculateInitialCentroids();
}

setKmeansNumber(event)
{
  this.setState({kMeans: event.target.value});

}

calculateCentroids()
{

}

calculateInitialCentroids()
{
}





  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>¿Cuantas K desea utilizar?</p>
        <input type="number" class="form-control" name="kMeans" value={this.state.kMeans} onChange={this.setKmeansNumber} />
        <p>¿Qué archivo desea utilizar?</p>

        <select>

        </select>

      </div>
    );
  }
}

export default App;
