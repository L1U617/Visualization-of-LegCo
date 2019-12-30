export const loadCoordinates = () =>
	Promise
		.all([
			d3.json('data/hkmap.json'),
			d3.json('data/ElectionResult.json')
			])
		.then(([mapData, electionResult]) =>{
		return [mapData, electionResult];
		})	