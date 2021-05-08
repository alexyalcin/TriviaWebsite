
$(document).ready(function() {
});

regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

async function getCountryFlagByRegion(region) {
    const result = await axios({
        method: 'get',
        url: '//restcountries.eu/rest/v2/region/' + regions[region] + "?fields=name;flag",
      });
      return result.data;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

async function generateFlagQuestion() {
    let question = {
        "text": "Which country does this flag belong to?",
        "answers": [],
        "correctIndex" : -1,
        "img_url": null
    }

    //pick region
    let region_index = getRandomInt(5);
    let countries = await getCountryFlagByRegion(region_index);

    //pick four random countries
    country_choices = [];
    for (let i = 0; i < 4; i++) {
        let idx = getRandomInt(countries.length)
        country_choices[i] = countries[idx];
        countries[idx] = countries[countries.length - 1];
        countries.pop();
    }

    //pick which one is the right choice.
    let correct = getRandomInt(4);
    question.answers = country_choices.map(country => country.name.split(',',)[0]);
    question.correctIndex = correct;
    question.img_url = country_choices[correct].flag;

    return question;
}

async function getCountryCapitalByRegion(region) {
    const result = await axios({
        method: 'get',
        url: '//restcountries.eu/rest/v2/region/' + regions[region] + "?fields=name;flag;capital",
      });
      return result.data;
}

async function generateCapitalQuestion() {
    let question = {
        "text": "What is the Capital of ",
        "answers": [],
        "correctIndex" : -1,
        "img_url": null
    }

    //pick region
    let region_index = getRandomInt(5);

    let countries = await getCountryCapitalByRegion(region_index);

    //pick four random countries
    country_choices = [];
    for (let i = 0; i < 4; i++) {
        let idx = getRandomInt(countries.length)
        country_choices[i] = countries[idx];
        countries[idx] = countries[countries.length - 1];
        countries.pop();
    }

    //pick which one is the right choice.
    let correct = getRandomInt(4);
    question.text+= country_choices[correct].name+ "?";
    question.answers = country_choices.map(country => country.capital);
    question.correctIndex = correct;
    question.img_url = country_choices[correct].flag;

    return question;
}