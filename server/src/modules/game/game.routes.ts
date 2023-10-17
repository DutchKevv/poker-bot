import { System } from '../system/system'

export default function (system: System) {
    system.api.app.post('/api/game/create', (req, res) => {
        const game = system.gameController.createGame()
        res.send({ id: game.id })
    })

    system.api.app.post('/api/game/start', (req, res) => {
        const game = system.gameController.getGameById(req.body.id)

        if (!game) {
            return
        }

        game.start()
        res.sendStatus(204)
    })
}
