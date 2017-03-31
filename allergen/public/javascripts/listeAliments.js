$.ajax({
  url: "http://localhost:3100/api/v1/user/repas",
  dataType: "json",
  type: "GET",
  headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
  success: processSuccess,
  error: processError,
});
 
function processSuccess(data) {
	console.log(data);
	$(document).ready(function(){
		for (var i = 0; i < data.length; i++){
			var row = $("<tr>");
			var alim = $("<td>").text(data[i].aliment);
			var qte = $("<td>").text(data[i].qte);
			var heure = $("<td>").text(data[i].time);
			row.append(alim);
			row.append(qte);
			row.append(heure);
			$("#list_alim").append( row );
		}
	})
}
 
function processError(jqXHR, textStatus, errorThrown) {
	window.location.href = 'http://localhost:3100/auth';
  	console.log(errorThrown + " : " + textStatus);
}