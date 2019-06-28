const axios = require('axios');

const server = 'https://apiadmin.sloppy.zone';
const apiBlock = '/api/v1/supervisor/user/getdetails';

const username = process.argv[2];

if(!username) {
	console.log('Falta usuario');//eslint-disable-line
	process.exit(0);
}

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
		method: 'get',
		url: server + apiBlock,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN,
			'Content-Type': 'application/json'
		},
		params: {username: username}
	};
	const response = await getResponse(options);
	if(response.status >= 500) {
		console.log(`Error de sistema ${response.status}`); // eslint-disable-line
		console.log(`Error de sistema ${response.data.message}`); // eslint-disable-line
	} else {
		if(response.data.username){
			console.log('YA existe: ' + response.data.username); // eslint-disable-line
		} else {
			console.log('NO existe: ' + username); // eslint-disable-line
		}
	}
}
init();
