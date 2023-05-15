//This is a model handle database interactions
const DatabaseCollectionsNames = {
    users: 'users',
    consultaions: 'consultations'

}


const selectAll = function(collectionName){

        const users = [
            {
                name: 'Taine',
                email: 'taine@gmail.com',
                password: 'TPassword'
            },
            {
                name: 'Sam',
                email: 'sam@gmail.com',
                password: 'SPassword'
            }
        ]
        
        return users
}

module.exports = {DatabaseCollectionsNames, selectAll}