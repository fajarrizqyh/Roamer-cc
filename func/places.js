const connection = require('../conn/db');
const app = require('../conn/firebase');
require("dotenv").config();
const {
    format
} = require("util");
const {
    Storage
} = require("@google-cloud/storage");
const {
    getAuth
} = require("firebase/auth");
const processFile = require("../middleware/storage");

const auth = getAuth(app);


// Instantiate a storage client with credentials
const storage = new Storage({
    keyFilename: process.env.GCLOUD_SERVICE_KEY
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const upload = async (req, res) => {
    try {
        await processFile(req, res);

        if (!req.file) {
            return res.status(400).send({
                message: "Please upload a file!"
            });
        }
        

        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on("error", (err) => {
            res.status(500).send({
                message: err.message
            });
        });

        blobStream.on("finish", async (data) => {
            // Create URL for directly file access via HTTP.
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );

            req.body.imageUrl = publicUrl;

            const {
                name,
                city,
                category,
                description,
                imageUrl
            } = req.body;

            const query = 'INSERT INTO place (name, city, category, description, img_link) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [name, city, category, description, imageUrl], (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    return res.status(500).json({
                        error: 'Internal Server Error'
                    });
                } else {
                    return res.status(201).json({
                        message: 'Place created successfully',
                        placeId: results.insertId,
                        status_storage: `Uploaded the file successfully: ${req.file.originalname}`,
                        url: publicUrl
                    });
                }
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

// Get All Places from MySQL and return as JSON
function getallPlaces(req, res) {
    connection.query('SELECT * FROM place', (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        } else {
            res.json(results);
        }
    });
}

// Get a specific place and return as JSON
function getPlace(req, res) {
    const id = req.params.id;
    connection.query('SELECT * FROM place WHERE id = ?', [id], (err, results) => {
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
            res.json(results[0]);
        }
    });
}

// Get a number of places based on body input {name: name1, name2, etc} parsing each name and query and return as JSON
function filterPlace(req, res) {
    const ids = req.body.place_id.split(',').map(id => id.trim());
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
}

const likeplace = async (req, res) => {
    // Take input JSON body place_name and insert into likeplace table
    try {
        const user = await auth.currentUser;
        const place_name = req.body.place_name;
        //Query place name in table place and get the id
        connection.query('SELECT * FROM place WHERE name = ?', [place_name], (err, results) => {
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
            //Insert into likeplace table and also insert column status with true
            connection.query('INSERT INTO like_place (user_id, place_id, status_like) VALUES (?, ?, ?)', [user.uid, results[0].id, true], (err, results) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    return res.status(500).json({
                        error: 'Internal Server Error'
                    });
                }
            });
            return res.status(200).json({
                message: 'Thank you for your like'
            });
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const getlikeplace = async (req, res) => {
    // Take input JSON body place_name and insert into likeplace table
    try {
        const user = await auth.currentUser;
        const place_name = req.body.place_name;
        //Query place name in table place and get the id
        connection.query('SELECT place.name, place.img_link FROM place JOIN like_place ON place.id = like_place.place_id WHERE name = ? AND user_id = ?', [place_name, user.uid], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({
                    error: 'Internal Server Error'
                });
            }
            if (results.length === 0) {
                console.log(results)
                return res.status(404).json({
                    error: 'Place not founds'
                });
            }
            
            res.status(200).json({
                message: 'Success Get Data',
                like: results
            });
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}


module.exports = {
    getallPlaces,
    getPlace,
    upload,
    filterPlace,
    likeplace,
    getlikeplace
};