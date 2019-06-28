const axios = require('axios');

const server = 'https://apiadmin.sloppy.zone';
const apiBlock = '/api/v1/admin/group/addblockdates';

const groupCode = process.argv[2];
const blockid1 = process.argv[3]; // evaluación intermedia
const blockid2 = process.argv[4]; // actividad
const blockid3 = process.argv[5]; // evaluación final

if(!groupCode) {
	console.log('Falta código de grupo');//eslint-disable-line
	process.exit(0);
}
if(!blockid1 && !blockid2 && !blockid3) {
	console.log('Faltan datos de bloques');//eslint-disable-line
	process.exit(0);
}
const data = {
	code: groupCode,
	blockDates: [
		{
			block: blockid1,
			date: '2019-06-22 00:00'
		},
		{
			block: blockid2,
			date: '2019-06-26 00:00'
		},
		{
			block: blockid3,
			date: '2019-06-26 00:00'
		}
	]
};

async function getResponse(options) {
	try {
		let response = await axios(options);
		//console.log(response.data.userid);//eslint-disable-line
		return response;
	} catch (err) {
		console.log('Error!!!');//eslint-disable-line
		console.log(err.response.status);//eslint-disable-line
		console.log(err.response.data);//eslint-disable-line
	}
}

async function init() {
	var options = {
		method: 'put',
		url: server + apiBlock,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN,
			'Content-Type': 'application/json'
		},
		data: data
	};
	const response = await getResponse(options);
	if(response.status >= 500) {
		console.log(`Error de sistema ${response.status}`); // eslint-disable-line
		console.log(`Error de sistema ${response.data.message}`); // eslint-disable-line
	} else if(response.data.message === 'Grupo guardado') {
		console.log(`Grupo ${groupCode} modificado correctamente`); // eslint-disable-line
	}
}

init();
