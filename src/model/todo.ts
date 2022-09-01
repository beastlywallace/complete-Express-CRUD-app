import { DataTypes, Model } from "sequelize";
import db from '../config/database.config'

interface TodoAttributes {
  id: string;
  title: string;
  completed: boolean;
  userId:string   ///KEEPING TRACK OF USER ID THAT DOES THE CREATION
}

export class TodoInstance extends Model<TodoAttributes> {}

TodoInstance.init({
  id: {
    type:DataTypes.UUIDV4,
    primaryKey:true,
    allowNull:false
  },
  title:{
     type:DataTypes.STRING,
     allowNull:false 
  },
  completed:{
    type:DataTypes.BOOLEAN,
    allowNull:false 
  },
  userId:{
    type:DataTypes.STRING
  }
},{
    sequelize:db,
    tableName:'todo'
});
