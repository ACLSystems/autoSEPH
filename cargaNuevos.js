const axios = require('axios');
const exc2js = require('node-excel-to-json');

const server = 'https://apiadmin.sloppy.zone';
const muir = '/api/v1/requester/user/muir';
//const createRoster = '/api/v1/instructor/group/createroster';

const myFile = process.argv[2];

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

async function init(users) {
	var response;
	console.log('Objetivo : ' + users.length + ' usuarios');//eslint-disable-line
	var options = {};

	for (let index=0; index < users.length; index++) {
		options = {
			method: 'post',
			url: server + muir,
			headers: {
				'x-access-token': process.env.ALUMNO_TOKEN
			},
			data : users[index]
		};
		console.log(`Usuario ${users[index].name} buscando...`); //eslint-disable-line
		response = await getResponse(options);
		console.log(response.data.message); //eslint-disable-line
		console.log(`ID usuario ${response.data.userid}`); //eslint-disable-line
		// const groupData = {
		// 	code: users[index].char1,
		// 	roster: [response.data.userid],
		// 	status: 'active'
		// };
		// options = {
		// 	method: 'put',
		// 	url: server + createRoster,
		// 	headers: {
		// 		'x-access-token': process.env.ALUMNO_TOKEN,
		// 		'Content-Type': 'application/json'
		// 	},
		// 	data: groupData
		// };
		// response = await getResponse(options);
		// console.log(response.data); //eslint-disable-line
		// if(!response.data.message.includes('Roster created')) {
		// 	console.log(`GRUPO ${users[0].char1} NO SE LOGRO ENROLAR AL GRUPO. PROCESO DETENIDO`);//eslint-disable-line
		// 	console.log(response.data.message);//eslint-disable-line
		// 	process.exit(0);
		// }
		console.log(`Total roster: ${response.data.totalRoster}`);//eslint-disable-line
	}
	//});
	console.log(users.length + ' usuarios creados');//eslint-disable-line

	const endTime = new Date();
	const diffTime = (endTime - beginTime)/1000;
	console.log(`${diffTime} segundos`);//eslint-disable-line
}

// extraer participantes desde el EXCEL
var users = [];

if(!myFile) {
	console.log('Archivo?'); //eslint-disable-line
} else {
	exc2js(myFile, {
		'convert_all_sheet': false,
		'return_type': 'Object',
		'sheetName': 'Sheet1'
	}, function(err, output){
		if(err) {
			console.log(err); // eslint-disable-line
		} else {
			var lista = [];
			if(output && output.length > 0 ) {
				output.forEach(function(entry) {
					entry.org 		= entry.org + '';
					entry.orgUnit = entry.orgUnit + '';
					entry.char1 	= entry.char1 + '';
					entry.char2		= entry.char2 + '';
					entry.password = entry.password + '';
					entry.email		= entry.email.trim();
					const regexPass = /\S+@\S+\.\S+/;
					let [fatherName, motherName] = entry.apellidos.split(' ');
					if(!entry.password) {
						console.log(entry.email + ' missing password value');// eslint-disable-line
						return;
					}
					if(regexPass.test(entry.email)) {
						var obj = {
							name: entry.email.trim(),
							org: entry.org.trim(),
							orgUnit: entry.orgUnit.trim(),
							char1: entry.char1.trim(),
							char2: entry.char2.trim(),
							password: entry.password,
							report: true,
							project: entry.project,
							workShift: entry.workShift,
							admin: {
								initialPassword: entry.password,
								adminCreate: true
							},
							person: {
								name: entry.name.trim(),
								fatherName: fatherName,
								motherName: motherName,
								email: entry.email.trim()
							},
							student: {
								type: entry.studentType,
								external: entry.external,
								origin: entry.origin,
								isActive: true
							},
							corporate: {
								type: entry.corpType
							}
						};
						const char 			= '?';
						const email 		= entry.email;
						if(email.includes(char)) {
							const index 		= email.indexOf(email);
							obj.person.email = (email.slice(index+1));
							obj.name = obj.person.email;
						}
						// obj.admin = JSON.stringify(obj.admin);
						// obj.person = JSON.stringify(obj.person);
						// obj.student = JSON.stringify(obj.student);
						// obj.corporate = JSON.stringify(obj.corporate);
					} else {
						console.log(entry.email + ' is not a valid email'); // eslint-disable-line
					}
					lista.push(obj);
				});
			} else {
				console.log('No users found or not Sheet found'); // eslint-disable-line
			}
			//console.log(lista[0]);// eslint-disable-line
			users = Array.from(lista);
		}
	});
	//console.log(users.length); //eslint-disable-line
	init(users);
}
