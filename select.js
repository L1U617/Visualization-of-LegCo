export const showSelectedDistrict = (selection, props) => {
	const {
		features,
		width,
		height,
		colorScale,
		colorValue,
		selectedDistrict,
		onClick
	} = props;
	const dMap = {"North": 14, "Yuen Long": 11, "Tuen Mun":10, "Tai Po":15,
					"Sha Tin": 17, "Tsuen Wan": 9, "Kwai Tsing": 12, "Sham Shui Po":5,
					"Yau Tsim Mong": 4, "Kowloon City":6, "Wong Tai Sin": 7, "Kwen Tong": 8,
					"Sai Kung":16, "Central and Western":0, "Wan Chai":1, "Eastern": 2,
					"Southern":3, "Islands":13};
	const scaleUp = {"North": 100000, "Yuen Long": 125000, "Tuen Mun":150000, "Tai Po":120000,
					"Sha Tin": 140000, "Tsuen Wan": 145000, "Kwai Tsing": 370000, "Sham Shui Po":400000,
					"Yau Tsim Mong": 400000, "Kowloon City":395000, "Wong Tai Sin": 400000, "Kwen Tong": 195000,
					"Sai Kung":130000, "Central and Western":395000, "Wan Chai":400000, "Eastern": 380000,
					"Southern":140000, "Islands":90000};

	const cMap = [
	["WONG CHI HIM","LAU GAR HUNG CHRISTOPHER", "IP LAU SUK YEE REGINA","HO SAU LAN CYD",
	"CHEUNG KWOK KWAN","CHIM PUI CHUNG","CHENG KAM MUN","LAW KWUN CHUNG", "SHUM CHEE CHIU",
	"WONG WAI KAY","CHUI CHI KIN","ZIMMERMAN PAULUS JOHANNES","HUI CHI FUNG", "CHAN TANYA","LUI HUNG PAN"],
	["NG MAN YUEN AVERY","HO CHI KWONG JONATHAN","MO MAN CHING CLAUDIA","LEUNG MEI FUN","TAM KWOK KIU",
	"MAIN LAND CHU", "WONG YUK MAN", "WONG PIK WAN", "LAM YI LAI","CHIANG LAI WAN","KWAN SAN WAI",
	"LAU SIU LAI","YAU WAI CHING","LEE WING HON AUGUSTINE", "TIK CHI YUEN"],
	["WONG KWOK KIN","WU SUI SHAN","KO TAT PUN PATRICK","TAM HEUNG MAN","TSE WAI CHUN PAUL",
	"OR CHONG SHING WILSON","LUI WING KEI","WU CHI WAI","TAM MAN HO JEREMY JANSEN","WONG YEUNG TAT",
	"CHAN CHAK TO","TAM TAK CHI"],
	["WONG YUN TAT","WAN SIU KIN ANDREW","KO CHI FAI","CHOW WING KAN","CHENG CHUNG TAI",
	"KWONG KOON WAN","TIEN MICHAEL PUK SUN","HO KWAN YIU","LEUNG CHE CHEUNG","KWOK KA KI",
	"WONG HO MING","LEE CHEUK YAN","WONG CHUN KIT","MAK MEI KUEN ALICE","FUNG KIN KEE FREDERICK",
	"CHAN HAN PAN","CHEUNG WAI CHING CLARICE","LUI CHI HANG HENDRICK","TONG WING CHI","CHU HOI DICK EDDIE"],
	["FONG KWOK SHAN CHRISTINE","LAM CHEUK TING","LIU TIN SHING","CHIN WAN KAN","LEUNG KWOK HUNG",
	"CHEUNG CHIU HUNG","YEUNG ALVIN NGOK KIU","MAK KA CHUN RAYMOND","CHENG KAR FOO ANDREW","QUAT ELIZABETH",
	"HAU CHI KEUNG","LEE TSZ KING DOMINIC","TANG KA PIU","FAN GARY KWOK WAI","CHAN YUK NGOR ESTELLA",
	"WONG SUM YU","LEE SEE YIN LETICIA","CHAN CHI CHUEN RAYMOND","LEUNG CHUNG HANG SIXTUS","LEUNG KAM SHING CLARENCE RONALD",
	"YUNG HOI YAN","CHAN HAK KAN"]
	];

	let name;
	let tmp = dMap[selectedDistrict];
	if(tmp >=0 && tmp <=3) name = cMap[0];
	else if(tmp >=4 && tmp <=6) name = cMap[1];
	else if(tmp >=7 && tmp <=8) name = cMap[2];
	else if(tmp >=9 && tmp <=13) name = cMap[3];
	else if(tmp >=14 && tmp <=17) name = cMap[4];

	var top3_candidate = []
	var top10station =[]// 2D array
	var top10station_1 = []
	var top10station_2 = []
	var top10station_3 = []

	//define map properties
	let district;
	let center;
	features.forEach( d => {
		if(d.properties.name === selectedDistrict)
			district = d;
		}
	);
	let coordinates;
	let longitude = 0, latitude = 0;
	let n = 0;

	if(district.geometry.type === "MultiPolygon"){
		district.geometry.coordinates.forEach(d => {
			d[0].forEach(d2 => {
				longitude += +d2[0];
				latitude += +d2[1];
			})
			n += d[0].length;			
		})
	}
	else{
		district.geometry.coordinates[0].forEach(d => {
			longitude += +d[0];
			latitude += +d[1];
		});
		n = district.geometry.coordinates[0].length;	
	} 
	center = [longitude/n, latitude/n];
	const scale = scaleUp[district.properties.name];

	//prepare data
	function compare(a, b) {
   		return b - a;
	}

	function compare(arg) {
    	return function(a, b) {
        	return a[arg] - b[arg];
    	}
	}	

	let arr_name=[];
	arr_name.push("hkmap_liling/cities1_dis1.csv")//0
	arr_name.push("hkmap_liling/cities1_dis2.csv")
	arr_name.push("hkmap_liling/cities1_dis3.csv")
	arr_name.push("hkmap_liling/cities1_dis4.csv")
	arr_name.push("hkmap_liling/cities2_dis1.csv")//4
	arr_name.push("hkmap_liling/cities2_dis2.csv")
	arr_name.push("hkmap_liling/cities2_dis3.csv")
	arr_name.push("hkmap_liling/cities3_dis1.csv")
	arr_name.push("hkmap_liling/cities3_dis2.csv")//8
	arr_name.push("hkmap_liling/cities4_dis1.csv")
	arr_name.push("hkmap_liling/cities4_dis2.csv")
	arr_name.push("hkmap_liling/cities4_dis3.csv")
	arr_name.push("hkmap_liling/cities4_dis4.csv")//12
	arr_name.push("hkmap_liling/cities4_dis5.csv")
	arr_name.push("hkmap_liling/cities5_dis1.csv")
	arr_name.push("hkmap_liling/cities5_dis2.csv")
	arr_name.push("hkmap_liling/cities5_dis3.csv")//16
	arr_name.push("hkmap_liling/cities5_dis4.csv")

	

	d3.csv(arr_name[dMap[district.properties.name]]).then(data => {
		let votedataset = data;
		console.log(data);

		let pureVoteData = [];
		let list_sum = [];
		let arr_id = [];
		let id_votestation = {id:0};

		for(var i=0;i<22;i++)
		{        //Ò»Î¬³¤¶ÈÎª15, candidates
			pureVoteData[i] = new Array();
			list_sum.push({id:i, sum:0});
		}

		//var dataName = []
		//dataName = data.map(function(d) { return [ +parseInt(d.list1), +parseInt(d.list2),+parseInt(d.list3)]; }); m,n is transpose of pureVoteData					
		//console.log(dataName);


		//caculate sum and push to an new array
		for( var i=0; i < data.length; i++)
		{
			pureVoteData[0].push({'id':i, 'votes':parseInt(data[i].list1)});
			pureVoteData[1].push({'id':i, 'votes':parseInt(data[i].list2)});
			pureVoteData[2].push({'id':i, 'votes':parseInt(data[i].list3)});
			pureVoteData[3].push({'id':i, 'votes':parseInt(data[i].list4)});
			pureVoteData[4].push({'id':i, 'votes':parseInt(data[i].list5)});
			pureVoteData[5].push({'id':i, 'votes':parseInt(data[i].list6)});
			pureVoteData[6].push({'id':i, 'votes':parseInt(data[i].list7)});
			pureVoteData[7].push({'id':i, 'votes':parseInt(data[i].list8)});
			pureVoteData[8].push({'id':i, 'votes':parseInt(data[i].list9)});
			pureVoteData[9].push({'id':i, 'votes':parseInt(data[i].list10)});
			pureVoteData[10].push({'id':i, 'votes':parseInt(data[i].list11)});
			pureVoteData[11].push({'id':i, 'votes':parseInt(data[i].list12)});
			
			list_sum[0].sum+=pureVoteData[0][i].votes;
			list_sum[1].sum+=pureVoteData[1][i].votes;
			list_sum[2].sum+=pureVoteData[2][i].votes;
			list_sum[3].sum+=pureVoteData[3][i].votes;
			list_sum[4].sum+=pureVoteData[4][i].votes;
			list_sum[5].sum+=pureVoteData[5][i].votes;
			list_sum[6].sum+=pureVoteData[6][i].votes;
			list_sum[7].sum+=pureVoteData[7][i].votes;
			list_sum[8].sum+=pureVoteData[8][i].votes;
			list_sum[9].sum+=pureVoteData[9][i].votes;
			list_sum[10].sum+=pureVoteData[10][i].votes;
			list_sum[11].sum+=pureVoteData[11][i].votes;
			
			
			if(data[i].hasOwnProperty("list13"))
			{
				pureVoteData[12].push({'id':i, 'votes':parseInt(data[i].list13)});
				list_sum[12].sum+=pureVoteData[12][i].votes;							
			}
			if(data[i].hasOwnProperty("list14"))
			{
				pureVoteData[13].push({'id':i, 'votes':parseInt(data[i].list14)});
				list_sum[13].sum+=pureVoteData[13][i].votes;								
			}
			if(data[i].hasOwnProperty("list15"))
			{
				pureVoteData[14].push({'id':i, 'votes':parseInt(data[i].list15)});
				list_sum[14].sum+=pureVoteData[14][i].votes;
			}
			if(data[i].hasOwnProperty("list16"))
			{
				pureVoteData[15].push({'id':i, 'votes':parseInt(data[i].list15)});
				list_sum[15].sum+=pureVoteData[15][i].votes;
			}

			if(data[i].hasOwnProperty("list17"))
			{
				pureVoteData[16].push({'id':i, 'votes':parseInt(data[i].list13)});
				list_sum[16].sum+=pureVoteData[16][i].votes;							
			}
			if(data[i].hasOwnProperty("list18"))
			{
				pureVoteData[17].push({'id':i, 'votes':parseInt(data[i].list14)});
				list_sum[17].sum+=pureVoteData[17][i].votes;								
			}
			if(data[i].hasOwnProperty("list19"))
			{
				pureVoteData[18].push({'id':i, 'votes':parseInt(data[i].list15)});
				list_sum[18].sum+=pureVoteData[18][i].votes;
			}
			if(data[i].hasOwnProperty("list20"))
			{
				pureVoteData[19].push({'id':i, 'votes':parseInt(data[i].list15)});
				list_sum[19].sum+=pureVoteData[19][i].votes;
			}
			if(data[i].hasOwnProperty("list21"))
			{
				pureVoteData[20].push({'id':i, 'votes':parseInt(data[i].list15)});
				list_sum[20].sum+=pureVoteData[20][i].votes;
			}
			if(data[i].hasOwnProperty("list22"))
			{
				pureVoteData[21].push({'id':i, 'votes':parseInt(data[i].list15)});
				list_sum[21].sum+=pureVoteData[21][i].votes;
			}			

			arr_id.push({id:i});
		}

		//console.log(pureVoteData);
		
		//console.log(arr_id);

		//get first 3 votes candidates
		list_sum = list_sum.sort(compare('sum'));
		list_sum = list_sum.reverse().slice(0,3);


		let candidateData = []
		var station30 =[]
		for(var i= 0; i< list_sum.length; i++)
		{
			top3_candidate.push({"id":list_sum[i].id})

			candidateData = pureVoteData[list_sum[i].id];
			candidateData = candidateData.sort(compare('votes'));
			candidateData = candidateData.reverse().slice(0,10);
			//top 10 station

			for(var j= 0; j< 10; j++)
			{
				var staInd = candidateData[j].id; //station id

				station30.push({candidate:list_sum[i].id,code:data[staInd].Code, singleVote: candidateData[j].votes, lat:data[staInd].lat, long:data[staInd].long});
				//station30.push(data[candidateData[j].id])								
			}							
		}

		console.log(station30);
		top10station_1 = station30.slice(0,10);
		top10station_2 = station30.slice(10,20);
		top10station_3 = station30.slice(20,30);

		top10station.push(top10station_1);
		top10station.push(top10station_2);
		top10station.push(top10station_3);

		let selectedCandidate = null;
		const onClickCandidate = d => {
			selection.selectAll('*').remove();
			selectedCandidate = d;
			render();
		}
		
		const render = () =>{
			const backButtonG = selection.selectAll('.back').data([null])
										.enter()
										.append('g')
											.attr('class', 'back')
											.attr('transform', 
												`translate(${width/2 - 400}, ${height-200})`)
											.on('click', d => {
												onClick(null);
											});									
			backButtonG.append("rect")
						.attr('fill', '#EFECEA')
						.attr('opacity', 0.8)
						.attr('width', 80)
						.attr('height', 40)
						.attr('rx', 16);
			backButtonG.append('text')
						.text("Back")
						.attr('fill', 'black')
						.attr('font-size', '1.6em')
						.attr('y', 30)
						.attr('x', 15);

			/*---------------------*/
			const districtNameG = selection.selectAll('.name').data([null])
										.enter()
										.append('g')
											.attr('class', 'name')
											.attr('transform', 
												`translate(${width/2 - 500}, 100)`)							
			districtNameG.append("rect")
						.attr('fill', '#EFECEA')
						.attr('opacity', 0.8)
						.attr('width', 300)
						.attr('height', 50)
						.attr('rx', 16);
			districtNameG.append('text')
						.text(district.properties.name)
						.attr('fill', 'black')
						.attr('font-size', '2em')
						.attr('y', 30)
						.attr('x', 150)
						.attr('text-anchor', 'middle');

			/*----------draw map-----------*/
			const projection = 
				d3.geoMercator()
				  .center(center)
				  .scale(scale)
				  .translate([width / 2 - 300, height / 2]);
			const pathGenerator =
				d3.geoPath().projection(projection);

			/*const gUpdate = selection.selectAll('').data([null]);
			const gEnter = gUpdate.enter().append('g');
			const g = gUpdate.merge(gEnter);*/


			const districtPaths = selection.selectAll('.sDistrict').data([district]);
			const districtPathsEnter = districtPaths.enter()
										.append('path')
										.attr('class', 'sDistrict');
			districtPaths
				.merge(districtPathsEnter)
					.attr('d',pathGenerator)
					.attr('fill', d => colorScale(colorValue(d)));

			/*---------show top 3 candidates, 
			and provide with function of selection------------*/
			const circleRadius = 7;
			const textOffset = 13;
			const spacing = 25;
			const colorScaleCandidates = d3.scaleOrdinal()
								 .domain([0,1,2])
								 .range(["#E6842A", "#137B80", "#8E6C8A"]);

			selection.selectAll('.title').data([null])
					.enter()
						.append('text')
						.attr('class', 'title')
						.text("Top 3 Candidates in this district")
						.attr('fill', 'black')
						.attr('font-size', '1.5em')
						.attr("x", width/2 - 400)
						.attr("y", 180)
						.attr('text-anchor', 'middle')

			const candidates = selection.selectAll('.candidates').data(top3_candidate);
			const candidatesG = candidates.enter()
											  .append('g')
											  .attr('class', 'candidates')
											  .attr('transform', (d, i) =>
												`translate(${width/2 - 500}, ${200  + i * spacing})`)
											  .on('click', (d,i) => onClickCandidate(
											  	(i === selectedCandidate)
											  	? null
											  	: i
											  	));


			candidates
				.merge(candidatesG).append("circle")
				.attr('r', circleRadius)
				.attr('fill', (d,i) =>
					(selectedCandidate == i)
						? 'red'
						: colorScaleCandidates(i)
					);
			candidates
				.merge(candidatesG).append('text')
				.text(d => name[d.id])
				.attr('fill', (d,i) => 
					(selectedCandidate == i)
						? 'red'
						: colorScaleCandidates(i)
					)
				.attr('font-size', "1.3em")
				.attr('dy', "0.3em")
				.attr('x', textOffset);		

			if(selectedCandidate != null){
				selection.selectAll('.cs').data(top10station[selectedCandidate])
						.enter()
						.append("circle")
							.attr('class','cs')
							.attr("cx", function(d){
								return projection([d.long, d.lat])[0];
							})
							.attr("cy", function(d){
								return projection([d.long, d.lat])[1];
							})
							.attr("r", function(d){
								//return 3;//d.Total;//Math.sqrt()* 0.2
								return parseInt(d.singleVote)*0.01;
							})
							.attr('stroke', 'white')
							.style("fill", colorScaleCandidates(selectedCandidate))
							.style("opacity", 0.75);

			}
		}
	render();

	});
}