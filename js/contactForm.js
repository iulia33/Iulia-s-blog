window.addEventListener("load", function(e){
    var submitBtn = document.getElementById("js-send");
    
    submitBtn.addEventListener("click", function(e){
                    
        var nume = document.getElementById("js-name").value;
        var email = document.getElementById("js-email").value;
        var mess = document.getElementById("js-message").value;
        var numeClass = document.getElementById("js-name").classList;
        var emailClass = document.getElementById("js-email").classList;
        var messClass = document.getElementById("js-message").classList;
        var error = document.getElementById("js-error");
        var displayMess = document.getElementById("js-displayMess");
        
        if (nume === ""){
            numeClass.add("red-border");
            emailClass.add("red-border");
            messClass.add("red-border");
            e.preventDefault();
        } else if (emailClass === ""){
            emailClass.add("red-border");
            messClass.add("red-border");
            e.preventDefault();
        } else if (messClass === ""){
            messClass.add("red-border");
            e.preventDefault()
        } 
        
        if ((nume === "")||(email === "")||(mess === "")){
            error.innerHTML = "Please fill in mandatory fields!!!";
            error.style.color = "red";
        } else {
            error.style.display = "none";
            numeClass.remove("red-border");
            emailClass.remove("red-border");
            messClass.remove("red-border");
            displayMess.innerHTML = "Thank you for contacting us, " + nume + "!";
        }
    });
})