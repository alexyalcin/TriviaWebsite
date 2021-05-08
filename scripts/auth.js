
$(document).ready(function() {
    modals = $(".modal");
    add_signup_listener();
    add_logout_listener();
    add_signin_listener();
    add_auth_status_listener();
});
 
//signup 
function add_signup_listener() {
    $("#signup-form").submit(async function(e) {
        e.preventDefault();
        const email = $("#signup-email").val();
        const password = $("#signup-password").val();
        const displayName = $('#signup-name').val();
        if (displayName.length < 5) {
            displayName = email.substr(0, 8);
        }

        let validity = await validate_email(email);
        if (parseFloat(validity.quality_score) > .5) {
            try {
                let cred = await auth.createUserWithEmailAndPassword(email, password);
                console.log(cred);
                auth.currentUser.updateProfile({
                    displayName: displayName
                })
                db.collection('userData').add({
                    uid : auth.currentUser.uid,
                    highscore: 0,
                    gamesPlayed: 0,
                    averageScore: 0
                })
                auth.currentUser
                $("#modalSignup").modal("hide");
                $("#signup-form").trigger("reset");
            } catch (e) {
                alert(e.message);
            }

        } else {
            alert("email is invalid, please try again.");
        }
    });
}

function add_logout_listener() {
    $("#logout").on("click", async function(e){
        e.preventDefault();
        await auth.signOut();
    })
}

function load_stats() {
    $("main").load("stats.html");
}

function add_signin_listener() {
    login_form = $('#login-form');
    login_form.submit(async function(e) {
        e.preventDefault();
        const email = $("#login-email").val();
        const password = $("#login-password").val();

        try {
            let cred = await auth.signInWithEmailAndPassword(email, password);
            console.log(cred);
            $("#modalLogin").modal("hide");
            $("#login-form").trigger("reset");
        } catch (e) {
            alert(e.message);
        }
    })
}

function add_auth_status_listener() {
    auth.onAuthStateChanged(async function (user) {
        $("main").load("trivia.html", function() {
            if (user) {
                controlLoginUI(user);
                console.log("user logged in: ", user);
            } else {
                controlLoginUI(user);
                console.log("user logged out");
            }
        });

    });
}

function controlLoginUI(user) {
    if (user) {
        $(".logged-out").attr('hidden', true);
        $(".logged-in").attr("hidden", false);
    } else {
        $(".logged-in").attr("hidden", true);
        $(".logged-out").attr('hidden', false);
    }
}