import Ember from 'ember';
import d3 from 'npm:d3';
import TextDrawing from 'khartis/models/drawing/text';
import LineDrawing from 'khartis/models/drawing/line';
import d3lper from '../../../utils/d3lper';
import markerMaker from '../../../utils/marker-maker';

export const START_DRAWING_EVENT = "startDrawing";

const LineGenerator = d3.line().curve(d3.curveBasis);

export default Ember.Mixin.create({

    drawingClickedPoints: null,

    drawingSelectedFeature: null,

    drawingInit(defs) {

        this.d3l().select("#outerMap")
            .append("g")
            .classed("zoomable", true)
            .classed("drawing", true)
            .classed("positioning-geo", true);

        let gAbs = this.d3l().select("#outerMap")
            .append("g")
            .classed("drawing", true)
            .classed("positioning-absolute", true);

        let drawMarkerG = gAbs.append("g")
            .classed("draw-marker", true)
            .style("visibility", "hidden");

        drawMarkerG.append("circle");
        drawMarkerG.append("line");

        this.d3l().on("click.drawingselect", this.drawingMapClick.bind(this));

        if (this.get("_eventNotifier")) {
            this.bindDrawingEvents(this.get("_eventNotifier"));
        }

        this.drawingDraw();
    },

    //override
    projectAndDraw: function() {
        this._super();
        this.drawingDraw();
    },

    drawingMapClick() {
        if (d3.event.defaultPrevented) return;
        let ori = [d3.event.clientX, d3.event.clientY],
            crossPoints = [
                ori,
                [ori[0]-1, ori[1]],
                [ori[0]+1, ori[1]],
                [ori[0], ori[1]-1],
                [ori[0], ori[1]+1],
            ];
        let els = crossPoints
            .reduce( (flat, pt) => {
                return flat.concat(this.d3l().selectUnderPoint(".graphic path, .graphic text", pt).nodes());
            }, []);

        if (els.length) {
            this.selectFeature(d3.select(els[0]).datum());
        } else {
            this.unselectFeature();
        }
    },

    drawingDrawMarker() {
        let [x, y] = d3.mouse(this.d3l().select(".map").node());
        let drawCursorG = this.d3l().select("#outerMap g.positioning-absolute g.draw-marker");
        drawCursorG.style("visibility", "visible");
        drawCursorG.select("circle").attrs({
            r: 4,
            cx: x,
            cy: y
        });
        if (this.get('drawingClickedPoints').length > 0) {
            drawCursorG.select("line").attrs({
                x1: this.get('drawingClickedPoints').objectAt(0)[0],
                y1: this.get('drawingClickedPoints').objectAt(0)[1],
                x2: x,
                y2: y
            });
        }
    },

    hideDrawingMarker() {
        let marker = this.d3l().select("#outerMap g.positioning-absolute g.draw-marker")
            .style("visibility", "hidden");
        marker.select("line").attrs({
            x1: 0, y1: 0, x2: 0, y2: 0
        });
        marker.select("circle").attrs({
            cx: 0, cy: 0
        });
    },

    drawingDrawFeatureBox: function() {
        this.d3l().selectAll(".drawing rect.drawing-feature-box").remove();
        if (this.get('drawingSelectedFeature')) {
            Ember.run.later( () => {
                let drawingZone = this.d3l().selectAll(".drawing .graphic")
                    .filter(d => d == this.get('drawingSelectedFeature'));
                let selectedEl = drawingZone.node().children[0];
                let nodeBox = d3lper.absoluteSVGBox(this.d3l().node(), selectedEl);
                let rect = drawingZone.selectOrCreate("rect.drawing-feature-box", function() {
                    return this.append("rect").classed("drawing-feature-box", true);
                }).attrs({
                    x: nodeBox.x,
                    y: nodeBox.y,
                    width: nodeBox.width,
                    height: nodeBox.height
                });
                this.attachDragFeature(drawingZone);
                this.drawingBindKeyboard(drawingZone);
            });
        } else {
            this.detachDragFeature();
            this.drawingUnbindKeyboard();
        }
    }.observes('drawingSelectedFeature'),

    drawingDraw: function() {
        let self = this;

        const graphicsCreation = function(sel) {
            let graphics = sel.append("g").classed("graphic", true);
            graphics.each(function(d, i) {
                let n;
                if (d.get('type') === "text") {
                    n = d3.select(this).append("text");
                } else if (d.get('type') === "line") {
                    n = d3.select(this).append("path")
                        .attr("fill", "none")
                        .attr("stroke-width", 2);
                }
            });
            return graphics;
        };  

        const lineAttrs = function(line, d, points) {
            line.attr("d", LineGenerator(points))
                .attr("stroke", d.get('color'))
                .attr("stroke-width", d.get('strokeWidth'))
                .attr("stroke-dasharray", d.getDashArray());
            
            if (d.get('markerStart')) {
                let markerId = markerMaker.buildMarker(self.d3l().select("defs"), d.get('markerStart'), line.node(), d.get('strokeWidth'));
                line.attr("marker-start", `url(${markerId})`);
                d3.select(markerId)
                    .attr("fill", d.get('color'));
            }
            if (d.get('markerEnd')) {
                let markerId = markerMaker.buildMarker(self.d3l().select("defs"), d.get('markerEnd'), line.node(), d.get('strokeWidth'));
                line.attr("marker-end", `url(${markerId})`);
                d3.select(markerId)
                    .attr("fill", d.get('color'));
            }
        };

        const textAttrs = function(text, d, tx, ty) {
            text.attr("font-size", d.get('fontSize'))
                .attr("fill", d.get('color'))
                .attr("text-anchor", d.get('align'))
                .attr("transform", d3lper.translate({tx, ty}));
            d3lper.multilineText(text, d.get('text'));
        }

        this.d3l().select(".drawing.positioning-geo").selectAll("g.graphic")
            .data(this.get('graphLayout.drawings').filter( d => d.get('positioning') === "geo" ))
            .enterUpdate({
                enter: graphicsCreation,
                update: (n) => {
                    let self = this;
                    n.each(function(d, i) {
                        let path = self.assumePathForLatLon([d.get('geoX'), d.get('geoY')]);
                        let [tx, ty] = path.centroid({type: "Point", coordinates: [d.get('geoX'), d.get('geoY')]});
                        if (d.get('type') === "line") {
                            let [txEnd, tyEnd] = path.centroid({type: "Point", coordinates: [d.get('geoXEnd'), d.get('geoYEnd')]});
                            let points = d3lper.curveLine([
                                [tx, ty],
                                [txEnd, tyEnd]
                            ], d.get('curve') || 0);
                            lineAttrs(d3.select(this).select("path"), d, points);
                        } else {
                            textAttrs(d3.select(this).select("text"), d, tx, ty);
                        }
                        d3.select(this).attr("transform", null);
                    });
                }
            });
            this.d3l().select(".drawing.positioning-absolute").selectAll("g.graphic")
            .data(this.get('graphLayout.drawings').filter( d => d.get('positioning') === "absolute" ))
            .enterUpdate({
                enter: graphicsCreation,
                update: (n) => {
                    let self = this;
                    n.each(function(d, i) {
                        let tx = d.get('x');
                        let ty = d.get('y');
                        if (d.get('type') === "line") {
                            let points = d3lper.curveLine([
                                [tx, ty],
                                [d.get('xEnd'), d.get('yEnd')]
                            ], d.get('curve') || 0);
                            lineAttrs(d3.select(this).select("path"), d, points);
                        } else {
                            textAttrs(d3.select(this).select("text"), d, tx, ty);
                        }
                        d3.select(this).attr("transform", null);
                    });
                }
            });

        this.drawingDrawFeatureBox();

    }.observes('graphLayout.drawings.[]', 'graphLayout.drawings.@each._defferedChangeIndicator'),

    startDrawing(type) {
        this.unselectFeature();
        this.set('drawingClickedPoints', Em.A());
        this.d3l().on("mousemove.drawing", this.drawingDrawMarker.bind(this));
        switch(type) {
            case 'text':
                this.d3l().classed("drawing-text", true);
                this.d3l().classed("drawing-arrow", false);
                this.d3l().on("click.drawing", this.drawHandlerText.bind(this));
                break;
            case 'line':
                this.d3l().classed("drawing-arrow", true);
                this.d3l().classed("drawing-text", false);
                this.d3l().on("click.drawing", this.drawHandlerLine.bind(this));
                break;
        }
    },

    endDrawing(type) {
        let newDrawing;
        let positionings = this.get('drawingClickedPoints').map(this.drawPositioningFromPoint.bind(this));
        if (type === "text") {
            this.get('graphLayout.drawings').addObject(newDrawing = TextDrawing.create({
                ...positionings[0]
            }));
        } else if (type === "line") {
            let positioningType = positionings.reduce(
                (out, p) => (out === "absolute" || p.positioning === "absolute") ? "absolute" : p.positioning 
            );
            if (positioningType === "geo") {
                this.get('graphLayout.drawings').addObject(newDrawing = LineDrawing.create({
                    ...positionings[0],
                    xEnd: positionings[1].x,
                    xEnd: positionings[1].x,
                    geoXEnd: positionings[1].geoX,
                    geoYEnd: positionings[1].geoY,
                    curve: 0
                }));
            } else {
                this.get('graphLayout.drawings').addObject(newDrawing = LineDrawing.create({
                    positioning: "absolute",
                    x: positionings[0].x,
                    y: positionings[0].y,
                    xEnd: positionings[1].x,
                    yEnd: positionings[1].y,
                    curve: 0
                }));
            }
        }
        this.d3l().on("click.drawing", null);
        this.d3l().on("mousemove.drawing", null);
        this.set('drawingClickedPoints', null);
        this.d3l().classed("drawing-arrow", false);
        this.d3l().classed("drawing-text", false);
        this.hideDrawingMarker();
        this.selectFeature(newDrawing);
    },

    endMoving(feature, tx, ty) {
        console.log("endmoving");
        let points;
        if (feature.get('positioning') === "geo") {
            points = feature.getCoordinates().map(this.xyFromLonLat.bind(this));
        } else {
            points = feature.getCoordinates();
        }
        points.forEach( p => {
            p[0] += tx;
            p[1] += ty;
        });
        let positionings = points.map(this.drawPositioningFromPoint.bind(this));
        if (feature.get('type') === "text") {
            feature.setProperties({
                ...positionings[0]
            });
        } else if (feature.get('type') === "line") {
            let positioningType = positionings.reduce(
                (out, p) => (out === "absolute" || p.positioning === "absolute") ? "absolute" : p.positioning 
            );
            if (positioningType === "geo") {
                feature.setProperties({
                    ...positionings[0],
                    xEnd: positionings[1].x,
                    xEnd: positionings[1].x,
                    geoXEnd: positionings[1].geoX,
                    geoYEnd: positionings[1].geoY,
                });
            } else {
                console.log("absolute");
                feature.setProperties({
                    positioning: "absolute",
                    x: positionings[0].x,
                    y: positionings[0].y,
                    xEnd: positionings[1].x,
                    yEnd: positionings[1].y,
                });
            }
        }
    },

    drawHandlerText() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        this.get('drawingClickedPoints').addObject(d3.mouse(this.d3l().select(".map").node()));
        this.endDrawing("text");
    },
    
    drawHandlerLine() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        this.get('drawingClickedPoints').addObject(d3.mouse(this.d3l().select(".map").node()));
        if (this.get('drawingClickedPoints').length === 2) {
            this.endDrawing("line");
        }
    },

    selectFeature(data) {
        this.set('drawingSelectedFeature', data);
        this.sendAction('onDrawingFeatureSelected', data);
    },
    
    unselectFeature() {
        this.set('drawingSelectedFeature', null);
        this.sendAction('onDrawingFeatureSelected', null);
    },

    attachDragFeature(graphicSel) {
        let drag = d3.drag()
            .subject(() => {
                let nodeBox = d3lper.absoluteSVGBox(this.d3l().node(), graphicSel.node());
                return {
                    x: nodeBox.x,
                    y: nodeBox.y
                };
            })
            .on("start", () => {
                d3.event.sourceEvent.stopPropagation();
            })
            .on("drag", () => {

                let pos = {
                    tx: d3.event.x - d3.event.subject.x,
                    ty: d3.event.y - d3.event.subject.y
                };

                graphicSel.attrs({
                    'transform': d3lper.translate(pos), 
                    "kis:kis:tx": pos.tx,
                    "kis:kis:ty": pos.ty
                });

            })
            .on("end", (d) => {
                this.endMoving(
                    d,
                    parseInt(graphicSel.attr('kis:kis:tx')),
                    parseInt(graphicSel.attr('kis:kis:ty'))
                );
                graphicSel.attr('kis:kis:tx', null).attr('kis:kis:ty', null);
            });

        graphicSel.call(drag);
    },

    detachDragFeature() {
        this.d3l().selectAll(".drawing g.graphic")
            .on("mousedown.drag", null);
    },

    drawingUnbindKeyboard() {
        $(document).unbind('keyup.drawing');
    },

    drawingBindKeyboard(graphicSel) {
        $(document).bind('keyup.drawing', event => {
            const {key} = event;
            if (key === "Delete" || key === "Backspace") {
                this.get('graphLayout.drawings').removeObject(this.get('drawingSelectedFeature'));
                this.unselectFeature();
            }
        });
    },

    drawPositioningFromPoint([x, y]) {
        let path = this.assumePathForXY([x, y]),
            [geoX, geoY] = path.projection().invert([x, y]);
        if (!isNaN(geoX) && !isNaN(geoY)) {
            let [x2, y2] = path.centroid({type: "Point", coordinates: [geoX, geoY]});
            if ((d3lper.distance([x, y], [x2, y2]) < 1)) { //outside of projection area
                return {geoX, geoY, x, y, positioning: "geo"};
            }
        }
        return {x, y, positioning: "absolute"};
    },

    xyFromLonLat([geoX, geoY]) {
        let path = this.assumePathForLatLon([geoX, geoY]);
        return path.centroid({type: "Point", coordinates: [geoX, geoY]});
    },

    bindDrawingEvents(notifier) {
        notifier.on(START_DRAWING_EVENT, this, this.startDrawing);
    },

    unregisterNotifier(notifier) {
        this._super(notifier);
        notifier.off(START_DRAWING_EVENT, this, this.startDrawing);
    },

    registerNotifier(notifier) {
        this._super(notifier);
        this.bindDrawingEvents(notifier);
    }

});