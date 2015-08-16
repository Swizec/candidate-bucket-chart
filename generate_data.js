
const _ = require('lodash'),
      d3 = require('d3'),
      Faker = require('faker'),
      jsonfile = require('jsonfile'),
      mkdirp = require('mkdirp');

const time_format = d3.time.format('%d-%m-%Y'),
      Dir = './rest';


const generate_report = function (nid) {
    var path = Dir+'/reports/'+nid;

    mkdirp(path, function () {
        console.log("ensured", path);

        generate_clients(path);
        generate_jobs(path);
    });
},
      generate_clients = function (path) {
          var clients = _.range(3).map(function () {
              var nid = Faker.helpers.randomNumber(10000),
                  client = {nid: nid,
                            title: Faker.company.bs()};
              return client;
          });

          jsonfile.writeFileSync(path+'/client.json', clients);

          path = path+'/client';
          mkdirp(path, function () {
              console.log("ensured", path);
              
              clients.forEach(function (client) {
                  var jobs = _.range(5).map(function () {
                      return make_job();
                  });

                  console.log('Generated jobs for', path+'/'+client.nid+'.json');
                  jsonfile.writeFileSync(path+'/'+client.nid+'.json', jobs);
              });
          });
      },
      generate_jobs = function (path) {
          var jobs = _.range(3).map(function () {
              var nid = Faker.helpers.randomNumber(10000),
                  job = {nid: nid,
                         title: [Faker.hacker.adjective(),
                                 Faker.hacker.noun(),
                                 Faker.hacker.ingverb()].join(' ')};
              return job;
          });

          jsonfile.writeFileSync(path+'/job.json', jobs);
          
          path = path+'/job';
          mkdirp(path, function () {
              console.log("ensured", path);

              jobs.forEach(function (job) {
                  var jobs = make_job(job);

                  console.log("Generated job for", path+'/'+job.nid+'.json');
                  jsonfile.writeFileSync(path+'/'+job.nid+'.json', jobs);
              });
          });
      },
      make_job = function (job) {
          job || (job = {});

          return {JobId: job.nid || Faker.helpers.randomNumber(10000),
                  JobTitle: job.title || [Faker.hacker.adjective(),
                                          Faker.hacker.noun(),
                                          Faker.hacker.ingverb()].join(' '),
                  Responses: _.zipObject(_.range(10).map(make_response))};
      },
      make_response = function () {
          return [Faker.helpers.randomNumber(10000),
                  {Candidate:
                   {nid: Faker.helpers.randomNumber(10000),
                    Name: Faker.name.findName(),
                    Gender: Faker.helpers.shuffle([null, 'Male', 'Female'])[0],
                    DateOfBirth: time_format(Faker.date.between('1970-1-1', 
                                                                '1995-12-31')),
                    Email: Faker.internet.email,
                    Country: Faker.address.country(),
                    Location: Faker.address.city(),
                    EducationLevel: Faker.helpers.shuffle(['High School',
                                                           'Bachelor\'s',
                                                           'Master\'s',
                                                           'Doctorate'])[0],
                    CurrentJobTitle: "Student",
                    Source:"",
                    Photo:"http://web.bigscreencrm.com/sites/default/files/pictures/image_{N}.jpg".replace("{N}", Faker.helpers.randomNumber(10))
                   },
                   OverallScore: Faker.helpers.randomNumber(100),
                   StarRating: Faker.helpers.randomNumber(100),
                   Thumbs:"-1"}];
      };

jsonfile.readFile(Dir+'/reports.json', function (err, reports) {
    reports.forEach(function (report) {
        generate_report(report.nid);
    });
});
