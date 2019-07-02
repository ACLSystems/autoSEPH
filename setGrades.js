// Script para setear calificaciones y liberar constancias

const axios = require('axios');

const server = 'https://apiadmin.sloppy.zone';
const listRoster = '/api/v1/supervisor/group/listroster';
const setGrades = '/api/v1/instructor/group/gradetask';
const releaseCert = '/api/v1/instructor/group/releasecert';

const groupCode = process.argv[2];
const beginTime = new Date();
const blockid = '5d0ac13df36149001726d6c4';
const taskid = '5d16539c938eb70017cc9986';
const grade = 100;

if(!groupCode) {
	console.log('Hace falta el código de grupo'); // eslint-disable-line
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
		url: server + listRoster,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			code: groupCode
		}
	};
	var response;
	response = await getResponse(options);
	if(response &&
		response.data &&
		response.data.message &&
		response.data.message.students &&
		Array.isArray(response.data.message.students) &&
		response.data.message.students.length > 0
	) {
		var students = response.data.message.students;
		var rosters = [];
		for(var i = 0; i < students.length; i ++) {
			if(students[i].grades &&
				Array.isArray(students[i].grades) &&
				students[i].grades.length > 0) {
				if(students[i].grades[0] &&
				students[i].grades[0].blockid + '' === blockid + '',
				students[i].grades[0].taskDelivered) {
					options = {
						method: 'put',
						url: server + setGrades,
						headers: {
							'x-access-token': process.env.ALUMNO_TOKEN
						},
						data : {
							rosterid 	: students[i].rosterid,
							blockid		: blockid,
							taskid		: taskid,
							grade			: grade
						}
					};
					console.log(`${students[i].useremail}`);//eslint-disable-line
					response = await getResponse(options);
					rosters.push(students[i].rosterid);
				}
			}
		}
		options = {
			method: 'put',
			url: server + releaseCert,
			headers: {
				'x-access-token': process.env.ALUMNO_TOKEN
			},
			data : {
				rosters 	: rosters
			}
		};
		response = await getResponse(options);
	}
	console.log(`Proceso de calificación de actividades en ${groupCode} y liberación de constancias exitoso`);//eslint-disable-line
	console.log(`Liberadas ${rosters.length} constancias`);//eslint-disable-line
	const endTime = new Date();
	const diffTime = (endTime - beginTime)/1000;
	console.log(`${endTime}`);//eslint-disable-line
	console.log(`${diffTime} segundos`);//eslint-disable-line
}

if(process.env.ALUMNO_TOKEN){
	console.log(`${beginTime}`);//eslint-disable-line
	console.log(`Inicia proceso con grupo ${groupCode}`); //eslint-disable-line
	init();
} else {
	console.log('no hay token');//eslint-disable-line
}
