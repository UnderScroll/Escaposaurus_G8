<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_examplegamedata/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
		var introVideoPath = videoRoot+"introVideo/intro2.mp4" ;
		var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"udisk/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

		var udiskData =
	  	{"root":{
	  		"folders":
		  		[
				{"foldername":"Habillage des pingouins","password":"Aperture","sequence":0,
			  		"files":["Commande des pulls.jpg", "Billets voyage.jpg"]
			  	},
			  	{"foldername":"Photos des affreux", "password":"Bebou","sequence":1,
			  		"files":["B & C.png", "B & L.png", "La Bagarre.gif", "Veto Love.png"]
			  	},
                {"foldername":"Administratif", "password":"Bonnie&Clyde","sequence":2,
			  		"files":["Employés du mois.png"]
			  	},
                {"foldername":"Data biométrique", "password":"PLACEHOLDER","sequence":3,
			  		"files":[]
			  	}
		 		],
			"files":[
				"Mots_de_Passe.png", "Nouvel Arrivage.jpg", "Penguin Trombi.jpg"]}
		} ;

		var gameTitle = "Il faut sauver soldat Charlie" ;
		var gameDescriptionHome = "Seul dans le bureau de la Madame, le téléphone sonne, vite, il faut répondre!<br/>Le code source est téléchargeable sur <a href='https://github.com/UnderScroll/Escaposaurus_G8' target='_blank'>GitHub</a>" ;
		var gameMissionCall = "Voici la vidéo que la Madame vous a envoyée " ;
		var gameMissionAccept = "&raquo;&raquo; Ouvir le nordinateur de la Madame (JOUER) &laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>l'équipe 8 de la P20 JMIN" ;
		var gameThanks = "Remerciements : personne, on déteste tout le monde" ;

		var OSName = "PenguinOS (no, not Linux) 2.13- diskloaded: Charlie_Is_Lost"
		var explorerName = "USB DISK EXPLORER" ;
		var callerAppName = "CALL CONTACT" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "APPEL EN COURS..." ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Rien à demander, ne pas les déranger." ;
		var prompt = [] ;
		prompt[0] = " " ;
		prompt[1] = " " ;
		prompt[2] = " " ;
		prompt[3] = " " ;
		prompt[4] = " " ;

		/*when the sequence number reaches this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 4 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "" ; //The "noHint" here does not work
		seqMainHint[1] = "noHint" ;
		seqMainHint[2] = "noHint" ;
		seqMainHint[3] = "noHint" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name
		*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Don", "vod_folder" : "", "username" : "Don", "canal" : "video", "avatar" : "don_avatar.jpg"} ;
		normalContacts[1] = {"vid" : "Maurice", "vod_folder" : "", "username" : "Maurice", "canal" : "video", "avatar" : "maurice_avatar.jpg"} ;

		/*second part of the list, contact that can help the player*/
		var helperContacts = [] ;
		helperContacts[0] = {"vid" : "Veto", "vod_folder" : "", "username" : "Veto", "canal" : "txt", "avatar" : "veto.png", "bigAvatar" : "vetobig.png"} ;


		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Charlie a été retrouvé!" ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "VetoEnd", "vod_folder" : "","username" : "Veto",  "canal" : "video", "avatar" : "veto.jpg"} ;

		/*The Veto only sends text messages, they are stored here*/
		var tips = {} ;
		tips['Veto'] = [] ;
		tips['Veto'][0] = "Je peux pas répondre à ton appel. Mais je peux te répondre par écrit.<br/>Tu veux déverrouiller l'identificateur pour retrouver charlie ? Je ne connais pas son identifiant mais tu devrais pouvoir trouver une liste avec les ID de tout le monde dans un des dossier..." ;
		tips['Veto'][1] = "" ;
		tips['Veto'][2] = "" ;
		tips['Veto'][3] = "" ;


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé Charlie! Direction le bain pour lui et un repos bien mértié pour vous!" ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si Charlie a été secouru, le jeu est fini, bravo!" ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;