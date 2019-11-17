/*import {
	select,
	scaleOrdinal
} from 'd3.v5.min';*/
import { showMap } from './showMap.js';
import { loadCoordinates } from './loadCoordinates.js';
import { list } from './list.js';

const svg = d3.select('svg');
const width = svg.attr('width');
const height = svg.attr('height');
const incomeMap = {0:"Less than 20,000",1:"20,000-22,500", 2:"22,500-25,000", 3:"25,000-27,500", 4:"27,500-30,000", 5:"Higher than 30000"};

let features; //will be used in drawing map, and mapping color by districts' name
let selectedColorValue;

const mapG = svg.append('g');
const listG = svg.append('g')
					.attr("transform",`translate(48, 310)`);

const colorScale = d3.scaleOrdinal();
const colorValue = d => {
	let category;	if(d.properties.income < 20000) category = 0;
	else if(d.properties.income >= 20000 && d.properties.income < 22500) category = 1;
	else if(d.properties.income >= 22500 && d.properties.income < 25000) category = 2;
	else if(d.properties.income >= 25000 && d.properties.income < 27500) category = 3;
	else if(d.properties.income >= 27500 && d.properties.income < 30000) category = 4;
	else if(d.properties.income >= 30000) category = 5;
	return category;
};

const onClick = d => {
	selectedColorValue = d;
	render();
}

loadCoordinates().then(districts => {
	features = districts.features;
	console.log(features);
	render();
})

const render = () => {
	colorScale
		.domain(features.map(colorValue))
		.domain(colorScale.domain().sort().reverse())
		.range(d3.schemeSpectral[colorScale.domain().length]);

	mapG.call(showMap, 
	{
		features,
		width,
		height,
		colorScale,
		colorValue
	});

	listG.call(list, 
	{
		colorScale,
		circleRadius: 8,
		spacing: 20,
		textOffset: 12,
		backgroundRectWidth: 200,
		incomeMap
	});
}