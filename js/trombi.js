// A faire disparaitre en fonction du click
var first_content = document.getElementById("first_content"); 
var second_content = document.getElementById("second_content"); 
var windowz = document.getElementById("window");
var nouvelle_promo = document.getElementById("nouvelle_promotion");
var delete_student = document.getElementById("delete_student");
var confirm_delete = document.getElementById("confirm_delete");
var add_student_button = document.getElementById("add_student_button");
var add_student = document.getElementById("add_student");
var checkbox = document.getElementsByClassName("checkbox");

// les éléments de click
var promos = document.getElementsByClassName("btn btn-primary btn-lg active");

// Clicks sur les classes de promo
for (var i=0; i < promos.length; i++) 
	{
	  promos[i].onclick = function()
	  {
	  	first_content.style.display = "none";
	  	second_content.style.display = "inline-block";
	  }
	}

nouvelle_promo.onclick = function(){
	if(windowz.style.display=="none")
	{
		windowz.style.display = "block"; 
	}
	else
	{
		windowz.style.display = "none";
	}
}

delete_student.onclick = function(){
	for (var i = checkbox.length - 1; i >= 0; i--) 
	{
		if(checkbox[i].style.display == "none")
		{
		    checkbox[i].style.display = "block";
		    confirm_delete.style.display="block";
		}
		else
		{
			checkbox[i].style.display = "none";
			confirm_delete.style.display="none";
		}
	};
}	

add_student_button.onclick = function(){
	if(add_student.style.display == "none")
	{
		add_student.style.display = "block";
	}
	else
	{
		add_student.style.display = "none";
	}
}