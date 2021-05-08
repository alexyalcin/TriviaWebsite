question_types = [
    {   "name": "capital",
        "generator": generateCapitalQuestion,
        "type": "country"
    },
    {   "name": "flag",
        "generator": generateFlagQuestion,
        "type": "country"
    },
    {
        "name": "badge",
        "generator": generateTeamQuestion,
        "type": "sports"
    },
    {
        "name": "dog_breed",
        "generator": generateBreedQuestion,
        "type": "dogs"
    }
]

async function generateNewQuestion(filter = null) {
    // return {
    //     "text": "How many days are there in a leap year?",
    //     "answers": ["365", "366", "367", "368"],
    //     "correctIndex": 1,
    //     "img_url" : null
    // }
    let type_choices = question_types;
    if (filter) {
        type_choices = type_choices.filter(type => type["type"] == filter);
    }
    let type_index = getRandomInt(type_choices.length);
    let question = await type_choices[type_index].generator();
    console.log(question);
    return question;
}

class TriviaGame {
    constructor(user, settings) {
        this.MAX_TIME = 60;
        this.user = user;
        this.time = settings.time;
        this.totalQuestions = settings.questions;
        this.isGameOver = false;
        this.lives = 3;
        this.score = 0;
        this.streak = 0;
        this.questionNum = 0;
        this.questionActive = false;
        this.timeOnQuestion = settings["time"];
        this.highscore = 0;
        this.get_highscore();
        this.onCountdown = (x=>x);
    }

    stop() {
        clearInterval(this.interval);
    }

    executeOnCountdown(fx) {
        this.onCountdown = fx;
    }


    async nextQuestion() {
        this.question = await generateNewQuestion();
        this.questionActive = true;
        this.questionNum += 1;
        this.timeOnQuestion = this.time;
        this.interval = setInterval(this.countdown.bind(this), 1000);
        return this.question;
    }

    countdown() {
        this.timeOnQuestion-=1;
        console.log(this.timeOnQuestion);

        if (this.timeOnQuestion < 1) {
            this.questionActive = false;
            clearInterval(this.interval);
            this.lives -= 1;
            this.streak = 0;
            this.check_gamestate();
        }
        this.onCountdown();
    }

    submit_answer(index) {
        if (this.timeOnQuestion == 0) {
            return false;
        }
        this.questionActive = false;
        clearInterval(this.interval);
        if (this.question.correctIndex === index && this.timeOnQuestion > 0) {
            let streak_multiplier = 1 + this.streak * .5;
            let time_multiplier = 3 - 1.4*(this.time/ this.MAX_TIME);
            let time_left_bonus = 50 *(this.timeOnQuestion/this.time)
            this.streak += 1;
            this.score += parseInt(100 * streak_multiplier * time_multiplier +  + time_left_bonus +.5);
            if (this.score > this.highscore) this.highscore = this.score;
            this.check_gamestate();
            return true;
        } else {
            this.lives -= 1;
            this.streak = 0;
            this.check_gamestate();
            return false;
        }
    }

    check_gamestate() {
        console.log(this.score, this.lives);
        if (this.questionNum === this.totalQuestions || this.lives === 0) {
            if (!this.isGameOver) {
                this.upload_highscore();
            }
            this.isGameOver = true;

        } else {
        }
    }

    async get_highscore() {
        try {
            let userDataDoc = await db.collection('userData').where('uid', '==', this.user.uid).get();
            console.log(userDataDoc.docs[0]);
            let docData = userDataDoc.docs[0].data();

            if (docData.highscore < this.score) {
                docData.highscore = this.score;
            }
            this.highscore = docData.highscore;
        } catch (e) {
            console.log(e);
        }
        return 0;
    }

    async upload_highscore() {
        await db.collection('scores').add({
            "score": this.score,
            "time": firebase.firestore.Timestamp.now(),
            "uid": this.user.uid,
            "user": this.user.displayName
        });

        try {
            let userDataDoc = await db.collection('userData').where('uid', '==', this.user.uid).get();
            console.log(userDataDoc.docs[0]);
            let docData = userDataDoc.docs[0].data();
            let docId = userDataDoc.docs[0].id;

            if (docData.highscore < this.score) {
                docData.highscore = this.score;
            }
            this.highscore = docData.highscore;
            docData.averageScore = (docData.averageScore * docData.gamesPlayed + this.score) / (docData.gamesPlayed + 1);
            docData.gamesPlayed = docData.gamesPlayed + 1;
            db.collection("userData").doc(docId).update(docData);
        } catch (e) {
            console.log(e);
        }
        
    }
}

// let user = {"name": "Alex"};
// let settings = {
//     "time": 5,
//     "questions": 10
// }
// let game = new TriviaGame(user, settings);
// game.nextQuestion();