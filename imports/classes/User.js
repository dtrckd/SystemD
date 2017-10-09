//sont définis ici la classe user et sa sous classe profile
import {Class} from 'meteor/jagi:astronomy';
import Location from '/imports/classes/Location'

const Profile = Class.create({
    name: 'Profile',
    fields: {
        description: {
            type: String,
            optional: true,
            validator: [
                {
                    type: 'maxLength',
                    param: 1000
                }
            ],
        },
        location: {
            type: Location,
            default: function () {
                return {}
            }
        }
    },
});


const User = Class.create({
    name: 'User',
    collection: Meteor.users,
    fields: {
        emails: {
            type: [String],
            default: function () {
                return [];
            }
        },
        services: Object,
        createdAt: {
            type : Date,
            immutable: true
        },
        profile: {
            type: Profile,
            default: function () {
                return {};
            }
        }

    },
    helpers: {
        //helper pour indiquer le pourcentage de complétion du profil
        completed() {
            //on liste ici les champs du profil faisant parti du ratio
            let fieldsToComplete = [
                this.profile.description,
                this.profile.location.lat
            ];
            //on initialise
            let completed = 0;
            //on incrémente a chaque fois qu'un champs n'est pas invalide
            _.each(fieldsToComplete, function (field) {
                if (!(field === undefined || field === "" || field === 0)) {
                    completed += 1
                }
            });
            //on retourne le résultat divisé par le nombre d'element à checker,
            // le tout multiplié par 100 pour l'avoir en pourcentage
            return parseInt((completed / fieldsToComplete.length) * 100)
        }
    },
    meteorMethods: {
        //modification de la description utilisateur
        updateDescription(value) {
            this.profile.description = value;
            return this.save()

        },
        //changement de la position de l'utilisateur
        updateSelfLocation(lat, lng, city, country) {
            this.profile.location.lat = lat;
            this.profile.location.lng = lng;
            this.profile.location.city = city;
            this.profile.location.country = country;
            return this.save()
        }

    }
});

export default User;