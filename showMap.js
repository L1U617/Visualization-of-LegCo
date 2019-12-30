 /*import {
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
		colorValue,
		onClick,
		selectedDistrict
	} = props;

	//draw a map with income information
	const projection = 
		d3.geoMercator()
		  .center([114.120, 22.281])
		  .scale(55000)
		  .translate([1080 / 2 - 100 , height / 2 + 100]);
	const pathGenerator =
		d3.geoPath().projection(projection);

	const districtPaths = selection.selectAll('.district').data(features);
	const districtPathsEnter = districtPaths.enter()
								.append('path')
								.attr('class', 'district');
	districtPaths
		.merge(districtPathsEnter)
			.attr('d',pathGenerator)
			.attr('fill', d => colorScale(colorValue(d)))
			.on("click", d => {
				if(selectedDistrict === null)
					onClick(d.properties.name)
			});

	const showInfo = d => 
		d.properties.income;
	districtPathsEnter.append('title')
		.text(d => d.properties.name + ', income: ' + showInfo(d)); //when the mouse stays on a district show its name
}