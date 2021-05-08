let active_game = null;
let time = 20;
let questions = 10;
let guess = -1;
function getAnswerId(num) {
    let id = "#answer" + String.fromCharCode(65 + num);
    return id;
}

$(document).ready(function() {
    render_trivia_game();
    add_trivia_button_listener();
    console.log($("#new-game-button").length);
})

function update_time_render() {
    $("#time-slider-div label").text("Question Time: " + $("#time-slider").val()+ " seconds");
}

function submit_settings(e) {
    e.preventDefault();
    time = $("#time-slider").val();
    $("#modal-settings").modal("hide");
    new_game();
}

function add_trivia_button_listener() {
    $("#trivia-btn").on("click", render_trivia_game);
}

function render_trivia_game() {

    $("main").load("trivia.html", function() {
        controlLoginUI(auth.currentUser);

        if (active_game) {
            $("#game-main").attr("hidden", false);
            $("#new-game-button").attr("hidden", true);
            load_game();
        }
    });

}

function load_game() {
    let q = active_game.question;
    render_question(q.img_url, q.text, q.answers, q.correctIndex);
    update_stats()
}

function  main_menu() {
    if (active_game) {
        active_game.stop();
        active_game = null;
    }
    $("#game-main").attr("hidden", true);
    $("#new-game-button").attr("hidden", false);
}

function new_game() {
    if (active_game) {
        active_game.stop();
    }
    active_game = new TriviaGame(auth.currentUser, {"time": time, "questions": questions});
    active_game.executeOnCountdown(update_time);
    next_question();
    update_time();
    reset_labels();
    $("#game-main").attr("hidden", false);
    $("#new-game-button").attr("hidden", true);
    $("#game-over").attr("hidden", true);
    $("#timer").attr("hidden", false);


}

function update_time() {
    console.log('updated');
    console.log($("#timer span").length);
    $("#timer .variable").text(active_game.timeOnQuestion);
    if (active_game.timeOnQuestion == 0) {
        guess = -1;
        update_stats();
    }
}

async function next_question() {
    if (active_game.isGameOver) {
        return;
    }
    await active_game.nextQuestion();
    let q = active_game.question;
    render_question(q.img_url, q.text, q.answers, q.correctIndex);
}

function answer_clicked(num) {
    if (!active_game.questionActive) {
        return;
    }
    guess = num;
    active_game.submit_answer(num);
    update_stats();
}

function reset_labels() {
$("#score-label .variable").text(active_game.score);
$("#streak-label .variable").text(active_game.streak);
$("#lives-label .variable").text(active_game.lives);
$("#questions-label .variable").text(active_game.totalQuestions - active_game.questionNum);
}

function update_stats() {
    console.log("stats updated");
    console.log($("#lives-label .variable").length);
    $("#next-question").attr("hidden", false);
    reset_labels();
    if (guess != -1) {
            $(getAnswerId(guess)).css("backgroundColor", "red");
            $(getAnswerId(active_game.question.correctIndex)).css("backgroundColor", "green");
    } else {
        $(getAnswerId(active_game.question.correctIndex)).css("backgroundColor", "#ff9933");
    }
    if (active_game.isGameOver) {
        //game Over
        $("#next-question").attr("hidden", true);
        $("#game-over").attr("hidden", false);
        $("#timer").attr("hidden", true);
        $("#final-score").text("Score: " + active_game.score);
        $("#high-score").text("Your highscore: " + active_game.highscore);

    }
}

function render_question(img_url, text, choices, correct_choice_index) {
    if (!img_url) { 
        img_url = "https://pngimg.com/uploads/question_mark/question_mark_PNG129.png";
    }
    $("#game-main-img img").attr("src", img_url);
    $("#game-main-question").text(text);
    for (let i = 0; i < 4; i++) {
        answer_button = $(getAnswerId(i));
        answer_button.text(String.fromCharCode(65 + i)+ ") " + choices[i]);
        answer_button.css('backgroundColor', "#0d6efd");
    }
    update_time();
    $("#next-question").attr("hidden", true);


}