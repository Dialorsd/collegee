
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const WorkingHours = require('./models/WorkingHours');
const moment = require('moment');
const Activity = require('./models/Activity');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = new sqlite3.Database('./work.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);


app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;


        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error('Error checking user existence:', err.message);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (row) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }


            const hashedPassword = await bcrypt.hash(password, 10);


            db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
                if (err) {
                    console.error('Error registering user:', err.message);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log(`Registered user: ${username}`);
                res.json({ message: `Registered user: ${username}`, email });
            });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error('Error checking user existence:', err.message);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!row) {
                return res.status(404).json({ message: 'User not found' });
            }


            const passwordMatch = await bcrypt.compare(password, row.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            res.json({ message: `Logged in user with email: ${email}` });
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/test', (req, res) => {
    res.json({ message: 'Test route is working!' });
});
app.get('/dateTo', async (req, res) => {
    try {
        const workingHours = await WorkingHours.findAll();
        const dateToList = workingHours.map(entry => entry.dateTo);
        res.json(dateToList);
    } catch (error) {
        console.error('Error fetching dateTo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/dateFrom', async (req, res) => {
    try {
        const workingHours = await WorkingHours.findAll();
        const dateFromList = workingHours.map(entry => entry.dateFrom);
        res.json(dateFromList);
    } catch (error) {
        console.error('Error fetching dateFrom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/hoursFrom', async (req, res) => {
    try {
        const workingHours = await WorkingHours.find();
        const hoursFromList = workingHours.map(entry => entry.hoursFrom);
        res.json(hoursFromList);
    } catch (error) {
        console.error('Error fetching hoursFrom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/hoursTo', async (req, res) => {
    try {
        const workingHours = await WorkingHours.find();
        const hoursToList = workingHours.map(entry => entry.hoursTo);
        res.json(hoursToList);
    } catch (error) {
        console.error('Error fetching hoursTo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/activity', async (req, res) => {
    try {
        const workingHours = await WorkingHours.find();
        const activityList = workingHours.map(entry => entry.activity);
        res.json(activityList);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/description', async (req, res) => {
    try {
        const workingHours = await WorkingHours.find();
        const descriptionList = workingHours.map(entry => entry.description);
        res.json(descriptionList);
    } catch (error) {
        console.error('Error fetching description:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/dateFrom', async (req, res) => {
    try {
        const { dateFrom } = req.body;
        const newEntry = new WorkingHours({ dateFrom });
        await newEntry.save();
        res.json({ message: 'Date from added successfully', dateFrom });
    } catch (error) {
        console.error('Error adding date from:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/dateTo', async (req, res) => {
    try {
        const { dateTo } = req.body;
        const newEntry = new WorkingHours({ dateTo });
        await newEntry.save();
        res.json({ message: 'Date to added successfully', dateTo });
    } catch (error) {
        console.error('Error adding date to:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/hoursFrom', async (req, res) => {
    try {
        const { hoursFrom } = req.body;
        const newEntry = new WorkingHours({ hoursFrom });
        await newEntry.save();
        res.json({ message: 'Hours from added successfully', hoursFrom });
    } catch (error) {
        console.error('Error adding hours from:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/hoursTo', async (req, res) => {
    try {
        const { hoursTo } = req.body;
        const newEntry = new WorkingHours({ hoursTo });
        await newEntry.save();
        res.json({ message: 'Hours to added successfully', hoursTo });
    } catch (error) {
        console.error('Error adding hours to:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/activity', async (req, res) => {
    try {
        const { activity } = req.body;
        const newEntry = new WorkingHours({ activity });
        await newEntry.save();
        res.json({ message: 'Activity added successfully', activity });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/description', async (req, res) => {
    try {
        const { description } = req.body;
        const newEntry = new WorkingHours({ description });
        await newEntry.save();
        res.json({ message: 'Description added successfully', description });
    } catch (error) {
        console.error('Error adding description:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/calculate-duration', (req, res) => {
    try {

        const { dateFrom, dateTo, hoursFrom, hoursTo } = req.body;


        const startDateTime = moment(`${dateFrom} ${hoursFrom}`, 'YYYY-MM-DD HH:mm');
        const endDateTime = moment(`${dateTo} ${hoursTo}`, 'YYYY-MM-DD HH:mm');


        const durationMs = endDateTime.diff(startDateTime);


        const duration = moment.duration(durationMs);


        const hours = duration.hours();
        const minutes = duration.minutes();

        res.json({ hours, minutes });
    } catch (error) {
        console.error('Error calculating duration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/activities', async (req, res) => {
    try {
        const { activity, description, color } = req.body;

        const newActivity = await Activity.create({ activity, description, color });
        res.json({ message: 'Activity added successfully', activity: newActivity });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/activities/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const activity = await Activity.findByPk(id);


        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.json(activity);
    } catch (error) {
        console.error('Error fetching activity by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.put('/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { activity, description, color } = req.body;
        let updatedActivity = await Activity.findByPk(id);
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        updatedActivity.activity = activity;
        updatedActivity.description = description;
        updatedActivity.color = color;
        await updatedActivity.save();
        res.json(updatedActivity);
    } catch (error) {
        console.error('Error updating activity by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/working-hours/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { dateFrom, dateTo, hoursFrom, hoursTo, activity, description } = req.body;
        let updatedWorkingHours = await WorkingHours.findByPk(id);
        if (!updatedWorkingHours) {
            return res.status(404).json({ message: 'Working hours not found' });
        }
        updatedWorkingHours.dateFrom = dateFrom;
        updatedWorkingHours.dateTo = dateTo;
        updatedWorkingHours.hoursFrom = hoursFrom;
        updatedWorkingHours.hoursTo = hoursTo;
        updatedWorkingHours.activity = activity;
        updatedWorkingHours.description = description;
        await updatedWorkingHours.save();
        res.json(updatedWorkingHours);
    } catch (error) {
        console.error('Error updating working hours by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error('Error closing SQLite database:', err.message);
        }
        console.log('Disconnected from SQLite database');
        process.exit(0);
    });
});

module.exports = app;
