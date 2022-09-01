import express from 'express'
import {auth} from '../middleware/auth'

const router = express.Router();

import {Todos, getTodos,getSingleTodo,updateTodos,deleteTodos} from '../controller/todoController'

router.post('/create',auth, Todos);
router.get('/read',getTodos)
router.get('/read/:id',getSingleTodo)
router.patch('/update/:id',auth,updateTodos)
router.delete('/delete/:id',auth,deleteTodos)


export default router
