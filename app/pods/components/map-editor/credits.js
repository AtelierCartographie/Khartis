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
      'font-size': '2em',
			fill: this.get('titleIsSet') ? null : '#DCDCDC',
      'kis:kis:transient': this.get('titleIsSet') ? null : 'true'
		});
    
    textEl.attr(
      "transform",
      d3lper.translate({
        tx: gl.hOffset(w) + gl.get('margin.l'),
        ty: gl.vOffset(h) + gl.get('margin.t')
      })
    );

		d3lper.multilineText(
			textEl,
			this.get('titleIsSet') ? this.get('title') : this.get('i18n').t('export.placeholder.mapTitle').string
    );
    
		d3l.attr('title', this.get('title'));

		textEl = d3l.select('text.map-dataSource').attrs({
			'font-size': '0.8em',
			'text-anchor': 'end',
			x: w - gl.hOffset(w) - gl.get('margin.r') - 1,
			y: h - gl.vOffset(h) - gl.get('margin.b') + 11
    });
    
    d3lper.multilineText(
			textEl,
			this.get('dataSourceComputed')
    );

		textEl = d3l
			.select('g.map-author')
			.attr(
				'transform',
				d3lper.translate({
					tx: w - gl.hOffset(w) - gl.get('margin.r') + 11,
					ty: h - gl.vOffset(h) - gl.get('margin.b') - 1
				})
			)
			.select('text')
			.attr('transform', 'rotate(-90)')
			.attrs({
				'font-size': '0.8em'
      });
      
    d3lper.multilineText(
      textEl,
      this.get('author')
    );
    
	}.observes(
		'title',
		'dataSource',
		'author',
		'$width',
		'$height',
		'graphLayout.margin._defferedChangeIndicator',
		'graphLayout.width',
		'graphLayout.height'
	)
});
