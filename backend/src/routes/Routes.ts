import express from 'express';
import Service from '../services/Service'

export default class Routes {
    protected router = express.Router();
    protected service: Service

    getRoute() {
        this.router.route('/').get(async (req, res) => {
            res.json(await this.service.getAll())
        });

        this.router.route('/:id').get(async (req, res) => {
            let id = req.params.id
            res.json(await this.service.getById(parseInt(id)))
        });
    }

    postRoute() {
        this.router.route('/').post(async (req, res) => {
            let data = req.body.data
            res.json(await this.service.add(data))
        });
    }

    putRoute() {
        this.router.route('/:id').put(async (req, res) => {
            let data = req.body.data
            let id = req.params.id
            res.json(await this.service.update(parseInt(id), data))
        })
    }

    deleteRoute() {
        this.router.route('/:id').delete(async (req, res) => {
            let id = req.params.id
            res.json(await this.service.delete(parseInt(id)))
        });
    }

    getRouter() {
        this.getRoute()
        this.putRoute()
        this.postRoute()
        this.deleteRoute()
        return this.router
    }
}