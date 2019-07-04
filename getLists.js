const axios = require('axios');
const xlsx = require('xlsx');

const server = 'https://apiadmin.sloppy.zone';
const gradesByGroup = '/api/v1/supervisor/report/gradesbygroup';
const orgTree = '/api/v1/supervisor/report/orgtree';

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

async function init(){
	var options = {
		method: 'get',
		url: server + orgTree,
		headers: {
			'x-access-token': process.env.ALUMNO_TOKEN
		},
		params: {
			project: '5d07d5a4707be10017e695b9'
		}
	};
	var response;
	var groups;
	response = await getResponse(options);
	if(response.data && response.data.tree && response.data.tree.groups) {
		groups = response.data.tree.groups;
		console.log('Tenemos orgTree'); //eslint-disable-line
	}
	if(Array.isArray(groups) && groups.length >0) {
		let headersXlsx = [];
		headersXlsx.push('Curso');
		headersXlsx.push('Grupo');
		headersXlsx.push('RFC');
		headersXlsx.push('Apellido Paterno');
		headersXlsx.push('Apellido Materno');
		headersXlsx.push('Nombre');
		headersXlsx.push('Correo electrónico');
		headersXlsx.push('Avance del curso');
		headersXlsx.push('Evaluación diagnóstica');
		headersXlsx.push('Evaluación intermedia');
		headersXlsx.push('Evaluación final');
		headersXlsx.push('Actividad adicional');
		headersXlsx.push('Calificación final');
		headersXlsx.push('Fecha de término');
		let archivoXlsx = [];
		archivoXlsx.push(headersXlsx);
		for(var i=0; i< groups.length; i++) {
			let lista;
			options = {
				method: 'get',
				url: server + gradesByGroup,
				headers: {
					'x-access-token': process.env.ALUMNO_TOKEN
				},
				params: {
					groupid: groups[i].groupId
				}
			};
			response = await getResponse(options);
			if(response.data) {
				lista = response.data;
			}
			console.log(lista.groupCode); //eslint-disable-line
			if(lista.roster && Array.isArray(lista.roster) && lista.roster.length > 0) {
				for(var j=0; j<lista.roster.length; j++) {
					let tempArray = [];
					tempArray.push(
						lista.course,
						lista.groupCode,
						lista.roster[j].RFC,
						lista.roster[j].fatherName,
						lista.roster[j].motherName,
						lista.roster[j].name,
						lista.roster[j].email,
						lista.roster[j].track
					);
					for(var k=0; k<lista.roster[j].grades.length; k++) {
						tempArray.push(lista.roster[j].grades[k].blockGrade.toFixed(2));
					}
					tempArray.push(lista.roster[j].finalGrade.toFixed(2));
					tempArray.push(lista.endDateSpa);
					archivoXlsx.push(tempArray);
				}
				const ws = xlsx.utils.aoa_to_sheet(archivoXlsx);
				const wb = xlsx.utils.book_new();
				xlsx.utils.book_append_sheet(wb,ws,'SEPH-2019');
				xlsx.writeFile(wb, 'seph-2019.xlsx');
			}
		}
	}
	console.log('Archivo seph-2019.xlsx'); //eslint-disable-line
}

init();
