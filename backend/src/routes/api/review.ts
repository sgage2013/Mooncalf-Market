import { Response } from "express";
import { ValidUser } from "../../typings/express";
import { validateUser } from "../../utils/auth";
import db from "../../db/models";
const router = require("express").Router();

const { Category, SubCategory, Item, Review } = db;

router.get('/items/:itemId/reviews', validateUser, async (req: ValidUser, res: Response) =>{
    try{
        
    } catch(error){
        return res.status(500).json({message: 'Failed to load reviews'})
    }
})