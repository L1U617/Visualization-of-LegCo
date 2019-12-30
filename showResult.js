export const showResult = (selection, props) => {
	const {
		electionResult,
		width,
		height,
		features
	} = props;

	const margin = {top: 30, right: 30, bottom: 100, left: 40},
		  chartWidth = 300 - margin.left - margin.right,
		  chartHeight = 300 - margin.top - margin.bottom;

	const parties = ["NPP","Demosistō","HKFTU","DP","DAB","CP",
		"BPA","Democracy Groundwork","Youngspiration","Labour Party", "Positive Synergy",
		"Civic Passion","New Territories Concern Group","Land Justice League","LSD",
		"People Power"];
	const politicalAffiliation = ["Pro-establishment", "Pan-democracy","Self-determination","Localist groups"];

	console.log(electionResult);

	const colorScaleRectAffiliation = d3.scaleOrdinal()
								.domain(politicalAffiliation)
								.range(["#4169E1","#ffc252","#FFF68F","#ffe970"]);
	const colorScaleRectParties = d3.scaleOrdinal()
								.domain(parties)
								.range(["#66CCCC", "#CCFF66","#FF99CC","#FF9999",
									"#FFCC99","#FF6666","#FFFF66","#99CC66",
									"#666699","#FF9900","#FFCC00","#3399CC",
									"#CC9999","#CCCC99","#CCCC33","#CCCCCC"]);

	let colorMode = colorScaleRectParties;

	/* click to change color*/
	let isAffiliation = false;
	const chooseColorMode = d =>{
		selection.selectAll('*').remove();
		isAffiliation = d;
		if(isAffiliation === true){
			colorMode = colorScaleRectAffiliation
		}
		else colorMode = colorScaleRectParties;
		render();
	}

	let selectedParty = null;
	let selectedPartyAffiliation = null;
	const clickBar = d => {
		selectedParty = d[0];
		selectedPartyAffiliation = d[1];
		selection.selectAll('*').remove();
		render();
	}
	const render = () => {		
		selection.append('text')
			.text('The Elected Result of 2016 Election')
			.attr('font-size', '2.5em')
			.attr('font-weight', 'bold')
			.attr('fill', 'black')
			.attr('x', 800)
			.attr('y', 100)
			.attr('text-anchor', 'middle');
		const buttonG = selection.selectAll('.button').data([null]).enter()
									.append('g')
									.attr('class','button')
									.attr('transform', 'translate(1200, 150)');

		buttonG.append('circle')
				.attr('fill', d => 
					(isAffiliation === true)
					? 'steelblue'
					: 'white'
				)
				.attr('stroke', 'black')
				.attr('stroke-width', '3px')
				.attr('r', 10)
				.attr('x', 6)
				.on('click', d => chooseColorMode(
					(isAffiliation === true)
					? false
					: true
					)
				);
		buttonG.append('text')
				.text('Color to indicate political affiliation')
				.attr('font-size','2em')
				.attr('fill', 'black')
				.attr('x', 30)
				.attr('y', 8);	

		//show how many votes a certain party gained in different district.


		//barchart
		const barchartG = selection.selectAll('.barchart').data([null])
									.enter()
									.append('g')
										.attr('class','barchart')
										.attr('transform', 'translate(800,100)');
		//legend
		let category;
		if(isAffiliation === true) category = politicalAffiliation;
		else category = parties;
		const legendG = barchartG.selectAll('.legend').data(category)
						.enter()
						.append('g')
							.attr('class','legend')
							.attr('transform',(d,i)=>`translate(630, ${100+i*15})`);
		legendG.append('rect')
				.attr('fill', (d, i)=>colorMode(category[i]))
				.attr('width',8)
				.attr('height',8);
		legendG.append('text')
				.text((d,i) => category[i])
				.attr('font-size','0.8em')
				.attr('x',12)
				.attr('y', 8)

		for(var i = 0; i < 5; i++)
		{
			let xpos, ypos;
			if(i === 0){
				xpos = 30; ypos = 100;
			} 
			else if (i === 1){
				xpos = 330; ypos = 100;
			} 
			else if (i === 2) {
				xpos = 30; ypos = 400;
			}
			else if (i === 3){
				xpos = 330; ypos = 400;
			}
			else if (i === 4){
				xpos = 630; ypos = 400;
			}
			let barchart  = barchartG.append('svg')
					.attr('width', 300)
					.attr('height',300)
					.attr('x', xpos)
					.attr('y', ypos)
					.append('g')
						.attr('transform', `translate(${margin.left},${margin.top})`);

			let area  = electionResult[i];
			let title = area.district;

			barchart .append('text')
						.text(title)
						.attr('font-size', '1em')
						.attr('font-weight','bold');


			
			area.theElect.sort((a, b) => {return b.percentOfVotes - a.percentOfVotes});
			let domain  = area .theElect.map(d => d.Candidates);
			var x  = d3.scaleBand()
						.domain(domain )
						.range([0, chartWidth])
						.padding(0.2);
			var y  = d3.scaleLinear()
						.domain([0,30])
						.range([chartHeight, 0]);
			barchart .append('g')
					.attr("transform", "translate(0," + chartHeight + ")")
					.call(d3.axisBottom(x ))
					.selectAll('text')
						.attr("transform", "translate(-0,0)rotate(-45)")
		    			.style("text-anchor", "end")
		    			.style('font-size','0.8em')
		    			.style('font-weight','bold');
		    barchart .append('g')
		    		.call(d3.axisLeft(y ).tickFormat(d => {return d + "%"}))
						
			barchart .selectAll('.bar')
					.data(area .theElect)
					.enter()
					.append('rect')
						.attr('class', 'bar')
						.attr('x', d => x (d.Candidates))
						.attr('y', d => y (d.percentOfVotes))
						.attr('width', d => x .bandwidth())
						.attr('height', d => {return chartHeight - y (d.percentOfVotes);})
						.attr('fill', d =>
							(isAffiliation === true)
							? colorMode(d.Affiliation)
							: colorMode(d.Party))	
						.on('click', d => {
							if(isAffiliation == false)
								clickBar(
									(selectedParty === null || selectedParty != d.Party)
									? [d.Party,d.Affiliation]
									: [null,null])
						});		
		}
		if(selectedParty != null){
			let data = [];
			let area = [];
			let id = [0,0,0,0,0];
			let label = [0,0,0,0,0];

			const projection = d3.geoMercator()
								  .center([114.120, 22.281])
								  .scale(55000)
								  .translate([1080 / 2 - 100 , height / 2 + 100]);
			const radius = d3.scaleLinear()
						.domain([0,30])
						.range([0,25]);

			electionResult.forEach(d1 => {				
				d1.theElect.forEach(d2 => {
					if(d2.Party == selectedParty){
						area.push({"area":d1.district,"id":d2.listNo});
					}
				})
			})
			area.forEach(d => {
				if(d.area == 'HONG KONG ISLAND'){
					label[0] = 1;
					id[0] = d.id;
				}
				else if(d.area == 'KOWLOON WEST'){
					label[1] = 1;
					id[1] = d.id;
				}
				else if(d.area == 'KOWLOON EAST'){
					label[2] = 1;
					id[2] = d.id;
				}
				else if(d.area == 'NEW TERRITORIES WEST'){
					label[3] = 1;
					id[3] = d.id;
				}		
				else if(d.area == 'NEW TERRITORIES EAST'){
					label[4] = 1;
					id[4] = d.id;
				}			
			})
			d3.csv('data/2016_cs_result.csv').then(d => {				
				d.forEach(lines => {
					if(lines.Area === 'HONG KONG ISLAND' && label[0] === 1){
						data.push({"district":lines.District,"rate":lines[id[0]]});
					}
					else if(lines.Area === 'KOWLOON WEST' && label[1] === 1){
						data.push({"district":lines.District,"rate":lines[id[1]]});
					}
					else if(lines.Area === 'KOWLOON EAST' && label[2] === 1){
						data.push({"district":lines.District,"rate":lines[id[2]]});
					}
					else if(lines.Area === 'NEW TERRITORIES WEST' && label[3] === 1){
						data.push({"district":lines.District,"rate":lines[id[3]]});
					}
					else if(lines.Area === 'NEW TERRITORIES EAST' && label[4] === 1){
						data.push({"district":lines.District,"rate":lines[id[4]]});
					}
				})
				console.log(data);

				let center;
				let longitude = 0, latitude = 0;
				let n = 0;

				data.forEach(node => {
					longitude = 0; latitude = 0; n = 0
					features.forEach(d1 => {
						if(d1.properties.name === node.district){
							if(d1.geometry.type === "MultiPolygon"){
								d1.geometry.coordinates.forEach(coo => {
									coo[0].forEach(ll => {
										longitude += +ll[0];
										latitude += +ll[1];
									})
									n += coo[0].length;			
								})
							}
							else{
								d1.geometry.coordinates[0].forEach(coo => {
									longitude += +coo[0];
									latitude += +coo[1];
								});
								n = d1.geometry.coordinates[0].length;	
							} 								
							center = [longitude/n, latitude/n];
							selection.selectAll('.votes').data([null])
									.enter()
									.append('circle')
									.attr('cx', d => {
										return projection(center)[0];
									})
									.attr('cy',d => {
										return projection(center)[1];
									})
									.attr("fill", d => colorScaleRectParties(selectedParty))
									.attr('r', d => {
										let tmp = node.rate.split('%')[0];
										return radius(+tmp);
									})
									.attr('opacity',0.8)
									.attr('stroke',"white");
						}						
					})					
				})
			})	
		}
	}
	render();
	
} 