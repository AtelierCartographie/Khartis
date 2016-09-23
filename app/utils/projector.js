import d3 from 'd3';

export default {
  
  computeProjection(features, width, height, fWidth, fHeight, margin, proj, idx, zone) {

    const fn = idx !== undefined ? proj.fn(false).proxying(idx) : proj.fn(false);

    zone = zone || [[0, 0], [1, 1]];

    let fProjection = fn.precision(0.1).translate([0, 0]),
        d3Path = d3.geo.path().projection(fProjection),

        pixelBounds = d3Path.bounds(features ? features : {type: "Sphere"}),
        pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0],
        pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1],
    
        centerX = pixelBounds[0][0] + pixelBoundsWidth / 2,
        centerY = pixelBounds[0][1] + pixelBoundsHeight / 2,
        center = fProjection.invert([centerX, centerY]),

        widthResolution = (fWidth - margin.get('h'))*(zone[1][0] - zone[0][0]) / pixelBoundsWidth,
        heightResolution = (fHeight - margin.get('v'))*(zone[1][1] - zone[0][1]) / pixelBoundsHeight,

        r = Math.min(widthResolution, heightResolution);

    let projection = fn
      .center(center)
      .clipExtent([[-width, -width], [2*width, 2*height]])
      .translate([
        (width*(zone[1][0] - zone[0][0]) + (margin.get('l') - margin.get('r'))) / 2 + zone[0][0]*(width - margin.get('h')),
        (height*(zone[1][1] - zone[0][1]) + (margin.get('t') - margin.get('b'))) / 2 + zone[0][1]*(height - margin.get('v'))
      ])
      .precision(0.1);
    
    //store initial resolution and translate for future scale
    projection.resolution = r;
    projection.initialTranslate = projection.translate();

    return projection;
    
  }

};
