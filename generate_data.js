
const _ = require('lodash'),
      d3 = require('d3'),
      Faker = require('faker');

const pool = {
};

const time_format = d3.time.format('%d/%m/%Y');

var data = _.range(5).map(function (job_id) {
    return {JobId: job_id,
            JobTitle: _.sample(["Big Time Server Manipulator", "Human User Shepherd",
                                "Supreme NoSQL Editor", "Unequaled Interaction Architect",
                                "Controlling Windows Vista Chino Wearer", 
                                "Senior Wireframe Player", "Momentous Maintenance Daddy",
                                "Major Python Networker", "Front End OSX Fixer"]),
            Responses: _.range(_.random(200, 450)).map(function (id) {
                var birthdate = Faker.date.between(new Date('01/01/1965'), 
                                                   new Date('12/31/1994')),
                    gender = _.random(0, 1),
                    pics = [[2, 3], [1, 4]];

                return {
                    "Candidate": {
                        "Nid": job_id+''+id,
                        "Name": Faker.name.findName(),
                        "Gender": ["Male", "Female"][gender],
                        "Date of Birth": time_format(birthdate),
                        "Email": Faker.internet.email(),
                        "Avatar": "images/person-"+_.sample(pics[gender])+".jpg",
                        "Country": Faker.address.country(),
                        "Location": Faker.address.city(),
                        "EducationLevel": "Bachelor's Degree",
                        "CurrentJobTitle": "Undergraduate University Student",
                        "Source": "LinkedIn"
                    },
                    "OverallScore": _.random(1, 100),
                    "StarRating": _.random(1, 10),
                    "Thumbs": "Up"
                };
            })};
            
});

require('jsonfile').writeFileSync('bigscreen.json', data);
