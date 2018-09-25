export default function graph(p)
{
    let rotation = 0;
    let dataset = [];

    p.setup = function () {
        p.createCanvas(600, 400);
      };
    
      p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props["dataSet"]){
          dataset = props["dataSet"];
          console.log("si")
        }
        console.log(dataset)
      };
    
      p.draw = function () {
        p.background(0);
        p.stroke(255);
        p.strokeWeight(6);
        p.point(50,50)
    
        for(var i =0; i<dataset.length;i++)
        {
            p.point(parseInt(dataset[i]["d"+0]*70),parseInt(dataset[i]["d"+1]*70));
            
        }
    
   
      };
    
}