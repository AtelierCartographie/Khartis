import Ember from 'ember';
import d3lper from 'khartis/utils/d3lper';

export default Ember.Mixin.create({
	dataSourceComputed: function() {
		let ds = this.get('dataSource');
		if (this.get('graphLayout.basemap.mapConfig.attribution')) {
			return `${this.get('graphLayout.basemap.mapConfig.attribution')}${ds ? ` - ${ds}` : ''}`;
		} else {
			return ds;
		}
	}.property('graphLayout.basemap.mapConfig', 'dataSource'),

	titleIsSet: function() {
		return this.get('title') && this.get('title').length > 0;
	}.property('title'),

	creditsInit(d3g) {
		d3g.append('text').classed('map-title', true);

		d3g.append('text').classed('map-dataSource', true);

		d3g.append('g').classed('map-author', true).append('text');

		this.drawCredits();
	},

	drawCredits: function() {
		let { w, h } = this.getSize(),
      d3l = this.d3l(),
      gl = this.get('graphLayout');

		let textEl = d3l.select('text.map-title').attrs({
      'kis:kis:transient': this.get('titleIsSet') ? null : 'true',
    });
    
    this.setTextStyle(textEl, this.get('titleStyle'));
    //override fill if title isn't setted
    textEl.attr("fill", this.get('titleIsSet') ? this.get('titleStyle.color') : '#DCDCDC');
    
    let tx;
    switch (this.get('titleStyle.anchor')) {
      case "start": tx = gl.hOffset(w) + gl.get('margin.l'); break;
      case "middle": tx = w / 2; break;
      case "end": tx = w - gl.hOffset(w) - gl.get('margin.r'); break;
    }

    textEl.attr(
      "transform",
      d3lper.translate({
        tx,
        ty: gl.vOffset(h) + gl.get('margin.t') - Math.round(this.get('titleStyle.size')/0.76)
      })
    );

		d3lper.multilineText(
			textEl,
			this.get('titleIsSet') ? this.get('title') : this.get('i18n').t('export.placeholder.mapTitle').string
    );
    
    d3l.attr('title', this.get('title'));
    
		textEl = d3l.select('text.map-dataSource').attr(
      "transform",
      d3lper.translate({
        tx:  w - gl.hOffset(w) - gl.get('margin.r') - 1,
        ty: h - gl.vOffset(h) - gl.get('margin.b')
      })
    );
    
    this.setTextStyle(textEl, this.get('dataSourceStyle'));
    
    d3lper.multilineText(
			textEl,
			this.get('dataSourceComputed')
    );

		textEl = d3l
			.select('g.map-author')
			.attr(
        'transform',
				d3lper.translate({
          tx: w - gl.hOffset(w) - gl.get('margin.r'),
					ty: h - gl.vOffset(h) - gl.get('margin.b') - 1
				})
			)
			.select('text');
      
    this.setTextStyle(textEl, this.get('authorStyle'));
  
    textEl.attr('transform', 'rotate(-90)');
      
    d3lper.multilineText(
      textEl,
      this.get('author')
    );

	}.observes(
		'title',
		'dataSource',
    'author',
    'titleStyle._defferedChangeIndicator',
    'dataSourceStyle._defferedChangeIndicator',
    'authorStyle._defferedChangeIndicator',
		'$width',
		'$height',
		'graphLayout.margin._defferedChangeIndicator',
		'graphLayout.width',
		'graphLayout.height'
  ),
  
  setTextStyle(el, style) {
    el.attrs({
      "text-anchor": style.get('anchor'),
      "font-size": style.get('size'),
			"fill": style.get('color'),
      "font-weight": style.get('bold') ? "bold" : "normal",
      "text-decoration": style.get('underline') ? "underline" : null,
      "font-style": style.get('italic') ? "italic" : null,
      "font-family": style.font
    })
  }
});
