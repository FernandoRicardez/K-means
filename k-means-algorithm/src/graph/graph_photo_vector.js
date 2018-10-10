export default function graph(p) {
    let dataset = [];
    let centroids = [];
    let kMeans = 0;
    let clusters = [];
    let minmax = [];
    let width = 100;


    let currDim1 = 0;
    let currDim2 = 1;
    let factor1 = 0;
    let factor2 = 0;


    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props["dataSet"]) {
            dataset = props["dataSet"];
            centroids = props["centroids"];
            kMeans = props["kMeans"];
            minmax = props["minmax"];
            clusters = props["clusters"]
            currDim1 = props["dimUno"];
            currDim2 = props["dimDos"];

            width = props["width"];

            // factor1 = 500/Math.abs(minmax[currDim1][1]-minmax[currDim1][0]);
            // factor2 = 500/Math.abs(minmax[currDim2][1]-minmax[currDim2][0]);
            p.loop();

        }

    };

    p.setup = function () {
        p.createCanvas(500, 500);
        p.frameRate(1);
    };



    p.draw = function () {
        p.background(255);

        p.stroke(0);
        p.strokeWeight(1);

        for (var i = 0; i < dataset.length; i++) {
            p.stroke(centroids["d" + clusters[i]][0], centroids["d" + clusters[i]][1], centroids["d" + clusters[i]][2]);

            p.point(i % width, i / width);

        }

        p.stroke(255, 0, 0);
        p.strokeWeight(15);


        for (var i = 0; i < kMeans; i++) {
            // p.stroke(255,0,0);
            //   p.point(parseInt((centroid[currDim1]-minmax[currDim1][0])*factor1),parseInt((centroid[currDim2]-minmax[currDim2][0])*factor2));

            // p.stroke(255,255,255);
            //   p.fill(20);
            // p.textSize(10);
            // p.text("x:"+minmax[currDim1][0], 10, 10);;
            // p.text("x:" +minmax[currDim1][1], 10, 490);;
            // p.text("y2:"+minmax[currDim2][0], 490, 10);;
            // p.text("y1:"+minmax[currDim2][1], 10, 490);;
            p.noLoop();

        };

    };

}