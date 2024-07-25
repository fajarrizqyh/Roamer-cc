const connection = require('../conn/db');
const app = require('../conn/firebase');
var request = require('request');
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} = require("firebase/auth");
const auth = getAuth(app);

let place_id = '';

const signup = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        connection.query('INSERT INTO users (username, uid) VALUES (?, ?)', [name, user.user.uid], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({
                    error: 'Internal Server Error'
                });
            }
        });
        res.status(201).json({
            id: user.user.uid,
            email: email,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await signInWithEmailAndPassword(auth, email, password);

        if(user) {
            //Query UID in user Table
            connection.query('SELECT * FROM users WHERE uid = ?', [user.user.uid], (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    return res.status(500).json({
                        error: 'Internal Server Error'
                    });
                }
                if (results.length === 0) {
                    return res.status(404).json({
                        error: 'User not found'
                    });
                }
                return res.status(200).json({
                    message: 'Login success',
                    id: user.user.uid,
                    email: email,
                    name: results[0].username,
                    user: user.user
                });
            });
        }

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await auth.currentUser;
        //Query UID in user Table
        connection.query('SELECT * FROM users WHERE uid = ?', [user.uid], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({
                    error: 'Internal Server Error'
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }
            res.status(200).json({
                id: user.uid,
                email: user.email,
                name: results[0].username
            });
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

const logout = async (req, res) => {
    try {
        await signOut(auth);
        res.status(200).json({
            message: 'Logout success'
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const preference = async (req, res) => {
    try {
        const user = await auth.currentUser;

        const names = req.body.preference.split(',').map(preference => preference.trim());
        let preference_array = [];

        const promises = names.map(name => {
            return new Promise((resolve, reject) => {
                connection.query('SELECT * FROM place WHERE name = ?', [name], (err, results) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        return res.status(500).json({
                            error: 'Internal Server Error'
                        });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: 'Place not found'
                        });
                    }
                    preference_array.push(results[0].id);
                    connection.query('INSERT INTO preference (user_id, preference) VALUES (?, ?)', [user.uid, results[0].id], (err, results) => {
                        if (err) {
                            console.error('Error executing MySQL query:', err);
                            return res.status(500).json({
                                error: 'Internal Server Error'
                            });
                        }
                        resolve();
                    });
                });
            });
        });

        await Promise.all(promises);

        //POST preference array using JSON input
        function getPlaceId(preference_array) {
            return new Promise((resolve, reject) => {
                const options = {
                    url: 'https://model-roamer-qgrxwby45q-et.a.run.app/preferences',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Place_Id: preference_array
                    })
                };

                //send request to ML model
                request(options, function (err, response, body) {
                    if (err) {
                        console.error('Error executing ML model:', err);
                        reject('Internal Server Error');
                    }
                    let result = JSON.parse(response.body).recommendations;
                    let place_id = '';
                    //Loop through the result and insert into place id with , as delimiter
                    for (let i = 0; i < result.length; i++) {
                        place_id += result[i].Place_Id.toString();
                        if (i < result.length - 1) {
                            place_id += ', ';
                        }
                    }
                    resolve(place_id);
                });
            });
        }
        getPlaceId(preference_array)
            .then(place_id => {
                const ids = place_id.split(',').map(id => id.trim());
                const query = 'SELECT * FROM place WHERE id IN (?)';
                connection.query(query, [ids], (err, results) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        res.status(500).json({
                            error: 'Internal Server Error'
                        });
                    } else if (results.length === 0) {
                        res.status(404).json({
                            error: 'Place not found'
                        });
                    } else {
                        res.json(results);
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

//Home Page, get user_id and query to table preference and get the place_id
const getPreference = async (req, res) => {
    try {
        const user = await auth.currentUser;
        connection.query('SELECT * FROM preference WHERE user_id = ?', [user.uid], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({
                    error: 'Internal Server Error'
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    error: 'Preference not found'
                });
            }
            let preference_array = [];
            for (let i = 0; i < results.length; i++) {
                preference_array.push(results[i].preference);
            }
            //POST preference array using JSON input
            function getPlaceId(preference_array) {
                return new Promise((resolve, reject) => {
                    const options = {
                        url: 'https://model-roamer-qgrxwby45q-et.a.run.app/preferences',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Place_Id: preference_array
                        })
                    };

                    //send request to ML model
                    request(options, function (err, response, body) {
                        if (err) {
                            console.error('Error executing ML model:', err);
                            reject('Internal Server Error');
                        }
                        let result = JSON.parse(response.body).recommendations;
                        let place_id = '';
                        //Loop through the result and insert into place id with , as delimiter
                        for (let i = 0; i < result.length; i++) {
                            place_id += result[i].Place_Id.toString();
                            if (i < result.length - 1) {
                                place_id += ', ';
                            }
                        }
                        resolve(place_id);
                    });
                });
            }
            getPlaceId(preference_array)
                .then(place_id => {
                    const ids = place_id.split(',').map(id => id.trim());
                    const query = 'SELECT * FROM place WHERE id IN (?)';
                    connection.query(query, [ids], (err, results) => {
                        if (err) {
                            console.error('Error executing MySQL query:', err);
                            res.status(500).json({
                                error: 'Internal Server Error'
                            });
                        } else if (results.length === 0) {
                            res.status(404).json({
                                error: 'Place not found'
                            });
                        } else {
                            res.json(results);
                        }
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}



module.exports = {
    signup,
    login,
    getUser,
    logout,
    preference,
    getPreference
}