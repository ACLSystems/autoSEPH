const axios = require('axios');
//const exc2js = require('node-excel-to-json');

const server = 'https://apiadmin.sloppy.zone';
const muir = '/api/v1/admin/group/moveroster';

const usera = process.argv[2];
const userb = process.argv[3];
const group = process.argv[4];

const beginTime = new Date();

async function getResponse(options) {
	try {
		let response = await axios(options);
		return response;
	} catch (err) {
		console.log('Error!!!');//eslint-disable-line
		console.log(options);//eslint-disable-line
		console.log(err.response.status);//eslint-disable-line
		console.log(err.response.data);//eslint-disable-line
	}
}

async function init() {
	var response;
	console.log(`Mover roster de usuario ${usera} a usuario ${userb} del grupo ${group}`);//eslint-disable-line
	var options = {
		method: 'put',
		url: server + muir,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			usera: usera,
			userb: userb,
			group: group
		}
	};
	response = await getResponse(options);
	if(response.data.message === 'Grupo y Roster modificados') {
		console.log(`Movimiento exitoso`);//eslint-disable-line
	} else {
		console.log(`Algo no salió como debiera: ${response}`);//eslint-disable-line
	}
	const endTime = new Date();
	const diffTime = (endTime - beginTime)/1000;
	console.log(`${diffTime} segundos`);//eslint-disable-line
}

init();
