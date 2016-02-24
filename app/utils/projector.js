import d3 from 'd3';

export default {
  
  computeProjection(features, width, height, fWidth, fHeight, margin, proj = d3.geo.mercator) {

    let fProjection = proj().scale(1).translate([0, 0]),
        d3Path = d3.geo.path().projection(fProjection),

        pixelBounds = d3Path.bounds(features),
        pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0],
        pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1],
    
        centerX = pixelBounds[0][0] + pixelBoundsWidth / 2,
        centerY = pixelBounds[0][1] + pixelBoundsHeight / 2,
        center = fProjection.invert([centerX, centerY]),

        widthResolution = (fWidth - margin.h*2) / pixelBoundsWidth,
        heightResolution = (fHeight - margin.v*2) / pixelBoundsHeight,

        r = Math.min(widthResolution, heightResolution);

    return proj()
      .center(center)
      .scale(r)
      .translate([width / 2, height / 2]);

  }

}
