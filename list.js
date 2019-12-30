export const list = (selection, props) => {
	const {
		colorScale,
		circleRadius,
		spacing,
		textOffset,
		backgroundRectWidth,
		incomeMap
	} = props;
	const n = colorScale.domain().length + 2;

	const backgroundRect = selection.selectAll('g').data([null]);	
	const listG = backgroundRect.enter().append("g");
	
	listG
		.append('rect')
		.merge(backgroundRect)
			.attr('x', -circleRadius * 2)
			.attr('y', -circleRadius * 2)
			.attr('rx', circleRadius * 2)
			.attr('width', backgroundRectWidth)
		    .attr('height', spacing * n + circleRadius * 2) 
		    .attr('fill', "#EFECEA")
		    .attr('opacity', 0.8);
	listG
		.append('text')
			.text("Income (HK$)")
			.attr("fill", "black")
			.attr("font-size", "1.5em")
			.attr("font", "sans-serif")
			.attr("y", 10);


	const groups = selection.selectAll('.listTick')
					.data(colorScale.domain());

	const groupsEnter = groups.enter().append('g')
										.attr('class','listTick');
	groupsEnter
		.merge(groups)
			.attr('transform', (d, i) => 
				`translate(0, ${i * spacing + 30})`
			)
	groups.exit().remove();

	groupsEnter.append("circle") 
	.merge(groups.select("circle"))
		.attr('r', circleRadius)
		.attr('fill', colorScale);
	groupsEnter.append('text')
		.merge(groups.select('text'))
			.text(d=>incomeMap[d])
			.attr('dy', '0.32em')
			.attr('x', textOffset);
}