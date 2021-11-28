const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')

const Joi = require('joi')

const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_project01'
});

app.get("/", (req, res) => {
    res.send('Running Server port 3004')
})


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/api/get", (req, res) => {
    const sqlSelect = "SELECT * FROM students";
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    });
});


app.post("/api/ainsert", async(req, res) => {

    console.log(req)



    /* Validation */

    const schema = Joi.object().keys({
        firstname: Joi.string().trim().required().label('Firstname'),
        lastname: Joi.string().trim().required().label('Lastname'),
        email: Joi.string().email().required().label('Email'),
        phone: Joi.string().length(11).pattern(/^[0-9]+$/).required().label('Phone'),
        age: Joi.number().required().label('Age'),
        sex: Joi.string().required().label('Gender').messages({
            'string.base': `"Gender" should be a type of 'text'`,
            'string.empty': `select your gender`,
            'any.required': `"Gender" is a required field`
        }),
        fee: Joi.number().valid('').optional().label('Fee'),
        address: Joi.string().required().label('Address'),
        teacher: Joi.string().required().label('Teacher').messages({
            'string.base': `"Teacher" should be a type of 'text'`,
            'string.empty': `Please choose your teachers`,
            'string.min': `"Teacher" should have a minimum length of {#limit}`,
            'any.required': `"Teacher" is a required field`
        }),
        terms: Joi.boolean().required().invalid(false).messages({
            'any.invalid': `Please checked the terms and condition`
        }),
        isMath: Joi.boolean().default(false),
        isScience: Joi.boolean().default(false),
        isFilipino: Joi.boolean().default(false),
        isEnglish: Joi.boolean().default(false),

    })

    const { error } = schema.validate(req.body.state, { abortEarly: false });

    if (error) {
        const errors = {}
        if (!error) return null
        for (let item of error.details)
            errors[item.path[0]] = item.message
        console.log(errors)

        res.send(errors);
    } else {

        const firstname = req.body.state.firstname
        const lastname = req.body.state.lastname
        const email = req.body.state.email
        const phone = req.body.state.phone
        const age = req.body.state.age
        const sex = req.body.state.sex
        const city = req.body.state.address
        const fee = req.body.state.fee
        const subject = req.body.state.isMath
        const teacher = req.body.state.teacher

        const sqlInsert = "INSERT INTO students (fn,ln,email,phone,age,sex,city,fee,subject,teacher) VALUES (?,?,?,?,?,?,?,?,?,?)";
        db.query(sqlInsert, [firstname, lastname, email, phone, age, sex, city, fee, subject, teacher], (err, result) => {
            if (err) {
                console.log(err)
                res.send(err)
            } else {
                console.log(result)
                res.send('Insert Success')
            }
        });

        // res.send('success')
    }

    //  console.log('erromsg: ', validationResult.error); // ex

    // const { error } = schema.validate(req.body.state);

    // // Error in response

    // if (error) {
    //     console.log(error)
    //     console.log('errorr')
    //     res.send(error);
    // } else {
    //     console.log(error)
    //     console.log('success')
    //     res.send(error);
    // }

    // console.log(error)


    // res.send('error')


});


app.post("/api/insert", (req, res) => {

    console.log(req)

    const fn = req.body.newRow.fn
    const ln = req.body.newRow.ln
    const email = req.body.newRow.email
    const phone = req.body.newRow.phone
    const age = req.body.newRow.age
    const sex = req.body.newRow.sex
    const city = req.body.newRow.city
    const fee = req.body.newRow.fee

    const sqlInsert = "INSERT INTO students (fn,ln,email,phone,age,sex,city,fee) VALUES (?,?,?,?,?,?,?,?)";
    db.query(sqlInsert, [fn, ln, email, phone, age, sex, city, fee], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('Insert Success')
        }
    });
});

// app.delete("/api/delete/:id", (req, res) => {

//     const id = req.params.id
//     const sqlDelete = "DELETE FROM movie_reviews WHERE id = ?";
//     db.query(sqlDelete, id, (err, result) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log('Delete Success')
//         }
//     });
// });


// app.put("/api/update", (req, res) => {

//     const id = req.body.id
//     const moviename = req.body.moviename
//     const moviereview = req.body.review


//     console.log(id, moviename, moviereview)

//     // const sqlUpdate = "UPDATE movie_reviews SET moviename = ? , moviereview = ? WHERE id = ?";
//     // db.query(sqlUpdate, [moviename, moviereview, id], (err, result) => {
//     //     if (err) {
//     //         console.log(err)
//     //     } else {
//     //         console.log('Update Success')
//     //     }
//     // });
//});





/* -------------Test Example--------------*/

app.get('/example', (req, res) => {
    console.log(req.params)
    console.log(req.query)
    console.log(req.body)
    res.send('hello example')
})






app.listen(3004, () => {
    console.log('Running on port 3004')
})