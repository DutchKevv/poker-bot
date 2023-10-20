import { System } from '../system/system'

export default function (system: System) {
    system.api.app.delete('/api/game', (req, res) => {
        const game = system.gameController.stopAll()
        res.sendStatus(204)
    })

    system.api.app.get('/api/game', (req, res) => {
        res.send(system.gameController.games.map(game => ({id: game.id})))
    })

    system.api.app.post('/api/game/create', (req, res) => {
        const game = system.gameController.create()
        res.send({ id: game.id })
    })

    system.api.app.post('/api/game/start', (req, res) => {
        const game = system.gameController.getById(req.body.id)

        if (!game) {
            return
        }

        game.start()
        res.sendStatus(204)
    })
}
