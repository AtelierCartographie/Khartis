import d3 from 'd3';

function inside(bbox, x, y) {
  return x >= bbox[0][0] && x <= bbox[1][0]
  && y <= bbox[0][1] && y >= bbox[1][1];
}

let proj = function() {
  
  let projection = {

    transforms: {
      scale: null,
      translate: null,
      invert: null,
      precision: 0.1,
      clipExtent: null,
      center: null,
      lobes: null,
      clipAngle: null,
      rotate: null
    },

    isValid: false,

    set projections(projs) {
      this.projs = projs.map( projConfig => (
        {
          idx: projConfig.idx,
          fn: projConfig.projection,
          scale: projConfig.scale,
          zoning: projConfig.zoning,
          bounds: projConfig.bounds,
          borders: projConfig.borders || [],
          instance: null
        }
      ));
    },

    get projections() {
      return this.projs;
    },

    get ref() {
      return this.projs[0].instance;
    },

    get resolution() {
      return this.ref.resolution;
    },

    set resolution(v) {
      this.ref.resolution = v;
    },

    get initialTranslate() {
      return this.ref.initialTranslate;
    },

    set initialTranslate(v) {
      this.ref.initialTranslate = v;
    },

    stream(stream) {

      if (!projection.isValid) {
        throw new Error("Projector is invalid, use configure first");
      }

      let s = projection.ref.stream(stream);

      return {
        point: function(x, y) {
          s.point(x, y);
        },
        sphere: function() {
          s.sphere();
        },
        lineStart: function() {
          s.lineStart();
        },
        lineEnd: function() {
          s.lineEnd();
        },
        polygonStart: function() {
          s.polygonStart();
        },
        polygonEnd: function() {
          s.polygonEnd();
        }
      }

    },

    scale(f) {
      if (!arguments.length) return this.ref.scale();
      return (this.transforms.scale = f, this.isValid = false, this);
    },

    translate(xy) {
      if (!arguments.length) return this.ref.translate();
      return (this.transforms.translate = xy, this.isValid = false, this);
    },

    invert(coords) {
      return this.ref.invert(coords);
    },

    precision(v) {
      if (!arguments.length) return this.ref.precision();
      return (this.transforms.precision = v, this.isValid = false, this);
    },

    clipExtent(args) {
      if (!arguments.length) return this.ref.clipExtent();
      return (this.transforms.clipExtent = args, this.isValid = false, this);
    },

    center(args) {
      if (!arguments.length) return this.ref.center();
      return (this.transforms.center = args, this.isValid = false, this);
    },

    lobes(args) {
      if (!arguments.length) return this.ref.lobes();
      return (this.transforms.lobes = args, this.isValid = false, this);
    },

    clipAngle(args) {
      if (!arguments.length) return this.ref.clipAngle();
      return (this.transforms.clipAngle = args, this.isValid = false, this);
    },

    rotate(args) {
      if (!arguments.length) return this.ref.rotate();
      return (this.transforms.rotate = args, this.isValid = false, this);
    },

    configure(mapData, width, height, fWidth, fHeight, margin) {
      this.projs.forEach( projConfig => {
        this._configureProjection(
          projConfig,
          mapData.find( d => d.projection === projConfig.idx ).land,
          width,
          height,
          fWidth,
          fHeight,
          margin
        )
      });
      this.isValid = true;
    },

    projectionAt(idx) {
      let p = this.projs.find( p => p.idx === idx );
      if (!p.instance) {
        throw new Error("Unconfigured projection instance, idx = "+idx);
      }
      return p.instance;
    },

    projectionsForLatLon(latLon) {
      return this.projs.filter( p => {
        let bbox = [
          p.instance.invert(p.instance.bboxPx[0]),
          p.instance.invert(p.instance.bboxPx[1])
        ];
        return inside(bbox, latLon[1], latLon[0]);
      } ).map(p => p.instance);
    },

    forEachProjection(f) {
      this.projs.forEach( p => f(p.instance) );
    },

    instances() {
      return this.projs.map( p => p.instance );
    },

    _instantiate(projConfig) {
      let d3Proj = eval(projConfig.fn);
      d3Proj.lobes && this.transforms.lobes && d3Proj.lobes(this.transforms.lobes);
      return d3Proj;
    },

    _configureProjection(projConfig, features, width, height, fWidth, fHeight, margin) {

      let zone = projConfig.zoning || [[0, 0], [1, 1]],
          d3Proj = this._instantiate(projConfig),
          fProjection = d3Proj.scale(1/projConfig.scale).precision(0.1).translate([0, 0]),
          d3Path = d3.geo.path().projection(fProjection),

          pixelBounds = d3Path.bounds(projConfig.bounds === "Sphere" ? {type: "Sphere"} : features),
          pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0],
          pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1],
      
          centerX = pixelBounds[0][0] + pixelBoundsWidth / 2,
          centerY = pixelBounds[0][1] + pixelBoundsHeight / 2,
          center = fProjection.invert([centerX, centerY]),

          widthResolution = ((fWidth - margin.get('h'))*(zone[1][0] - zone[0][0]) ) / pixelBoundsWidth,
          heightResolution = ((fHeight - margin.get('v'))*(zone[1][1] - zone[0][1]) ) / pixelBoundsHeight,

          r = Math.min(widthResolution, heightResolution),
          hOffset = (width - fWidth) /2, 
          vOffset = (height - fHeight) /2; 

      let projection = d3Proj
        .center(center)
        .clipExtent([[-width, -width], [2*width, 2*height]])
        .translate([
          (fWidth + margin.get('l') - margin.get('r')) / 2 - (1 - (zone[1][0] - zone[0][0]))*(fWidth - margin.get('h'))/2 + zone[0][0]*(fWidth - margin.get('h')) + hOffset,
          (fHeight + margin.get('t') - margin.get('b')) / 2 - (1 - (zone[1][1] - zone[0][1]))*(fHeight - margin.get('v'))/2 + zone[0][1]*(fHeight - margin.get('v')) + vOffset
        ])
        .precision(this.transforms.precision);

      projection.clipAngle && this.transforms.clipAngle && projection.clipAngle(this.transforms.clipAngle);
      projection.rotate && this.transforms.rotate && projection.rotate(this.transforms.rotate);

      //store initial resolution and translate for future scale
      projection.resolution = r;
      projection.initialTranslate = projection.translate();
      projection.bboxPx = [
        [
          margin.get('l') + zone[0][0]*(fWidth - margin.get('h')) + hOffset,
          margin.get('t') + zone[0][1]*(fHeight - margin.get('v')) + vOffset
        ],
        [
          margin.get('l') + zone[0][0]*(fWidth - margin.get('h')) + (zone[1][0] - zone[0][0])*(fWidth - margin.get('h')) + hOffset,
          margin.get('t') + zone[0][1]*(fHeight - margin.get('v')) + (zone[1][1] - zone[0][1])*(fHeight - margin.get('v')) + vOffset
        ]
      ];

      return projConfig.instance = projection;

    }

  };

  return projection;

}

d3.geo.compositeProjection = proj;
