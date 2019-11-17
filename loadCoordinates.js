export const loadCoordinates = () =>{
	const data = d3.json('hkmap.json');
	return data;
}
