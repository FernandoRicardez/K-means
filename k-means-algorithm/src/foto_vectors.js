import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import graph from './graph/graph_photo_vector';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


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

class nVectors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSet: {},
            vectors: [],
            clusters: [],
            nVectors: 10,
            nTimes: 50,
            nDimensions: 0,
            graph: false,
            minmax: [],
            clusterCount: [],
            dimUno: 0,
            dimDos: 1,
            dimOptions: []
        };

        //Bindings
        this.setVectorsNumber = this.setVectorsNumber.bind(this);
        this.readFile = this.readFile.bind(this);
        this.calculateInitialvectors = this.calculateInitialvectors.bind(this);
        this.VectorsAlgorithm = this.VectorsAlgorithm.bind(this);
        this.pointProduct = this.pointProduct.bind(this);
        this.sumAndNormalizeVectors = this.sumAndNormalizeVectors.bind(this);
        this.categorize = this.categorize.bind(this);
        this.graph = this.graph.bind(this);
        this.setTimesNumber = this.setTimesNumber.bind(this);
        this.setDim1 = this.setDim1.bind(this);
        this.setDim2 = this.setDim2.bind(this);
        this.getMeans = this.getMeans.bind(this);
    }


    //nVectors Algorithm

    readFile = (e) => {
        const ctx = this.canvas.getContext('2d');
        const img = new Image();

        let arrPoints = {};
        let dataSetee = [];
        this.setState({ nDimensions: 3 });


        img.onload = () => {
            const width = img.width;
            const height = img.height;

            this.setState({ width, height });
            ctx.width = width;
            ctx.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            URL.revokeObjectURL(img.src);

            /* Read pixel data */
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            // => [r,g,b,a,...]

            const pixels = [];
            for (let i = 0; i < data.length; i += 4) {

                arrPoints["d0"] = data[i];
                arrPoints["d1"] = data[i + 1];
                arrPoints["d2"] = data[i + 2];

                dataSetee.push(arrPoints);
                arrPoints = {};

            }

            //console.log(`pixels (${img.width}x${img.height})`, dataSetee);
            this.setState({ dataSet: dataSetee });

            this.calculateInitialvectors();
        };
        img.src = URL.createObjectURL(e.target.files[0]);

    };

    setVectorsNumber(event) {
        this.setState({ graph: false });
        this.setState({ nVectors: event.target.value });

    }
    setTimesNumber(event) {
        this.setState({ graph: false });
        this.setState({ nTimes: event.target.value });

    }

    VectorsAlgorithm() {

        var dataSet = this.state["dataSet"];
        var nVectors = this.state["nVectors"];
        var vectors = this.state["vectors"];
        var nTimes = this.state["nTimes"];

        for (var nVeces = 0; nVeces < nTimes; nVeces++) {

            var firstVector = vectors[0];
            var currPoint = dataSet[Math.floor(Math.random() * dataSet.length)];
            var pointProductMax = this.pointProduct(currPoint, firstVector);
            var maxJ = 0;
            //console.log(firstCentroid);
            for (var j = 0; j < nVectors; j++) {
                var currVector = vectors[j]
                var v = this.pointProduct(currPoint, currVector)
                if (v > pointProductMax) {
                    pointProductMax = v;
                    maxJ = j;
                }
            }
            // update the clusters
            vectors[maxJ] = this.sumAndNormalizeVectors(vectors[maxJ], currPoint);



            this.setState({ vectors: vectors });
        }
        console.log("vectors");
        console.log(vectors);
        this.categorize();


    }

    sumAndNormalizeVectors(v1, v2) {

        var nDim = this.state["nDimensions"];

        for (var i2 = 0; i2 < nDim; i2++) {
            v1["d" + i2] = v1["d" + i2] + v2["d" + i2];
        }

        var sum = 0;
        for (var i = 0; i < nDim; i++) {
            sum += Math.pow((v1["d" + i]), 2);
        }
        sum = Math.sqrt(sum);
        for (var i3 = 0; i3 < nDim; i3++) {
            v1["d" + i3] = (v1["d" + i3] / sum);
        }
        return (v1);
    }

    categorize() {

        var dataSet = this.state["dataSet"];
        var nVectors = this.state["nVectors"];
        var vectors = this.state["vectors"];

        var clusters = [];
        var clusterCount = [];
        for (var i0 = 0; i0 < nVectors; i0++) {
            clusterCount[i0] = 0;
        }
        for (var i = 0; i < dataSet.length; i++) {
            //Calcular max W
            var firstVector = vectors[0];
            //  console.log(dataSet[i])
            var pointProductMax = this.pointProduct(dataSet[i], firstVector);
            var maxJ = 0;
            //console.log(firstCentroid);
            for (var j = 0; j < nVectors; j++) {
                var currVector = vectors[j]
                var v = this.pointProduct(dataSet[i], currVector)
                if (v > pointProductMax) {
                    pointProductMax = v;
                    maxJ = j;
                }


            }
            clusterCount[maxJ]++;
            clusters[i] = maxJ;
        }

        // for (var i = 0; i < dataSet.length; i++) {

        //   var firstVector = vectors[0];

        //   var distanceMin = this.distance(dataSet[i], firstVector);
        //   var minJ = 0;
        //   for (var j = 0; j < nVectors; j++) {
        //     var point = dataSet[i]; // == 1,2,3,4
        //     var currVector = vectors[j];
        //     var v = this.distance(dataSet[i], currVector)
        //     if (v < distanceMin) {
        //       distanceMin = v;
        //       minJ = j;
        //     }
        //   }
        //   // update the clusters
        //   clusters[i] = minJ;
        //   clusterCount[minJ]++;


        // }

        this.setState({ clusters: clusters });

        this.setState({ clusterCount: clusterCount });
        
        this.getMeans();


    }

    getMeans()
    {
        var dataSet = this.state["dataSet"];
        var nVectors = this.state["nVectors"];
        var vectors = this.state["vectors"];
        var clusters = this.state["clusters"];
        var dimSum = [];
        var clusterCount = []
        for (var i = 0; i < nVectors; i++) {

            clusterCount[i] = 0;
            dimSum["d"+i] = [];
            for (var j = 0; j < 3; j++) {
              dimSum["d"+i][j] = 0;
      
            }
      
          }
      
          for (var i = 0; i < dataSet.length; i++) {
            var cluster = clusters[i];
            clusterCount[cluster]++;
            for (var j = 0; j < 3; j++) {
              dimSum["d"+cluster][j] += dataSet[i]["d" + j];
            }
          }
          for (var i = 0; i < nVectors; i++) {
            for (var j = 0; j < 3; j++) {
              dimSum["d"+i][j] /= clusterCount[i];
            }
          }
          
        this.setState({vectors:dimSum});
        this.graph();

    }

    distance(v1, v2) {

        var nDim = this.state["nDimensions"];
        var sum = 0;
        for (var i = 0; i < nDim; i++) {
            sum += Math.pow((v1["d" + i] - v2["d" + i]), 2);
        }
        return Math.sqrt(sum);

    }

    graph() {
        
       this.setState({ graph: true });
    }

    pointProduct(v1, v2) {

        var nDim = this.state["nDimensions"];
        var sum = 0;
        for (var i = 0; i < nDim; i++) {
            sum += (v1["d" + i] * v2["d" + i]);
        }
        return sum;
    }


    calculateInitialvectors() {
        var dataSetee = this.state["dataSet"];
        var nDim = this.state["nDimensions"];
        var nVectors = this.state["nVectors"];
        let vectors = [];
        var minmax = [];
        var option = []

        //this is for the graph
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
        }
        this.setState({ minmax: minmax });
        //Ends graph

        for (var i = 0; i < nVectors; i++) {
            vectors.push(dataSetee[Math.floor(Math.random() * dataSetee.length)]);
        }



        this.setState({ vectors: vectors });
        this.setState({ dimOptions: option });

        this.VectorsAlgorithm();
    }

    setDim1(event) {
        this.setState({ dimUno: event.target.value });
    }

    setDim2(event) {
        this.setState({ dimDos: event.target.value });
    }




    render() {

        if (this.state["graph"])
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
                            {this.state["clusterCount"].map(function (x, i = 1) { return <p>cluster {++i}: {x}</p> })}

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

                        </div>

                        <div className="col-sm-9 orange">
                            <br />
                            <P5Wrapper sketch={graph} width={this.state["width"]} dimUno={this.state["dimUno"]} dimDos={this.state["dimDos"]} clusters={this.state["clusters"]} dataSet={this.state["dataSet"]} centroids={this.state["vectors"]} minmax={this.state["minmax"]} kMeans={this.state["nVectors"]} />
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
                                <Grid item xs={6}>
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
                                    <Paper elevation={3}>
                                        <p>¿Cuantas veces se realizará el entrenaimento?</p>
                                        <TextField
                                            id="nVectors"
                                            label="Número de veces"
                                            name="nVectors"
                                            value={this.state.nTimes}
                                            onChange={this.setTimesNumber}
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
                                    <canvas
                                        ref={el => this.canvas = el} width={this.state["width"]} height={this.state["height"]} />
                                </Grid>




                            </Grid>
                            <br />






                        </div>

                    </div>

                </div>

            );


    }
}

export default nVectors;