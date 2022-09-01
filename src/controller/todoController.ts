import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { TodoInstance } from "../model/todo";
import { UserInstance } from "../model/user";
import { createTodoSchema, options, updateTodoSchema } from "../utils/utils";

export async function Todos(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  // let todo = {...req.body, id}
  try {
    const verified = req.user; //storing user id  and info of creation  // to know d user performing d operatio..jwt collect d user info
    const validationResult = createTodoSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const record = await TodoInstance.create({
      id,
      ...req.body,
      userId: verified.id,
    });
    res.status(201).json({
      msg: "You have successfully created a todo",
      record,
    });
  } catch (err) {
    res.status(500).json({
      msg: "failed to create",
      route: "/create",
    });
  }
}

export async function getTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //  const record = await TodoInstance.findAll({where: {},limit, offset})
    const record = await TodoInstance.findAndCountAll({ limit, offset,
      include:[{
         model:UserInstance,
         attributes:['id', 'firstname',  'lastname', 'email', 'phonenumber'],
         as:'user'
        }
        ]
   });
    res.status(200).json({
      msg: "You have successfully fetch all todos",
      count: record.count,
      record: record.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read",
      route: "/read",
    });
  }
}

export async function getSingleTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await TodoInstance.findOne({ where: { id } });
    return res.status(200).json({
      msg: "Successfully gotten user information",
      record,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read single todo",
      route: "/read/:id",
    });
  }
}

export async function updateTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const validationResult = updateTodoSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const record = await TodoInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        Error: "Cannot find existing todo",
      });
    }
    const updatedrecord = await record.update({
      title: title,
      completed: completed,
    });
    res.status(200).json({
      msg: "You have successfully updated your todo",
      updatedrecord,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to update",
      route: "/update/:id",
    });
  }
}

export async function deleteTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await TodoInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        msg: "Cannot find todo",
      });
    }
    const deletedRecord = await record.destroy();
    return res.status(200).json({
      msg: "Todo deleted successfully",
      deletedRecord,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to delete",
      route: "/delete/:id",
    });
  }
}
