import d3 from 'd3';

export default {
  
  computeProjection(features, width, height, fWidth, fHeight, margin, zoom, proj,
    tx, ty) {
    
    zoom = zoom < 1 ? 1 : 1/zoom;
    
    let fProjection = proj.fn(false).scale(zoom).precision(0.1).translate([0, 0]),
        d3Path = d3.geo.path().projection(fProjection),

        pixelBounds = d3Path.bounds(features ? features : {type: "Sphere"}),
        pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0],
        pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1],
    
        centerX = pixelBounds[0][0] + pixelBoundsWidth / 2,
        centerY = pixelBounds[0][1] + pixelBoundsHeight / 2,
        center = fProjection.invert([centerX, centerY]),

        widthResolution = (fWidth - margin.get('h')) / pixelBoundsWidth,
        heightResolution = (fHeight - margin.get('v')) / pixelBoundsHeight,

        r = Math.min(widthResolution, heightResolution);
        
        console.log(r);
    
    return proj.fn()
      .center(center)
      .scale(r)
      //.clipExtent([[0, 0], [fWidth, fHeight]])
      .translate([
        (width + (margin.get('l') - margin.get('r'))) / 2,
        (height + (margin.get('t') - margin.get('b'))) / 2
      ])
      .precision(0.1);
      
  }

};
