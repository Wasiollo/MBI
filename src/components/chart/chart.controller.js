import * as d3 from 'd3';

export default class ChartController {
    constructor($log, $scope) {
        'ngInject';

        this.$log = $log;
        this.$scope = $scope;
        this.width = 1070;
        this.height = 550;
    }

    $onInit = () => {
        // this.$log.info('Activated Chart View.');
        this.links = [];

        this.userReadings = [];
        this.nodes = {};

        this.links.forEach(function (link) {
            this.updateNodesIfNeeded(link);
        });

        const width = this.width,
            height = this.height;

        this.stepByStepCount = 0;
        this.stepByStepArray = [];

        this.force = d3.layout.force()
            .nodes(d3.values(this.nodes))
            .links(this.links)
            .size([width, height])
            .linkDistance(50)
            .charge(-2000);

        let svg = d3.select("body").select("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("g");
        svg.append("defs");
        this.update();

        this.$scope.$on('addLink', (event, linkData) => {
            this.addLink(linkData.source, linkData.target);
        });

        this.$scope.$on('clearGraph', event => this.clearGraph());
    };



    update() {
        var svg = d3.select("body").select("svg");
        var g = svg.select("g");
        var defs = svg.select("defs");
        var marker = defs.selectAll("marker")
            .data(["end"]);

        marker.enter().insert("marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        marker.exit().remove();

        var path = g.selectAll("path")
            .data(this.force.links());

        path.enter().insert("path")
            .attr("class", function (d) {
                return "link count" + d.count;
            })
            .attr("marker-end", "url(#end)");

        path.exit().remove();

        var circle = svg.selectAll("circle")
            .data(this.force.nodes());


        var circleEntered = circle.enter().insert("circle")
            .attr("r", 6)
            .call(this.force.drag);

        circle.exit().remove();

        var nodeTexts = svg.selectAll("text")
            .data(this.force.nodes());

        nodeTexts.enter()
            .insert("text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
            });

        nodeTexts.exit().remove();

        this.force.on("tick", function () {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            nodeTexts.attr("transform", transform);
        });

        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }

        function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy) - Math.sqrt(300 * (d.count - 1));
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        };
        this.force.start();
    }

    updateUserReadingsList() {
        let options = d3.selectAll(".userReadingsList").selectAll("option")
            .data(this.userReadings);

        options
            .enter()
            .insert("option")
            .attr("value", function (d) {
                return d.name;
            })
            .text(function (d) {
                return d.name;
            });

        options
            .exit()
            .remove();
    }

    clearAll() {
        this.clearUserReadingsList();
        this.clearGraph();
        // this.disableButtonsStepByStep();
        // document.getElementById("userReadingInput").value="";
        // document.getElementById("graphUserDimensionInput").value="";
        // document.getElementById("userSequenceInput").value="";
        // document.getElementById("readingsLengthInput").value="";
        // document.getElementById("graphSequenceDimensionInput").value="";
        // var elements = document.getElementsByClassName("resultSeqLabel");
        //
        // for (var i = 0; i < elements.length; i++) {
        //     elements[i].innerHTML = "";
        // }

    }

    clearUserReadingsList() {
        this.userReadings = [];
        this.updateUserReadingsList();
    }

    clearGraph() {
        let links = [];
        let nodes = {};
        this.links = links;
        this.nodes = nodes;
        this.force.nodes(d3.values(nodes)).links(links);
        this.update();
    }

    addLink(sourceNode, targetNode) {
        let countNode = 1;
        this.links.forEach(function (link) {
            if (link.source.name === sourceNode && link.target.name === targetNode) {
                ++countNode;
            }
        });
        let link = {"source": sourceNode, "target": targetNode, "count": countNode};
        this.links.push(link);

        this.updateNodesIfNeeded(link);
        this.force.nodes(d3.values(this.nodes)).links(this.links);
        this.update();
        // console.log(this.nodes);
        // console.log(this.links);
    }

    updateNodesIfNeeded(link) {
        link.source = this.nodes[link.source] || (this.nodes[link.source] = {name: link.source});
        link.target = this.nodes[link.target] || (this.nodes[link.target] = {name: link.target});
    }

}
