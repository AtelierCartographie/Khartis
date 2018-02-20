import Ember from 'ember';
import d3 from 'npm:d3';
import TextDrawing from 'khartis/models/drawing/text';
import LineDrawing from 'khartis/models/drawing/line';
import Coordinates from 'khartis/models/drawing/coordinates';
import d3lper from '../../../utils/d3lper';
import markerMaker from '../../../utils/marker-maker';

export const DRAWING_EVENT = "drawingEvent";

const LineGenerator = d3.line().curve(d3.curveBasis);

export default Ember.Mixin.create({

    drawingToolsEnabled: false,

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

        this.d3l().on("click.drawingselect", this.drawingMapClick.bind(this, false));
        this.d3l().on("dblclick.drawingselect", this.drawingMapClick.bind(this, true));

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

    drawingMapClick(autoActivate) {
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
            if (this.get('drawingToolsEnabled')) {
                this.selectFeature(d3.select(els[0]).datum());
            } else if (autoActivate) {
                this.get('eventNotifier').trigger(DRAWING_EVENT, "preactivate");
                this.selectFeature(d3.select(els[0]).datum());
            }
            this.get('d3Zoom').discardDblclick();
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

    drawingDraw() {
        let self = this;

        //first re-compute dirty coordinates if need
        this.recomputeDirtyCoordinates();

        this.updateGeoForAbsoluteDrawings();

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
                let marker = markerMaker.buildMarker(
                    self.d3l().select("defs"),
                    d.get('markerStart'),
                    line.node(),
                    d.get('strokeWidth'),
                    d.get('markerStartScale')
                );
                line.attr("marker-start", `url(${marker.url})`);
                d3.select(`#${marker.id}`)
                    .attr("fill", d.get('markerStartColor') || d.get('color'));
            } else {
                line.attr("marker-start", null);
            }
            if (d.get('markerEnd')) {
                let marker = markerMaker.buildMarker(
                    self.d3l().select("defs"),
                    d.get('markerEnd'),
                    line.node(),
                    d.get('strokeWidth'),
                    d.get('markerEndScale')
                );
                line.attr("marker-end", `url(${marker.url})`);
                d3.select(`#${marker.id}`)
                    .attr("fill", d.get('markerEndColor') || d.get('color'));
            } else {
                line.attr("marker-end", null);
            }
        };

        const textAttrs = function(text, d, tx, ty) {
            text.attr("font-size", d.get('fontSize'))
                .attr("fill", d.get('color'))
                .attr("text-anchor", d.get('align'))
                .attr("transform", d3lper.translate({tx, ty}))
                .attr("font-weight", d.get('bold') ? "bold" : "normal")
                .attr("font-weight", d.get('bold') ? "bold" : "normal")
                .attr("text-decoration", d.get('underline') ? "underline" : null)
                .attr("font-style", d.get('italic') ? "italic" : null)
            d3lper.multilineText(text, d.get('text'));
        }

        this.d3l().select(".drawing.positioning-geo").selectAll("g.graphic")
            .data(this.get('graphLayout.drawings').filter( d => d.get('positioning') === "geo" && this.featureIsGeoDiplayable(d) ), d => d._uuid)
            .enterUpdate({
                enter: graphicsCreation,
                update: (n) => {
                    let self = this;
                    n.each(function(d, i) {
                        let [tx, ty] = self.xyFromLatLon(d.get('pt').getLatLon());
                        if (d.get('type') === "line") {
                            let [txEnd, tyEnd] = self.xyFromLatLon(d.get('ptEnd').getLatLon());
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
            .data(this.get('graphLayout.drawings').filter( d => d.get('positioning') === "absolute" ), d => d._uuid)
            .enterUpdate({
                enter: graphicsCreation,
                update: (n) => {
                    let self = this;
                    n.each(function(d, i) {
                        let [tx, ty] = d.get('pt').getXY();
                        if (d.get('type') === "line") {
                            let points = d3lper.curveLine([
                                [tx, ty],
                                d.get('ptEnd').getXY()
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

    },

    drawingsChange: function() {
        if (this.get('drawingSelectedFeature')) {
            let exist = this.get('graphLayout.drawings').find( f => f == this.get('drawingSelectedFeature'));
            if (!exist) {
                this.set('drawingSelectedFeature', null);
            }
        }
        this.drawingDraw();
    }.observes('graphLayout.drawings.[]', 'graphLayout.drawings.@each._defferedChangeIndicator'),

    handleDrawingEvent(type) {
        switch(type) {
            case 'select':
                this.stopDrawingEditMode();
                break;
            case 'unselect':
                this.unselectFeature();
                break;
            case 'activate':
                this.set('drawingToolsEnabled', true);
                break;
            case 'deactivate':
                this.unselectFeature();
                this.stopDrawingEditMode();
                this.set('drawingToolsEnabled', false);
                break;
            case 'text':
                this.startDrawingEditMode('text');
                this.d3l().on("click.drawing", this.drawHandlerText.bind(this));
                break;
            case 'line':
                this.startDrawingEditMode('line');
                this.d3l().on("click.drawing", this.drawHandlerLine.bind(this));
                break;
        }
    },

    startDrawingEditMode(mode) {
        this.unselectFeature();
        this.set('drawingClickedPoints', Em.A());
        this.d3l().on("mousemove.drawing", this.drawingDrawMarker.bind(this));
        this.d3l().classed(`drawing-${mode}`, true);
    },
    
    stopDrawingEditMode() {
        this.set('drawingClickedPoints', null);
        this.hideDrawingMarker();
        this.d3l().on("click.drawing", null);
        this.d3l().on("mousemove.drawing", null);
        this.d3l().classed(`drawing-line`, false);
        this.d3l().classed(`drawing-text`, false);
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
                    ptEnd: positionings[1].pt,
                }));
            } else {
                this.get('graphLayout.drawings').addObject(newDrawing = LineDrawing.create({
                    positioning: "absolute",
                    pt: positionings[0].pt,
                    ptEnd: positionings[1].pt
                }));
            }
        }
        this.selectFeature(newDrawing);
    },

    endMovingDraw(feature, tx, ty) {
        let points;
        if (feature.get('positioning') === "geo") {
            points = feature.getCoordinates().map(c => this.xyFromLatLon(c.getLatLon()));
        } else {
            points = feature.getCoordinates().map(c => c.getXY());
        }
        points.forEach( p => {
            p[0] += tx;
            p[1] += ty;
        });
        let positionings = points.map(this.drawPositioningFromPoint.bind(this));
        if (feature.get('type') === "text") {
            feature.setProperties({
                positioning: positionings[0].positioning === "absolute" ? "absolute" : feature.get('positioning'),
                pt: positionings[0].pt
            });
        } else if (feature.get('type') === "line") {
            let computedPositioning = positionings.reduce(
                (out, p) => (out === "absolute" || p.positioning === "absolute") ? "absolute" : p.positioning 
            );
            if (computedPositioning === "geo" && feature.get('positioning') === "geo") {
                feature.setProperties({
                    ...positionings[0],
                    ptEnd: positionings[1].pt
                });
            } else {
                feature.setProperties({
                    positioning: "absolute",
                    pt: positionings[0].pt,
                    ptEnd: positionings[1].pt
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
        this.get('_eventNotifier').trigger(DRAWING_EVENT, 'select');
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
                graphicSel.attrs({
                    "kis:kis:tx": 0,
                    "kis:kis:ty": 0
                });
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
                this.endMovingDraw(
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
            if (event.target == document.body) {
                const {key} = event;
                if (key === "Delete" || key === "Backspace") {
                    event.preventDefault();
                    this.get('graphLayout.drawings').removeObject(this.get('drawingSelectedFeature'));
                    this.unselectFeature();
                }
            }
        });
    },

    drawPositioningFromPoint([x, y]) {
        let path = this.assumePathForXY([x, y]);
        if (path) {
            let geoC = path.projection().invert([x, y]);
            if (geoC != undefined && !isNaN(geoC[0]) && !isNaN(geoC[1])) {
                let path2 = this.assumePathForLatLon([geoC[1], geoC[0]]);
                if (path2) {
                    let [x2, y2] = path2.centroid({type: "Point", coordinates: geoC});
                    if (!isNaN(x2) && !isNaN(y2) && d3lper.distance([x, y], [x2, y2]) < 1) { //inside of projection area
                        return {pt: Coordinates.create({x, y, geoX: geoC[0], geoY: geoC[1]}), positioning: "geo"};
                    }
                }
            }
        }
        return {pt: Coordinates.create({x, y}), positioning: "absolute"};
    },

    xyFromLatLon(coords) {
        let path = this.assumePathForLatLon(coords);
        if (path) {
            return path.centroid({type: "Point", coordinates: [coords[1], coords[0]]});
        } else {
            return null;
        }
    },

    lonLatFromXY(coords) {
        let path = this.assumePathForXY(coords);
        return path.projection().invert(coords);
    },
    
    updateGeoForAbsoluteDrawings() {
        this.get('graphLayout.drawings')
            .filter( feature => feature.get('positioning') === "absolute" )
            .forEach( feature => {
                //try to compute geo coordinates
                feature.getCoordinates().forEach( pt => {
                    let positioning = this.drawPositioningFromPoint(pt.getXY());
                    if (positioning.positioning === "geo") {
                        pt.setProperties({
                            'geoX': positioning.pt.get('geoX'),
                            'geoY': positioning.pt.get('geoY')
                        });
                    } else {
                        pt.setProperties({
                            'geoX': null,
                            'geoY': null
                        });
                    }
                });
            });
    },

    featureIsGeoDiplayable(feature) {
        return feature.getCoordinates()
            .every( pt => {
                let xy = this.xyFromLatLon(pt.getLatLon());
                return xy != null && !isNaN(xy[0]) && !isNaN(xy[1]);
            });
    },

    recomputeDirtyCoordinates() {
        this.get('graphLayout.drawings').forEach( feature => {
            if (feature.get('dirtyCoordinates')) {
                if (feature.get('positioning') === "absolute") {
                    feature.getCoordinates().forEach( coord => {
                        let xy = this.xyFromLatLon([coord.get('geoY'), coord.get('geoX')]);
                        coord.setProperties({
                            x: xy[0],
                            y: xy[1]
                        });
                    });
                } else if (feature.get('positioning') === "geo") {
                    feature.getCoordinates().forEach( coord => {
                        let lonLat = this.lonLatFromXY([coord.get('x'), coord.get('y')]);
                        coord.setProperties({
                            geoX: lonLat[0],
                            geoY: lonLat[1]
                        });
                    });
                }
                feature.set('dirtyCoordinates', false);
            }
        });
    },

    bindDrawingEvents(notifier) {
        notifier.on(DRAWING_EVENT, this, this.handleDrawingEvent);
    },

    unregisterNotifier(notifier) {
        this._super(notifier);
        notifier.off(DRAWING_EVENT, this, this.handleDrawingEvent);
    },

    registerNotifier(notifier) {
        this._super(notifier);
        this.bindDrawingEvents(notifier);
    }

});