
$(document).ready(function() {
    //generateTeamQuestion();
});

async function getTeamByLeague(league) {
    const result = await axios({
        method: 'get',
        url: "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=" + league,
      });
      return result.data;
}

countries = ["Spain", "England", "Germany", "France", "Turkey", "Italy"];
leagues = ["Spanish La Liga", "English Premier League", "German Bundesliga","French Ligue 1","Turkish Super Lig", "Italian Serie A", "NFL"];

async function generateTeamQuestion() {

    let question = {
        "text": "Which team's logo is pictured above?",
        "answers": [],
        "correctIndex" : -1,
        "img_url": null
    }

    league_index = getRandomInt(leagues.length);
    let teams = await getTeamByLeague(leagues[league_index]);
    teams = teams["teams"];

    //pick four random teams
    team_choices = [];
    for (let i = 0; i < 4; i++) {
        let idx = getRandomInt(teams.length)
        team_choices[i] = teams[idx];
        teams[idx] = teams[teams.length - 1];
        teams.pop();
    }

    //pick which one is the right choice.
    let correct = getRandomInt(4);
    question.answers = team_choices.map(team => team.strTeam);
    question.correctIndex = correct;
    question.img_url = team_choices[correct].strTeamBadge;

    return question;
}