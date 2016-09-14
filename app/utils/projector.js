import d3 from 'd3';

export default {
  
  computeProjection(features, width, height, fWidth, fHeight, margin, proj) {
    
    let fProjection = proj.fn(false).scale(1).precision(0.1).translate([0, 0]),
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
    
    let projection = proj.fn()
      .center(center)
      .clipExtent([[-width, -width], [2*width, 2*height]])
      .translate([
        (width + (margin.get('l') - margin.get('r'))) / 2,
        (height + (margin.get('t') - margin.get('b'))) / 2
      ])
      .precision(0.1);
    
    //store initial resolution and translate for future scale
    projection.resolution = r;
    projection.initialTranslate = projection.translate();

    return projection;
    
  }

};
