import * as d3 from 'd3';

export default class NewChart {
    constructor($log, $scope) {
        'ngInject';

        this.$log = $log;
        this.$scope = $scope;
        this.width = 1070;
        this.height = 550;
        this.linkDistance = 200;
    }

    $onInit = () => {
        this.$scope.$on('updateGraph', (event, dataset) => {
            this.update(dataset);
        });
        this.$scope.$on('clearGraph', (event) => {
            this.clearGraph();
        });
    };

    clearGraph() {
        d3.select("body").select("svg").html("");
    }

    update(dataset) {
        this.clearGraph();
        const colors = d3.scale.category10();

        let svg = d3.select("body").select("svg").attr({"width": this.width, "height": this.height});

        let force = d3.layout.force()
            .nodes(dataset.nodes)
            .links(dataset.edges)
            .size([this.width, this.height])
            .linkDistance([this.linkDistance])
            .charge([-500])
            .theta(0.5)
            .gravity(0.05)
            .start();


        let edges = svg.selectAll("line")
            .data(dataset.edges)
            .enter()
            .append("line")
            .attr("id", function (d, i) {
                return 'edge' + i
            })
            .attr('marker-end', 'url(#arrowhead)')
            .style("stroke", "#aaa")
            .style("pointer-events", "none");

        let nodes = svg.selectAll("circle")
            .data(dataset.nodes)
            .enter()
            .append("circle")
            .attr({"r": 15})
            .style("fill", function (d, i) {
                return colors(i);
            })
            .call(force.drag)


        let nodelabels = svg.selectAll(".nodelabel")
            .data(dataset.nodes)
            .enter()
            .append("text")
            .attr({
                "dx": function (d) {
                    return 10;
                },
                "dy": function (d) {
                    return -10;
                },
                "class": "nodelabel",
                "stroke": "black"
            })
            .text(function (d) {
                return d.name;
            });

        let edgepaths = svg.selectAll(".edgepath")
            .data(dataset.edges)
            .enter()
            .append('path')
            .attr({
                'd': function (d) {
                    return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
                },
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'fill': 'blue',
                'stroke': 'red',
                'id': function (d, i) {
                    return 'edgepath' + i
                }
            })
            .style("pointer-events", "none");

        let edgelabels = svg.selectAll(".edgelabel")
            .data(dataset.edges)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr({
                'class': 'edgelabel',
                'id': function (d, i) {
                    return 'edgelabel' + i
                },
                'dx': 80,
                'dy': 20,
                'font-size': 20,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {
                return '#edgepath' + i
            })
            .style("pointer-events", "none")
            .text(function (d, i) {
                return '' + d.count
            });


        svg.append('defs').append('marker')
            .attr({
                'id': 'arrowhead',
                'viewBox': '-0 -5 10 10',
                'refX': 25,
                'refY': 0,
                //'markerUnits':'strokeWidth',
                'orient': 'auto',
                'markerWidth': 10,
                'markerHeight': 10,
                'xoverflow': 'visible'
            })
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#ccc')
            .attr('stroke', '#ccc');


        force.on("tick", function () {

            edges.attr({
                "x1": function (d) {
                    return d.source.x;
                },
                "y1": function (d) {
                    return d.source.y;
                },
                "x2": function (d) {
                    return d.target.x;
                },
                "y2": function (d) {
                    return d.target.y;
                }
            });

            nodes.attr({
                "cx": function (d) {
                    return d.x;
                },
                "cy": function (d) {
                    return d.y;
                }
            });

            nodelabels.attr("x", function (d) {
                return d.x;
            })
                .attr("y", function (d) {
                    return d.y;
                });

            edgepaths.attr('d', function (d) {
                var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
                //console.log(d)
                return path
            });

            edgelabels.attr('transform', function (d, i) {
                if (d.target.x < d.source.x) {
                    let bbox = this.getBBox();
                    let rx = bbox.x + bbox.width / 2;
                    let ry = bbox.y + bbox.height / 2;
                    return 'rotate(180 ' + rx + ' ' + ry + ')';
                } else {
                    return 'rotate(0)';
                }
            });
        });
    }

}
