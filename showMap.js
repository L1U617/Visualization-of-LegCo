 /*import {  sssaaaa
	select,
	json,
	geoPath,
	geoMercator,
	event,
	zoom
} from 'd3.v5.min';
*/

export const showMap = (selection, props) => {
	const {
		features,
		width,
		height,
		colorScale,
		colorValue
	} = props;

	const projection = d3.geoMercator()
		  .center([114.120, 22.281])
		  .scale(65000)
		  .translate([width / 2 , height / 2 + 100]);
		const pathGenerator = d3.geoPath().projection(projection);

	const gUpdate = selection.selectAll('g').data([null]);
	const gEnter = gUpdate.enter().append('g');
	const g = gUpdate.merge(gEnter);

	selection.call(d3.zoom().on('zoom', () => {
		g.attr('transform', d3.event.transform);
	})); //enable zoom in and out

	const districtPaths = g.selectAll('.district').data(features);
	const districtPathsEnter = districtPaths.enter()
								.append('path')
								.attr('class', 'district');
	districtPaths
		.merge(districtPathsEnter)
			.attr('d', pathGenerator)
			.attr('fill', d => colorScale(colorValue(d)));

	const showInfo = d => d.properties.income;
	districtPathsEnter.append('title')
		.text(d => d.properties.name + ', income: ' + showInfo(d)); //when the mouse stays on a district show its name
	
}