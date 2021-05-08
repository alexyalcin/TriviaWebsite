$(document).ready(function() {
    //render_leaderboard();
    add_leaderboard_listener();
})

//adds listener to leaderboard button
function add_leaderboard_listener() {
    $("#leaderboard-btn").on("click", render_leaderboard);
}

//renders entire leadeboard
async function render_leaderboard() {
    $("main").load("../leaderboard.html");
    await load_leaderboard_elements(10);
}

async function load_leaderboard_elements(n) {
    let scores = await db.collection('scores');
    let scores_sorted = await scores.orderBy("score", "desc").orderBy("time").limit(n).get();
    let docs = scores_sorted.docs;
    for (let i = 0; i < n; i++) {
        if (docs[i]) {
            let data = docs[i].data();
            console.log(data);
            let row_html = render_leaderboard_row(i + 1, data.user, data.score, data.time);
            $("#leaderboard tbody").append(row_html);
        }
    }
}

function render_leaderboard_row(num, user, score, time) {
    let date = time.toDate();
    let dateString = date.toDateString();
    return $("<tr> <th scope='row'>"+num +"</th>"+ 
    "<td>" + user + "</td>"+ 
    "<td>"+ score + "</td>"+
    "<td>" + dateString+ "</td></tr>");
}