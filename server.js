// Un serveur simple qui retourne les utilisateurs contenus dans une liste
// NB: cette liste peut aussi etre une base des données

// Ce serveur répond au méthodes HTTP suivants : GET, POST, DELETE, PATCH

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000 // Port du serveur

class User {
    constructor(id, nom, postnom, age, ville) {
        this.id = id;
        this.nom = nom;
        this.postnom = postnom;
        this.age = age;
        this.ville = ville;
    }

    static getUser(users, id) {
        return users.find(u => u.id.toString() === id.toString());
    }
}

// Données de test
let data = [
    new User(1, "Franck", "Tshiela", 23, "Kinshasa"),
    new User(2, "Samson", "Kyunyu", 22, "Kinshasa"),
    new User(3, "Phiston", "Tumba", 30, "Mbuji-Mayi"),
    new User(4, "Piscas", "Kasereka", 23, "Kinshasa"),
    new User(5, "Prisca", "Kalula", 21, "Kinshasa"),
]

// Ajout des middlewares
app.use(express.json());
app.use("/", express.static("public"))

// @Method GET
// Retourne la liste complète des utiilisateurs 
app.get('/users', (req, res, next) => {
    return res.json(data)
})

// @Method GET
// Routrouve un utilisateur par id
app.get("/users/:userId", (req, res, next) => {
    const id = req.params.userId;
    const u = getUserById(id, next);

    return res.json(u);
})

// @Method POST
// Ajoute u utilisateur dans la liste des utilisateurs
app.post('/users', (req, res) => {
    const {nom, postnom, age, ville} = req.body;

    const u = new User(data.length + 1, nom, postnom, age, ville);

    data.push(u);

    return res.json(u);
});

// @Method DELETE
// Supprime un utilisateur
app.delete("/users/:userId", (req, res, next) => {
    const id = req.params.userId;
    const user = getUserById(id, next);

    data = data.filter(d => d.id.toString() !== user.id.toString());

    return res.json({
        message: "Utilisateur supprimé avec succès!"
    })
})

// @Method UPDATE
// Mise à jour d'un utilisateur
app.patch("/users/:userId", (req, res, next) => {
    const id = req.params.userId;
    const u = getUserById(id, next);

    const {nom, postnom, age, ville} = req.body;

    if (nom && nom !== "") u.nom = nom;
    if (postnom && postnom !== "") u.postnom = postnom;
    if (age && age !== "") u.age = age;
    if (ville && ville !== "") u.ville = ville;

    data = data.map(d => {
        if (d.id.toString() === id) {
            return u;
        }

        return d;
    });

    return res.json(u);
})

/**
 * Recupère un utilisateur de la list des utilisateurs (data)
 * @param {int} id The user id
 */
const getUserById = (id, next) => {
    const u = User.getUser(data, id);

    if (!u) {
        return next({
            message: "Aucun utilisateur correspond à l'id " + id,
            status: 404,
        })
    }

    return u
}


// Gestion des url non trouvés

app.use("*", (req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Demarage du serveur.
app.listen(PORT, () => console.log(`Le serveur écoute au port ${PORT}`));