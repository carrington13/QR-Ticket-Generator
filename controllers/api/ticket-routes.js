// api routes to access ticket data
const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Ticket, User, Concert } = require('../../models');
const chalk = require('chalk');
const QRCode = require('qrcode');

// getting tickets by id with authorization, which also creates a qr_code
// it renders the qr code correctly, but this should be moved to a conttroller file, for 
// proper mvc seperation, as it renders a view. Also the redeeming of a qr code should happen on a different user
//account, perhaps an admin account of sorts. Also some feedback included giving this function scalibility, by creating a different method 
//for access to the qr code. Possibly a string that is created and saved in the database with that specific ticket? Future enhancements.
router.get('/:id', withAuth, (req, res) => {
    const concert = JSON.stringify(req.params.id);
    const qr = (concert) => {
        QRCode.toFile('public/assets/images/qr_code_ticket.png', `https://calm-escarpment-47526.herokuapp.com/${concert}`, {
        }, function (err) {
            if (err) throw err
            console.log(chalk.cyanBright('qr created'));
        });
    }
    qr(concert);
    Ticket.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Concert,
                attributes: ['id', 'venue_name', 'concert_name', 'concert_date']
            },
            {
                model: User,
                attributes: ['id', 'email']
            }
        ]
    })
        .then(dbTicketData => {
            if (!req.session.loggedIn) {
                res.render('login');
                return;
            }
            if (!dbTicketData) {
                console.log(chalk.redBright('No ticket located this is ticket-routes.'))
            }
            const ticket = dbTicketData.get({ plain: true });
            //render handlebars home page
            res.render('single_ticket', {
                ticket,
                loggedIn: req.session.loggedIn,
                user_id: req.session.user_id
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });

//delete ticket
router.delete('/:id', (req, res) => {
    Ticket.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbTicketData => {
        if (!dbTicketData) {
            res.status(404).json({ message: 'No ticket found with this id' });
            return;
        }
            res.json(dbTicketData);
    })
        .catch(err => {
            console.log(chalk.cyanBright(err + ' This error is in ticket-routes.js delete ticket route.'));
            res.status(500).json(err);
        });
})

module.exports = router;