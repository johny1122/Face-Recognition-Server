const saltRounds = 10;
export const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password){
        res.status(400).json('incorrect form submission')
        return;
    }

    bcrypt.hash(password, saltRounds, (err, hash) => { 
        db.transaction(trx => {
            trx('login')
            .insert({
                'hash': hash,
                'email': email
            })
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                            })
                        .then(user => {
                            res.json(user[0])
                        })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
    })
}
