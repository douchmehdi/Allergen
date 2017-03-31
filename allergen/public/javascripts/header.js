$(document).ready(function(){
	if(localStorage['username'] !== null){
		$('#hello').text('Bonjour ' + localStorage['username']);
	}		
});
