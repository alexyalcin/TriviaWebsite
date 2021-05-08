let invalid_email = false;


$(document).ready(function() {
    if (invalid_email) {
        let main = $("main");
        main.prepend("<p>Email does not exist or is invalid</p>");
    }
    //invalid_email = false;
    //add_email_validation();
   });
 
function add_email_validation() {
    let submit = $("#validate_email");
    submit.on("submit", async function(e) {
        e.preventDefault();
        let email = $("#email_value").val();
        let result = await validate_email(email);
        if (parseFloat(result.quality_score) < .5) {
            invalid_email = true;
            location.reload(true);
        } else {
            location.reload(true);
        }
    })
}

async function validate_email(email) {
    return {"quality_score": ".7"};
    const result = await axios({
        method: 'get',
        url: 'https://emailvalidation.abstractapi.com/v1/?api_key=6f6585dd1c814335b9bb8e56c9a6945f&email=' + email,
      });
      console.log(result);
      return result.data;
}