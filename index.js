const axios = require('axios');
const exc2js = require('node-excel-to-json');

const server = 'https://apiadmin.sloppy.zone';
const muir = '/api/v1/requester/user/muir';
const getou = '/api/v1/admin/orgunit/get';
const getDetails = '/api/v1/supervisor/user/getdetails';
const getCourse = '/api/v1/author/course/get';
const createGroup = '/api/v1/instructor/group/create';
const userRoles = '/api/v1/admin/user/getroles';
const setRoles = '/api/v1/admin/user/setroles';
const saveDates = '/api/v1/instructor/group/savedates';
const modifyGroup = '/api/v1/instructor/group/modify';
const createRoster = '/api/v1/instructor/group/createroster';
const listRoster = '/api/v1/instructor/group/listroster';

const myFile = process.argv[2];
const instructorName = process.argv[3];
const instructorEnrol = process.argv[4] || false;
const iniParam = {
	beginDate : '2019-06-18 00:00',
	endDate : '2019-07-02 23:59',
	minGrade: 70,
	minTrack: 60
};
const beginTime = new Date();

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

function askUser(query) {
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise(resolve => rl.question(query, ans => {
		rl.close();
		resolve(ans);
	}));
}

async function init(users) {
	var usersID =  [];
	var response;
	// Conseguir los ids de los usuarios ( usando MUIR si no están registrados los registra)
	console.log('Objetivo : ' + users.length + ' usuarios');//eslint-disable-line
	var options = {
		method: 'post',
		url: server + muir,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		}
	};
	for (let index=0; index < users.length; index++) {
		options.data = users[index];
		response = await getResponse(options);
		usersID.push(response.data.userid);
	}
	//});
	console.log('Respuesta: '+ usersID.length + ' usuarios');//eslint-disable-line

	// ahora conseguir el ID de la OU... esa viene en el char2 de cualquiere alumno
	var ou = users[0].char2;
	options = {
		method: 'get',
		url: server + getou,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			ou: ou
		}
	};
	response = await getResponse(options);
	var ouid = response.data.message._id;
	console.log(`OU: ${ou}`);//eslint-disable-line
	console.log(`ouid: ${ouid}`);//eslint-disable-line

	//ahora conseguir el id del instructor
	options = {
		method: 'get',
		url: server + getDetails,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			username: instructorName
		}
	};
	response = await getResponse(options);
	var instructorid = response.data.userid;
	// y sus roles
	options = {
		method: 'get',
		url: server + userRoles,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			name: instructorName
		}
	};
	response = await getResponse(options);
	const isInstructor = response.data.message.roles.isInstructor;
	if(instructorEnrol) {
		usersID.push(instructorid);
		console.log('Agregando al instructor al grupo');//eslint-disable-line
	}
	if(!isInstructor) {
		var putData = {
			name: instructorName,
			roles: {
				isAdmin: false,
				isBusiness: false,
				isOrg: false,
				isOrgContent: false,
				isAuthor: false,
				isInstructor: true,
				isSupervisor: false
			}
		};
		options = {
			method: 'put',
			url: server + setRoles,
			headers: {
				'x-access-token': process.env.ALUMNO_TOKEN,
				'Content-Type': 'application/json'
			},
			data: putData
		};
		console.log('Otorgando roles de instructor');//eslint-disable-line
		response = await getResponse(options);
	}
	console.log(`Instructor: ${instructorName}`);//eslint-disable-line
	console.log(`Instructor ID: ${instructorid}`);//eslint-disable-line

	// Para detener el proceso y recuperar los usuarios
	// console.log(usersID);//eslint-disable-line
	// const endTime = new Date();
	// const diffTime = (endTime - beginTime)/1000;
	// console.log(`${endTime}`);//eslint-disable-line
	// console.log(`${diffTime} segundos`);//eslint-disable-line
	// process.exit(0);

	// conseguir el curso... viene en el char1 de cualquier
	const tempArray = users[0].char1.split('-');
	const consecutive = tempArray.slice(-1).join();
	var courseCode = tempArray.slice(0,-1).join('-');
	options = {
		method: 'get',
		url: server + getCourse,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			code: courseCode
		}
	};
	response = await getResponse(options);
	var courseName = response.data.message.title;
	var courseid = response.data.message.id;
	var courseStatus = response.data.message.status;
	if(courseStatus !== 'published'){
		const answer = await askUser('El curso '+ courseCode +' no está publicado. Quieres seguir? (y/N)');
		if(answer !== 'y') {
			process.exit(0);
		}
	}
	console.log(`Consecutivo: ${consecutive}`);//eslint-disable-line
	console.log(`Código de curso: ${courseCode}`);//eslint-disable-line
	console.log(`Nombre de curso: ${courseName}`);//eslint-disable-line
	console.log(`Estatus de curso: ${courseStatus}`);//eslint-disable-line

	// Crear el grupo...
	var postData = {
		code: `${courseCode}-${ou}-${consecutive}`,
		name: `${courseName}-${ou}-${consecutive}`,
		course: courseid,
		org: 'conalep',
		orgUnit: ouid,
		instructor: instructorid,
		beginDate: iniParam.beginDate,
		endDate: iniParam.endDate,
		minGrade: iniParam.minGrade,
		minTrack: iniParam.minTrack,
		type: 'tutor'
	};
	console.log('Creando grupo con la siguiente información:');//eslint-disable-line
	console.log(postData);//eslint-disable-line
	options = {
		method: 'post',
		url: server + createGroup,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN,
			'Content-Type': 'application/json'
		},
		data: postData
	};
	response = await getResponse(options);
	if(response.data.message !== 'Group created') {
		console.log(`GRUPO ${users[0].char1} NO CREADO CORRECTAMENTE. PROCESO DETENIDO`);//eslint-disable-line
		console.log(response.data.message);//eslint-disable-line
		process.exit(0);
	}
	var groupid = response.data.group.id;
	var groupCode = response.data.group.code;
	var groupName = response.data.group.name;
	console.log(`Group id: ${groupid}`);//eslint-disable-line
	console.log(`Group code: ${groupCode}`);//eslint-disable-line
	console.log(`Group name: ${groupName}`);//eslint-disable-line

	// Agregar fechas a grupo
	var groupData = {
		'groupid': groupid,
		'dates': [
			{
				'beginDate': '2019-06-17T06:00:00.000Z',
				'endDate': '2019-06-18T06:00:00.000Z',
				'label': 'Inicia curso inducción de la plataforma',
				'type': 'general'
			},
			{
				'beginDate': '2019-06-19T06:00:00.000Z',
				'endDate': '2019-06-20T06:00:00.000Z',
				'label': 'Presentar Examen Diagnóstico',
				'type': 'exam'
			},
			{
				'beginDate': '2019-06-19T15:00:00.000Z',
				'endDate': '2019-06-21T23:00:00.000Z',
				'label': 'Inicia asistencia de tutores',
				'type': 'general'
			},
			{
				'beginDate': '2019-06-24T15:00:00.000Z',
				'endDate': '2019-06-28T23:00:00.000Z',
				'label': 'Asistencia de tutores',
				'type': 'general'
			},
			{
				'beginDate': '2019-07-01T15:00:00.000Z',
				'endDate': '2019-07-02T23:00:00.000Z',
				'label': 'Termina asistencia de tutores',
				'type': 'general'
			},
			{
				'beginDate': '2019-06-19T06:00:00.000Z',
				'endDate': '2019-06-23T06:00:00.000Z',
				'label': 'Primera mitad de trabajo del curso de capacitación',
				'type': 'general'
			},
			{
				'beginDate': '2019-06-22T06:00:00.000Z',
				'endDate': '2019-06-25T06:00:00.000Z',
				'label': 'Presentar Examen Intermedio',
				'type': 'exam'
			},
			{
				'beginDate': '2019-06-24T06:00:00.000Z',
				'endDate': '2019-06-30T06:00:00.000Z',
				'label': 'Segunda mitad de trabajo del curso de capacitación',
				'type': 'general'
			},
			{
				'beginDate': '2019-06-26T06:00:00.000Z',
				'endDate': '2019-06-30T06:00:00.000Z',
				'label': 'Presentar Examen Final',
				'type': 'exam'
			},
			{
				'beginDate': '2019-06-25T06:00:00.000Z',
				'endDate': '2019-06-28T06:00:00.000Z',
				'label': 'Presentar Actividad',
				'type': 'task'
			},
			{
				'beginDate': '2019-06-28T06:00:00.000Z',
				'endDate': '2019-06-28T06:00:00.000Z',
				'label': 'Constancia',
				'type': 'certificate'
			},
			{
				'beginDate': '2019-07-01T06:00:00.000Z',
				'endDate': '2019-07-02T06:00:00.000Z',
				'label': 'Días adicionales para trabajar en el curso',
				'type': 'general'
			},
			{
				'beginDate': '2019-07-01T06:00:00.000Z',
				'endDate': '2019-07-02T06:00:00.000Z',
				'label': 'Aclaración de calificaciones',
				'type': 'general'
			},
			{
				'beginDate': '2019-07-02T06:00:00.000Z',
				'endDate': '2019-07-02T06:00:00.000Z',
				'label': 'Terminan actividades en plataforma',
				'type': 'general'
			}
		]
	};
	options = {
		method: 'put',
		url: server + saveDates,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN,
			'Content-Type': 'application/json'
		},
		data: groupData
	};
	response = await getResponse(options);
	if(!response.data.message.includes('New dates in group')) {
		console.log(`GRUPO ${groupCode} NO SE LOGRO AGREGAR FECHAS. PROCESO DETENIDO`);//eslint-disable-line
		console.log(response.data.message);//eslint-disable-line
		process.exit(0);
	}
	console.log(`Fechas agregadas al grupo ${groupCode}`);//eslint-disable-line

	// Configurar grupo
	groupData = {
		groupid: groupid,
		status: 'active'
	};
	options = {
		method: 'put',
		url: server + modifyGroup,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN,
			'Content-Type': 'application/json'
		},
		data: groupData
	};
	response = await getResponse(options);
	if(!response.data.message.includes('modified')) {
		console.log(`GRUPO ${groupCode} NO SE LOGRO MODIFICAR GRUPO. PROCESO DETENIDO`);//eslint-disable-line
		console.log(response.data.message);//eslint-disable-line
		process.exit(0);
	}
	console.log(`Grupo ${groupCode} modificado`);//eslint-disable-line

	// Crear ROSTER
	groupData = {
		code: groupCode,
		roster: usersID,
		status: 'active'
	};
	options = {
		method: 'put',
		url: server + createRoster,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN,
			'Content-Type': 'application/json'
		},
		data: groupData
	};
	response = await getResponse(options);
	if(!response.data.message.includes('Roster created')) {
		console.log(`GRUPO ${users[0].char1} NO SE LOGRO ENROLAR AL GRUPO. PROCESO DETENIDO`);//eslint-disable-line
		console.log(response.data.message);//eslint-disable-line
		process.exit(0);
	}
	console.log(`Total roster: ${response.data.totalRoster}`);//eslint-disable-line

	// Listar ROSTER
	options = {
		method: 'get',
		url: server + listRoster,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			code: groupCode
		}
	};
	response = await getResponse(options);
	if(!response.data.status === 200) {
		console.log(`GRUPO ${users[0].char1} NO SE LOGRO LISTAR GRUPO. PROCESO DETENIDO`);//eslint-disable-line
		console.log(response.data.message);//eslint-disable-line
		process.exit(0);
	}
	console.log(`Total estudiantes: ${response.data.message.numStudents} active: ${response.data.message.totalActive}`);//eslint-disable-line
	console.log(`Proceso de generación de grupo ${groupCode} y enrolamiento exitoso`);//eslint-disable-line
	const endTime = new Date();
	const diffTime = (endTime - beginTime)/1000;
	console.log(`${endTime}`);//eslint-disable-line
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
		'sheetName': 'Sheet 1'
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
					if(!entry.motherName) {
						console.log(entry.name + ' ' + entry.fatherName + ' missing motherName value'); // eslint-disable-line
						return;
					}
					if(!entry.fatherName) {
						console.log(entry.email + ' missing fatherName value');// eslint-disable-line
						return;
					}
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
								fatherName: entry.fatherName.trim(),
								motherName: entry.motherName.trim(),
								email: entry.email.trim()
							},
							student: {
								type: entry.studentType,
								career: entry.career,
								term: entry.term,
								external: entry.external,
								origin: entry.origin,
								isActive: true
							},
							corporate: {
								id: entry.corpId,
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

	if(process.env.ALUMNO_TOKEN && instructorName){
		console.log(`${beginTime}`);//eslint-disable-line
		console.log(`Inicia proceso con archivo: ${myFile} y con instructor ${instructorName}`); //eslint-disable-line
		if(instructorEnrol){
			console.log('Se agregará al instructor como participante'); //eslint-disable-line
		}
		init(users);
	} else {
		console.log('no TOKEN / no instructor <== check');//eslint-disable-line
	}
}
