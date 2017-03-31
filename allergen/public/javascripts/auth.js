function auth(){
	var obj = new Object();
	obj.username = $('#user').val();
	obj.password = $('#pass').val();
	$.ajax({
		type: "POST",
		url: 'http://localhost:3100/api/v1/auth',
		data: obj,
		dataType: 'json',
		success: function(res) {
	            localStorage.setItem('token',res.authorization);
	            localStorage.setItem('username', obj.username);
	            alert("The server says: " + res.authorization);
	            window.location.href = 'http://localhost:3100/users/repas';
	        },
	    error: function(res){
	    	window.location.href = 'http://localhost:3100/auth'
	    }
	});
}