export const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if (!email || !password){
        res.status(400).json('incorrect form submission')
        return;
    }

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            bcrypt.compare(password, data[0].hash, (err, isValid) => {
                if (isValid){
                    return db.select('*')
                                .from('users')
                                .where('email', '=', email)
                                .then(user => res.json(user[0]))
                                .catch(err => res.status(400).json('unable to get user'))
                }
                else{
                    res.status(400).json('Wrong credentials')
                }
            })
        })
        .catch(err => res.status(400).json('Wrong credentials'))
}
