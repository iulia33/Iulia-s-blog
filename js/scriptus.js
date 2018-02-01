/*global $*/

//adding top stories from NY Times

$(document).ready(function(){
    var url = "https://api.nytimes.com/svc/topstories/v2/travel.json";
    url += '?' + $.param({
      'api-key': "a1198dba38e042288547e3e627fee912"
    });
    $.ajax({
          url: url,
          method: 'GET',
        }).done(function(result) {
          console.log(result);
        }).fail(function(err) {
          throw err;
    });
      
    $.ajax({
        url:url,
        method:"GET",
        success:function(response){
            
            var storiesUl = document.getElementById("display-stories");
    
            for (var i = 0; i<3; i++){
                var storyLi = document.createElement("li");
                
                var storyImg = document.createElement("img");
                storyImg.setAttribute("src",response.results[i].multimedia[i].url);
                storyImg.setAttribute("width","100px");
                storyLi.appendChild(storyImg);
                
                var storyA = document.createElement("a");
                storyLi.appendChild(storyA);
                storyA.setAttribute("href", response.results[i].short_url);
                storyA.innerHTML ="<br>" + response.results[i].title;
                
               
                storiesUl.appendChild(storyLi);
             }  
        }
    }) ; 
    
    //Trivia game
    
    //paragraph where the game will be displayed
    var  displayPrg = document.getElementById("js-display-trivia");
    
    //hidding the template
    var template = document.getElementById("template");
    var templateCls = template.classList;
    templateCls.add("hide");
    
    //create play button
    var playBtn = document.getElementById("js-play");
    var playBtnCls = playBtn.classList;
   //add event listener for play - start with first question
    playBtn.onclick = function(){
        $.ajax({
            url:"https://opentdb.com/api.php?amount=15&category=10",
            method:"GET",
            success: function(response){
                console.log(response); 
                if(playBtn.getAttribute("value") == "Replay!"){
                    displayPrg.removeChild(displayPrg.childNodes[0]);
                }
                displayQuestion(response);
                playBtnCls.add("hide");
                
            }
        });
    }
   
   //function that creates the question and the list with four answers
    function displayQuestion(serverData){
        
        var correctAnswerIndex = 0;
        var questionIndex = 0;
        moveForward(serverData, questionIndex, correctAnswerIndex);

    }
    
    function moveForward(serverData, questionIndex, correctAnswerIndex)
    {
        createQuestionLayout(serverData, questionIndex,correctAnswerIndex);
    
    }
    
    
    function submitAnswer(){
        var questionIndex = event.target.questionIndex;
        var correctAnswerIndex = event.target.correctAnswerIndex;
        var serverData = event.target.serverData;
        var btnClicked = event.target;
        var submitAnsId = event.target.id;
        var chosenAnsw =document.getElementById("js-answers").options[document.getElementById("js-answers").selectedIndex].text;
        var corrAnsw = event.target.corrAnsw;
        if(chosenAnsw == corrAnsw){
            
            correctAnswerIndex++;
        
        }
        // Delete the previous question
        btnClicked.parentNode.remove(displayPrg.childNodes[submitAnsId]);
          
        // Check if there are any questions left
        questionIndex++;
        if (questionIndex < 15)
        {

            moveForward(serverData, questionIndex, correctAnswerIndex);
        }
        else
        {
            var output = document.createElement("p");
            output.innerHTML = "Game over. You got " + correctAnswerIndex + " correct answers!";
            displayPrg.appendChild(output);
            playBtn.setAttribute("value","Replay!");
            playBtnCls.remove("hide");
            
        }
    }
      

    function createQuestionLayout(serverData, questionIndex,correctAnswerIndex)
    {
       var template = document.getElementById("template");
       templateCls.remove("hide");
       var displayDiv = template.cloneNode(true);
       displayDiv.id = "";
       
     
       var questionLabel = displayDiv.querySelector(".js-question");
       questionLabel.innerHTML = serverData.results[questionIndex].question;
       
       
       var answersSelect = document.getElementById("js-answers");
       
       if (serverData.results[questionIndex].type === "multiple"){
           var answers = [serverData.results[questionIndex].incorrect_answers[0],serverData.results[questionIndex].incorrect_answers[1],
        	serverData.results[questionIndex].incorrect_answers[2],serverData.results[questionIndex].correct_answer];
        	
           var answer1 = displayDiv.querySelector(".js-answer-1");
           answer1.innerHTML = answers[Math.floor(Math.random()*4)];
           
           var answer2 = displayDiv.querySelector(".js-answer-2");
           answer2.innerHTML = answers[Math.floor(Math.random()*4)];
           while(answer1.innerHTML === answer2.innerHTML){
               answer2.innerHTML = answers[Math.floor(Math.random()*4)];
           }
           
           var answer3 = displayDiv.querySelector(".js-answer-3");
           answer3.innerHTML = answers[Math.floor(Math.random()*4)];
           while((answer1.innerHTML === answer3.innerHTML)||(answer2.innerHTML === answer3.innerHTML)){
               answer3.innerHTML = answers[Math.floor(Math.random()*4)];
           }
           
           var answer4 = displayDiv.querySelector(".js-answer-4");
           answer4.innerHTML = answers[Math.floor(Math.random()*4)];
           while((answer1.innerHTML === answer4.innerHTML)||(answer2.innerHTML === answer4.innerHTML)||(answer3.innerHTML === answer4.innerHTML)){
               answer4.innerHTML = answers[Math.floor(Math.random()*4)];
           }
       }else{
           var answerA = displayDiv.querySelector(".js-answer-1");
           answerA.innerHTML = "True";
           
           var answerB = displayDiv.querySelector(".js-answer-2");
           answerB.innerHTML = "False";
          
       }
       
    	var submitAns = displayDiv.querySelector(".submit-answer");
    	submitAns.id = questionIndex;
        submitAns.questionIndex = questionIndex;
        submitAns.correctAnswerIndex = correctAnswerIndex;
        submitAns.serverData = serverData;
        submitAns.corrAnsw = serverData.results[questionIndex].correct_answer;
      
        submitAns.onclick = submitAnswer;
    	
    	displayPrg.appendChild(displayDiv);
    	templateCls.add("hide");
    }
    
});  
           