/*import {
	select,
	scaleOrdinal
} from 'd3.v5.min';*/
import { showMap } from './showMap.js';
import { loadCoordinates } from './loadCoordinates.js';
import { list } from './list.js';
import { showSelectedDistrict } from './select.js';
import { showResult } from './showResult.js';

const svg = d3.select('svg');
const width = svg.attr('width');
const height = svg.attr('height');
const incomeMap = {0:"Less than 20,000",1:"20,000-22,500", 2:"22,500-25,000", 3:"25,000-27,500", 4:"27,500-30,000", 5:"Higher than 30000"};

let features; //will be used in drawing map, and mapping color by districts' name
let selectedDistrict = null;
let electionResult;

//groups of different elements
const selectG = svg.append('g');
const mapG = svg.append('g');
const listG = svg.append('g')
					.attr("transform",`translate(48, 210)`);
const resultG = svg.append('g')
const dataG = svg.append('g');


//const colorOfIncome = ["#147f85", "#1ebfc8","#37d9e1","#64e1e8","#bcf2f5"];

const colorScale = d3.scaleOrdinal();
const colorValue = d => {
	let category;
	//if(d.properties.winner == "pro-Beijing") category = 10;
	//else category = 0;
	if(d.properties.income < 20000) category = 0;
	else if(d.properties.income >= 20000 && d.properties.income < 22500) category = 1;
	else if(d.properties.income >= 22500 && d.properties.income < 25000) category = 2;
	else if(d.properties.income >= 25000 && d.properties.income < 27500) category = 3;
	else if(d.properties.income >= 27500 && d.properties.income < 30000) category = 4;
	else if(d.properties.income >= 30000) category = 5;
	return category;
};

const onClick = d => {
	selectedDistrict = d;
	render();
	if(selectedDistrict != null){
		mapG.selectAll('*').remove();
		resultG.selectAll('*').remove();
		selectG.call(showSelectedDistrict,
		{
			features,
			width,
			height,
			colorScale,
			colorValue,
			selectedDistrict,
			onClick			
		});
	}
	else{
		selectG.selectAll('*').remove();
	}

}

loadCoordinates().then(data => {

	features = data[0].features;
	electionResult = data[1].features;
	console.log(features);
	console.log(electionResult);
	render();
})

const render = () => {
	colorScale
		.domain(features.map(colorValue))
		.domain(colorScale.domain().sort())
		.range(d3.schemeGreens[colorScale.domain().length]);
	
	mapG.call(showMap, 
	{
		features,
		width,
		height,
		colorScale,
		colorValue,
		onClick,
		selectedDistrict
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
	resultG.call(showResult, {
		electionResult,
		width,
		height,
		features
	})
}