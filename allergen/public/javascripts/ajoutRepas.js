// Appel Ajax pour remplir le menu déroulant 
$.ajax({
  url: "http://localhost:3100/api/v1/listeAliments",
  dataType: "json",
  type: "GET",
  headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
  success: processSuccess,
  error: processError
});
 
function processSuccess(data) {
	$(document).ready(function(){
		for (var i = 0; i < data.length; i++){
			var alim = $("<option>").text(data[i].nom);
			$("#alim").append( alim );
			// On met en cache les IDs des aliments pour
			// faciliter l'appel POST ultérieur
			localStorage.setItem(data[i].nom,data[i].id);
		}
	})
}
 
function processError(jqXHR, textStatus, errorThrown) {
	window.location.href = 'http://localhost:3100/auth';
 	console.log(errorThrown + " : " + textStatus);
}

// Ajout d'un DateTime Picker pour connaitre l'heure du repas
$(document).ready(function(){
	$.datetimepicker.setLocale('fr');

	$("#datetimepicker").datetimepicker({

		format:'d.m.Y H:i',
		inline:true,
		lang:'fr'
	});
});

// Fonction qui va permettre de générer la bonne requête http post
function generatePost(){
	var obj = new Object();
	obj.token = localStorage['token'];
	obj.time = $(datetimepicker).val().toString();
	obj.aliments = [];
	obj.qte = [];
	al = $('.get');
	for (var i=0; i < al.length; i++){
		id = localStorage[al[i].childNodes[0].textContent];
		qte = al[i].childNodes[1].textContent;
		obj.aliments.push(id);
		obj.qte.push(qte);
	}
	console.log(obj);
	$.ajax({
		type: "POST",
		url: 'http://localhost:3100/api/v1/ajoutRepas',
		data: obj,
		headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
		success: function(data, textStatus) {
	            window.location.href = 'http://localhost:3100/test';
	        },
		dataType: 'json'
	});
}

// On ajoute un aliment au repas
function AjouterAliment(){
	var alim = $("<td>").text($('#alim').val().toString());
	var qte = $("<td>").text($('#qte').val().toString());
	var td = $("<td>");
	var btn = $("<button>", {class: "btn btn-danger btn-xs", onclick : "delAliment(this)"})
	var i = $("<i>", {class : "fa fa-trash-o"})
	btn.append(i);
	td.append(btn);
	var row = $("<tr>", {class : 'get'});
	row.append(alim);
	row.append(qte);
	row.append(td);
	$("#alimAjout").append(row);
}

// On laisse la possibilité d'en supprime un de la liste des aliments 
function delAliment(btn){
	$(btn).closest('tr').remove();
}