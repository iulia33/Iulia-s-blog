/*global $*/

$(document).ready(function(){
    
    //Top stories from NY Times
    
    //define a variable url, which contains the url and API KEY
    var url = "https://api.nytimes.com/svc/topstories/v2/travel.json";
    url += '?' + $.param({
      'api-key': "a1198dba38e042288547e3e627fee912"
    });
    
    //get data from the NY Times that I need to be displayed on the page
    $.ajax({
        url:url,
        method:"GET"})
        .then(function(response){
            console.log(response);
            displayStoriesFromNYT(response);
        })
        //if there is a error with the url or api key, catch that error and
        //display message "Something went wrong!"
        .catch(function(error){ 
            console.log("Error. Cannot download data from the NY Times server");
            var storiesUl = document.getElementById("display-stories");
            storiesUl.innerHTML = "Cannot download data from the NY Times server";
        }); 
    
    //create the HTML code for displaying the first 3 top stories from NY Times
    function displayStoriesFromNYT(response){
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
            method:"GET"})
            .then(function(response){
                console.log(response); 
                
                //remove the score obtainedas a result for playing the game before 
                if(playBtn.getAttribute("value") == "Replay!"){
                    displayPrg.removeChild(displayPrg.childNodes[0]);
                }
                displayQuestion(response);
                
                //hide the play button when the game begins
                playBtnCls.add("hide");
             })
             
                 
                 //if there is a error with the url or ......, catch that error and
        //display message "Something went wrong!"
             .catch(function(error){
            console.log("Error. Cannot download data from the Trivia server");
            displayPrg.innerHTML = "Cannot download data from the Trivia server";
        });
    }
   
   //function that creates the question and the list with boolean or multiple answers
    function displayQuestion(serverData){
        
        var correctAnswerIndex = 0;
        var questionIndex = 0;
        createQuestionLayout(serverData, questionIndex,correctAnswerIndex);

    }
      
    //create questions in memory
    function createQuestionLayout(serverData, questionIndex,correctAnswerIndex)
    {
       
       //clone the HTML code created on the index page
       var template = document.getElementById("template");
       templateCls.remove("hide");
       var displayDiv = template.cloneNode(true);
       displayDiv.id = "";
      
       var questionLabel = displayDiv.querySelector(".js-question");
       questionLabel.innerHTML = serverData.results[questionIndex].question;
       
       
       var answersSelect = document.getElementById("js-answers");
       
       //there are 2 types of answers: multiple and boolean. If the type is multiple, there are 4 
       //answers, so create 4 options.
       
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
       }
       
       //If the type is boolean, create 2 options: true and false.
       else{
           var answerA = displayDiv.querySelector(".js-answer-1");
           answerA.innerHTML = "True";
           
           var answerB = displayDiv.querySelector(".js-answer-2");
           answerB.innerHTML = "False";
          
       }
       
       //create the submit answer button. For evry iteration save the id, question index,
       //correct answer index, correct answer, and server data.
    	var submitAns = displayDiv.querySelector(".submit-answer");
    	submitAns.id = questionIndex;
        submitAns.questionIndex = questionIndex;
        submitAns.correctAnswerIndex = correctAnswerIndex;
        submitAns.serverData = serverData;
        submitAns.corrAnsw = serverData.results[questionIndex].correct_answer;
        
        //add event listener for submit answer
        submitAns.onclick = submitAnswer;
    	
    	displayPrg.appendChild(displayDiv);
    	
    	//hide the template
    	templateCls.add("hide");
    	return submitAns;
    }
    
    //function that adds functionality to the submit button, and checks the submited answer
    function submitAnswer(){
        //get the event's id, question index, correct answer index, correct answer and server data.
        var questionIndex = event.target.questionIndex;
        var correctAnswerIndex = event.target.correctAnswerIndex;
        var serverData = event.target.serverData;
        var btnClicked = event.target;
        var submitAnsId = event.target.id;
        
        //get the answer selected by the user
        var chosenAnsw =document.getElementById("js-answers").options[document
        .getElementById("js-answers").selectedIndex].text;
        var corrAnsw = event.target.corrAnsw;
        
        
        //keeping the score for correct answers
        if(chosenAnsw == corrAnsw){
            
            correctAnswerIndex++;
        
        }
       
        // Delete the previous question
        btnClicked.parentNode.remove(displayPrg.childNodes[submitAnsId]);
          
        // Check if there are any questions left
        questionIndex++;
        if (questionIndex < 15)
        {

            createQuestionLayout(serverData, questionIndex,correctAnswerIndex);
        }
        //if the game is over, display the rezults on the page
        else
        {
            var output = document.createElement("p");
            output.innerHTML = "Game over. You got " + correctAnswerIndex + " correct answers!";
            displayPrg.appendChild(output);
            
            //the play button, that was hidden in the beginning, becomes Replay button
            playBtn.setAttribute("value","Replay!");
            playBtnCls.remove("hide");
            
        }
        return questionIndex, correctAnswerIndex;
    }
});  
           