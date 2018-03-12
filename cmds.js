const model = require('./model');
const {log, biglog, errorlog, colorize} = require('./out');


exports.helpCmd = rl => {
		log("Comandos:");
		log("h|help - Muestra esta ayuda");
		log("List - Listar los quizzes existentes.");
		log("show <id> - Muestra la pregunta y la respuesta del quiz indicado");
		log("add - Añadir un nuevo quiz interactivamente");
		log("delete <id> - Borrar el quiz indicado");
		log("edit <id> - Editar el quiz indicado");
		log("test <id> - Probar el quiz indicado");
		log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes");
		log("credits - Créditos");
		log("q|quit - Salir del programa");
		rl.prompt();
};

exports.addCmd = rl => {

		rl.question(colorize('Introduzca una pregunta:', 'red'), question => {

			rl.question(colorize('Introduzca la respuesta', 'red'), answer => {

				model.add(question, answer);
				log(`[${colorize('Se ha añadido','magenta')}]: ${question} ${colorize('=>','magenta')}${answer}`);
				rl.prompt();
			});
		});
		
		
};
exports.editCmd =(rl,id) => {
		if(typeof id === "undefined"){
			errorlog('Falta el parametro id');
			rl.prompt();
		} else {
			try{

				process.stdout.isTTY && setTimeout( () => {rl.write(id.question)},0);
				
				rl.question(colorize('Introduzca una pregunta:', 'red'), question => {
					
					process.stdout.isTTY && setTimeout( () => {rl.write(id.answer)},0);
					rl.question(colorize('Introduzca la respuesta', 'red'), answer => {

						model.update(id, question, answer);
						log(`[${colorize('Se ha añadido','magenta')}]: ${question} ${colorize('=>','magenta')}${answer}`);
						rl.prompt();
					})
				})
			}catch(error){
				errorlog(error.message);
				rl.prompt();
			}
		}
		rl.prompt();
};

exports.quitCmd = rl => {
		rl.close();
		rl.prompt();

};

exports.listCmd = rl => {
		model.getAll().forEach((quiz,id)=> {

			log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
		});
		rl.prompt();
};

exports.showCmd = (rl,id)  => {
		if(typeof id === "undefined"){
		throw new Error('Falta el parametro id');
		} else {
			try{
				const quiz = model.getByIndex(id);
				log(`[${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
			}catch(error){
				errorlog(error.message);
			}
		}


		rl.prompt();
};
exports.testCmd = (rl,id)  => {
		
		if(typeof id === "undefined"){
			errorlog('Falta el parametro id');
			rl.prompt();
			} else {
				try{
					const quiz = model.getByIndex(id);

					console.log(colorize(`${quiz.question}`, 'red'));
					rl.question('Respuesta:', resp => {

						if(resp === quiz.answer){
							biglog('correcto');
						}else{
							biglog('incorrecto');
						}
					rl.prompt();
					});
					rl.prompt();					
					}catch(error){
						errorlog(error.message);
						rl.prompt();
					}
				}

};

exports.playCmd = rl => {

		let score = 0;
		let toBeResolved = [];
		var total = model.count();

		for(let i=0; i< model.count(); i++){
			toBeResolved[i]= i;
		}

		const playOne = () => {
			if(total === 0){
				log(`Fin del juego. Aciertos: ${score}`);
				biglog(score, 'magenta');
				rl.prompt();
			}else{
				let aleatorio = Math.random()*toBeResolved.lenght;
				let id = (Math.floor(aleatorio));

				var preg = toBeResolved[id];
				const quiz = model.getByIndex(id);

				rl.question (console.log(colorize(`${quiz.question}: `, 'red')), answer =>{

					var respuesta = quiz.answer.trim().toLowerCase();
					var answer_quiz = answer.trim().toLowerCase();

					if(respuesta === answer_quiz){
						score++;
						log(`CORRECTO - Lleva ${score} aciertos`);
						biglog('correcta', 'green');
						toBeResolved.splice(id, 1);
						totalP--;
						playOne();
						rl.prompt();
					}else{
						log(`INCORRECTO`);
						biglog('incorrecto', 'red');
						rl.prompt();
					}
				});
			}
		}
		playOne();		
};

exports.deleteCmd = (rl, id)  => {
		if(typeof id === "undefined"){
		throw new Error('Falta el parametro id');
		} else {
			try{
				model.deleteByIndex(id);
				rl.prompt();
				
			}catch(error){
				errorlog(error.message);
				rl.prompt();
			}
		}
		

};
exports.creditsCmd = rl => {
		log('Autores:');
		log('Natalia Garcia');
		log('Ignacio Arregui');
		rl.prompt();

};
