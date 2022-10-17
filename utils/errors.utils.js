module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: 'mauvais password'}

    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris";

    if (err.message.includes('email'))
        errors.email = "Email incorrect";

    if (err.message.includes('password'))
        errors.password = "Le mot de passe doit faire 6 caractères minimum";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) // permet d'identifier quand le champs pseudo contient une valeur déjà présente en base de données
        errors.pseudo = 'Ce pseudo est déjà pris';

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) // permet d'identifier quand le champs email contient une valeur déjà présente en base de données
        errors.email = 'Cet email est déjà enregistré';

    return errors
}