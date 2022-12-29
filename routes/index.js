import { Router } from 'express'
import routerCarritos  from './carritos/index.js'
import routerProductos  from './productos/index.js'

const router = Router()
router.use('/carrito',routerCarritos)
router.use('/productos',routerProductos)

export default router
