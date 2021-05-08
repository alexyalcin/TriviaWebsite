$(document).ready(function() {
    generateBreedQuestion().then(function(x) {
        console.log(x);
    });
});


async function getDogBreeds() {
    const result = await axios({
        method: 'get',
        url: 'https://api.thedogapi.com/v1/breeds',
        headers: {
            "x-api-key" : "26e24bd5-7cc3-4893-965e-a946d8f636f4"
        }
      });
      console.log(result.data);
      return result.data;
}

async function getDocPic(breed) {

}

async function generateBreedQuestion() {
    let question = {
        "text": "What breed of dog is shown above?",
        "answers": [],
        "correctIndex" : -1,
        "img_url": null
    }

    //pick region
    let dogs = await getDogBreeds();
    dogs = dogs.map(dog => ({"name": dog.name, "url": dog.image.url}));

    //pick four random dogs
    dog_choices = [];
    for (let i = 0; i < 4; i++) {
        let idx = getRandomInt(dogs.length)
        dog_choices[i] = dogs[idx];
        dogs[idx] = dogs[dogs.length - 1];
        dogs.pop();
    }

    //pick which one is the right choice.
    let correct = getRandomInt(4);
    question.answers = dog_choices.map(dog => dog.name);
    question.correctIndex = correct;
    question.img_url = dog_choices[correct].url;

    return question;
}