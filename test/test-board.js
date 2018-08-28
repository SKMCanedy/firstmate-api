"use strict";
require("dotenv").config();

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");

const { TEST_DATABASE_URL } = require("../config");
const {app, runServer, closeServer} = require("../server");
const {User} = require("../users");
const {Board} = require("../board");

const expect = chai.expect;

chai.use(chaiHttp);

function  seedBoardData(){
    const seedData = [];
    for (let i=1; i<=10; i++) {
        seedData.push(generateBoardData());
      }
      return Board.insertMany(seedData);
}

function generateBoardData(){
    const col1 = faker.lorem.word;
    const col2 = faker.lorem.word;
    const title1 = faker.lorem.words;
    const title2 = faker.lorem.words;
    const task1 = faker.lorem.word;
    const task2 = faker.lorem.word;

    return {
        "columnOrder": [col1,col2],
        "tasks": {},
        "columns": {
            col1: {
                "id": col1,
                "title": title1,
                "taskIds": []
            },
            col2: {
                "id": col2,
                "title": title2,
                "taskIds": []
            }
        },
        "modalStatus": {}
    }  
}


const sampleData = {
    "columnOrder": ["column1", "column11", "column12", "column13"],
    "tasks": {
        "task1": {
            "id": "task1",
            "content": "test task 1"
        },
        "task2": {
            "id": "task2",
            "content": "test task 2"
        }
    },
    "columns": {
        "column1": {
            "id": "column1",
            "title": "Process Bank",
            "taskIds": ["task2"]
        },
        "column11": {
            "id": "column11",
            "title": "Test Staff 11",
            "taskIds": []
        },
        "column12": {
            "id": "column12",
            "title": "Test Staff 12",
            "taskIds": ["task1"]
        },
        "column13": {
            "id": "column13",
            "title": "Test Staff 13",
            "taskIds": []
        }
    },
    "modalStatus": {
        "showModal": true,
        "modalType": "taskModal"
    }
}
function tearDownDb() {
    console.warn("Deleting database");
    return mongoose.connection.dropDatabase();
}

describe("Board API", function() {

  const testUser = {
    username: "TestUser",
    password: "TestPassword",
    firstName: "TestFirst",
    lastName: "TestLast"
  };
  let authToken = null;

    before(() => {
        return runServer(TEST_DATABASE_URL)
            .then(() => User.hashPassword("TestPassword"))
            .then(hash => User.create({
            ...testUser,
            password: hash
            }))
            .then(() => chai
            .request(app)
            .post("/api/auth/login")
            .send({
                username: "TestUser",
                password: "TestPassword"
            }))
            .then(res => {
            authToken = res.body.authToken
            });
    });

    beforeEach(()=>{
        return seedBoardData();
    })

    afterEach(()=>{
        return mongoose.connection.dropDatabase();
    })

    after(() => {
        return User.findOneAndRemove({ username: "TestUser"}).then(() => {
            closeServer();
        })
    });


    describe("GET", function(){
        it("Should successfully pull all boards", function(){
            return chai
            .request(app)
            .get("/api/board")
            .set("Authorization", `Bearer ${authToken}`)
            .send()
            .then((res)=>{
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a("object");
                expect(res.body.id).to.not.be.null;
            })
        })
    })


    describe("POST", function(){
        it("Should add a new board", function(){
            return chai
            .request(app)
            .post("/api/board")
            .set("Authorization", `Bearer ${authToken}`)
            .send(sampleData)
            .then((res)=>{
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body.id).to.not.be.null;
                expect(res.body.columns.column12.title).to.equal("Test Staff 12");
            })
        })
    });

    describe("PUT Route", function(){
        it("Should update a board", function(){
            return Board.findOne().then((singleBoard)=>{
                return chai
                .request(app)
                .put(`/api/board/${singleBoard.id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send(sampleData)
                .then((res)=>{
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.columns.column12.title).to.equal("Test Staff 12");
                })
            })
        })
    })

    describe("DELETE Route", function(){

        it("Should delete a board", function(){
            return Board.findOne().then((singleBoard)=>{
                return chai
                .request(app)
                .delete(`/api/board/${singleBoard.id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send()
                .then((res)=>{
                    expect(res).to.have.status(200);
                })
            })
        })
    })
});