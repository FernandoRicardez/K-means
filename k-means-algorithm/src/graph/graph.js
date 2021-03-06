export default function graph(p)
{
    let dataset = [];
    let centroids = [];
    let kMeans = 0;
    let clusters = [];
    let minmax = [];
   
    
    let currDim1 = 0;
    let currDim2 = 1;
    let factor1 = 0;
    let factor2 = 0;


    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
      if (props["dataSet"]){
        dataset = props["dataSet"];
        centroids = props["centroids"];
        kMeans = props["kMeans"];
        minmax = props["minmax"];
        clusters = props["clusters"]
        currDim1 = props["dimUno"];
        currDim2 = props["dimDos"];

        factor1 = 500/Math.abs(minmax[currDim1][1]-minmax[currDim1][0]);
        factor2 = 500/Math.abs(minmax[currDim2][1]-minmax[currDim2][0]);
        p.loop();
        
      }
   
    };
  
    p.setup = function () {
        p.createCanvas(500, 500);
        p.frameRate(1);
      };
    


      p.draw = function () {
        p.background(255);
        p.push();
        p.stroke(0);
        p.strokeWeight(5);
        var colors = [];
         
          for(var i=0;i<kMeans;i++)
          {
              var color = [];
              for(var j=0;j<3;j++)
              {
                color[j]=  Math.floor(Math.random() * 256);
              }
              colors.push(color);
          }
        
         
          
        for(var i =0; i<dataset.length;i++)
        {   
            p.stroke(colors[clusters[i]][0],colors[clusters[i]][1],colors[clusters[i]][2]);
            
            p.point(parseInt((dataset[i]["d"+currDim1]-minmax[currDim1][0])*factor1),parseInt((dataset[i]["d"+currDim2]-minmax[currDim2][0])*factor2));
            
        }
        
        p.stroke(255,0,0);
        p.strokeWeight(15);
        
       
        for(var i=0; i< kMeans;i++)
        {
           
          var centroid =   centroids[i];
          
        p.stroke(255,0,0);
          p.point(parseInt((centroid[currDim1]-minmax[currDim1][0])*factor1),parseInt((centroid[currDim2]-minmax[currDim2][0])*factor2));
          
        p.stroke(255,255,255);
          p.fill(20);
          // p.textSize(10);
          // p.text("x:"+minmax[currDim1][0], 10, 10);;
          // p.text("x:" +minmax[currDim1][1], 10, 490);;
          // p.text("y2:"+minmax[currDim2][0], 490, 10);;
          // p.text("y1:"+minmax[currDim2][1], 10, 490);;
          //p.noLoop();
        };
        p.push();
      };
    
}