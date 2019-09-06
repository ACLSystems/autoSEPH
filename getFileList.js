const axios = require('axios');
const xlsx = require('xlsx');
const fs	 = require('fs');

if(!process.env.ALUMNO_TOKEN) {
	console.log('No hay token!!');
	process.exit(0);
}

const server = 'http://localhost:3050';
const getGroup = '/api/v1/instructor/group/get';
const getFileList = '/api/v1/supervisor/group/getfilelist';

const pathTree = process.argv[2];

const exceptions = ['IA-101','este','.DS_Store'];


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


function readdirAsync(path) {
	return new Promise(function (resolve, reject) {
		fs.readdir(path, function (error, result) {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}



async function init(){
	var options = {};
	var dirs = await readdirAsync(pathTree);
	if(dirs && Array.isArray(dirs) && dirs.length > 0) {
		// quitamos los directorios de excepción
		exceptions.forEach(exc => {
			let findDir = dirs.findIndex(dir => dir === exc);
			if(findDir > -1) {
				//console.log(findDir); //eslint-disable-line
				dirs.splice(findDir,1);
			}
		});
		for(var i=0; i<dirs.length; i++) {
			// Ahora vamos por cada grupo
			console.log(`Directorio ${i + 1}: ${dirs[i]}`); //eslint-disable-line
			var groups = await readdirAsync(pathTree + dirs[i]);
			for(var j=0; j<groups.length; j++) {
				options = {
					method: 'get',
					url: server + getGroup,
					headers: {
						'x-access-token': process.env.ALUMNO_TOKEN
					},
					params: {
						groupcode: groups[j]
					}
				};
				let response = await getResponse(options);
				if(response.data && response.data.message && response.data.message.code) {
					//console.log(response.data.message.code); //eslint-disable-line
					//console.log(response.data.message._id); //eslint-disable-line
					let id = response.data.message._id;
					//let code = response.data.message.code;
					options = {
						method: 'get',
						url: server + getFileList,
						headers: {
							'x-access-token': process.env.ALUMNO_TOKEN
						},
						params: {
							groupid: id
						}
					};
					let response2 = await getResponse(options);
					if(response2 && response2.data && response2.data.groupName) {
						console.log(response2.data.groupName); //eslint-disable-line
						var data = response2.data.message;
						let headersXlsx = [];
						headersXlsx.push('Nombre');
						headersXlsx.push('Apellido Paterno');
						headersXlsx.push('Apellido Materno');
						headersXlsx.push('RFC');
						headersXlsx.push('Correo electrónico');
						headersXlsx.push('Nombre del archivo');
						headersXlsx.push('ID del archivo');
						headersXlsx.push('Tamaño del archivo');
						let archivoXlsx = [];
						archivoXlsx.push(headersXlsx);

						for(var l=0;l<data.length; l++) {
							let tempArray = [];
							tempArray.push(
								data[l].name,
								data[l].fatherName,
								data[l].motherName,
								data[l].RFC,
								data[l].email,
								data[l].fileName,
								data[l].fileId,
								data[l].fileSize
							);
							archivoXlsx.push(tempArray);
						}
						const ws = xlsx.utils.aoa_to_sheet(archivoXlsx);
						const wb = xlsx.utils.book_new();
						xlsx.utils.book_append_sheet(wb,ws,'SEPH-2019');
						xlsx.writeFile(wb, pathTree + '/' + dirs[i] + '/' + groups[j] + '/relacion_alumno-archivo.xlsx');
					}
				}
			}
			console.log(`${groups.length} grupos`); //eslint-disable-line
		}

	} else {
		return [];
		console.log('No hay archivos para trabajar'); //eslint-disable-line
	}
}

init();
