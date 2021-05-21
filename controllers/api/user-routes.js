// api routes to get data from the user table
const router = require('express').Router();
const { User, Ticket, Concert } = require('../../models');

// getting all users...
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// getting users by id...
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Ticket,
                attributes: ['id','concert_id'],
                include: {model: Concert, 
                    attributes: ['concert_name']
                }
            },

        ]
    })
});

module.exports = router;