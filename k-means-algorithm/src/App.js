import React, { Component } from 'react';
import './App.css';
// import Snackbar from '@material-ui/core/Snackbar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Kmeans from './Kmeans';
import Vectors from './Vectors';
import Photo from './Photo';
import Typography from '@material-ui/core/Typography';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

// const styles = theme => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: 200,
//   },
//   dense: {
//     marginTop: 19,
//   },
//   menu: {
//     width: 200,
//   },
// });

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Algorithm: true
    };

    //Bindings
    this.setAlgorithm = this.setAlgorithm.bind(this);

  }


  //Kmeans Algorithm

  //Read data file


  setAlgorithm(event) {
    var newState = this.state["Algorithm"];
    newState = !newState
    this.setState({ Algorithm: newState });

  }

  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    // var state = this.state["Algorithm"]
    const { value } = this.state;
    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} centered>
            <Tab value="one" label="kMeans" />
            <Tab value="two" label="Vectores" />
            <Tab value="three" label="Foto" />
            
          </Tabs>
        </AppBar>
        {value === 'one' && <TabContainer>
          <h1>Kmeans</h1>
          <Kmeans />
        </TabContainer>}
        {value === 'two' && <TabContainer>
          <h1>Vectors</h1>
          <Vectors />
        </TabContainer>} 
         {value === 'three' && <TabContainer>
          <h1>Foto</h1>
          <Photo />
        </TabContainer>}

      </div>
    );
  }
}

export default App; 