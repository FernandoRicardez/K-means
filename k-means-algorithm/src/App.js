import React, { Component } from 'react';
import logo from './logo.svg';
import P5Wrapper from 'react-p5-wrapper';
import graph from './graph/graph';
import kMeans from './Kmeans';
import './App.css';
import Button from '@material-ui/core/Button';  
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input';
import Kmeans from './Kmeans';
import Vectors from './Vectors';


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

class App extends Component {

  constructor(props)
  {
      super(props);
      this.state = {
          Algorithm: true
      };

      //Bindings
      this.setAlgorithm = this.setAlgorithm.bind(this);
    
  }


//Kmeans Algorithm

//Read data file


setAlgorithm(event)
{
  var newState = this.state["Algorithm"];
  newState = !newState
  this.setState({Algorithm: newState});

}



  render() {  
    var state = this.state["Algorithm"]
    if(state)
      return (

          <div>
            <button onClick={this.setAlgorithm}>Cambiar</button>
            <Kmeans/>
          </div>
          
        );
        else
          return  (

            <div>
              <button onClick={this.setAlgorithm}>Cambiar</button>
              <Vectors/>
            </div>
            
          );
       

  }
}

export default App;