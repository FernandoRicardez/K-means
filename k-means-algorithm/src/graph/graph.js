export default function graph(p)
{
    let dataset = [];
    let centroids = [];
    let kMeans = 0;
    let clusters = [];
    p.setup = function () {
        p.createCanvas(500, 500);
      };
    
      p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props["dataSet"]){
          dataset = props["dataSet"];
          centroids = props["centroids"];
          kMeans = props["kMeans"];
          
        }
     
      };
    
      p.draw = function () {
        p.background(255);
        
        p.stroke(0);
        p.strokeWeight(6);
        
        for(var i =0; i<dataset.length;i++)
        {   
            p.point(parseInt(dataset[i]["d"+0]*5),parseInt(dataset[i]["d"+3]*5));
            
        }
        
        p.stroke(255,0,0);
        p.strokeWeight(5);
        
       
        for(var i=0; i< kMeans;i++)
        {
           
        var centroid =  centroids.map(centroids => centroids[i]);
          
          p.point(parseInt(centroid[0]*5),parseInt(centroid[3]*5));
           
        }
    
   
      };
    
}