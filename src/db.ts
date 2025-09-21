import sqlite3 from "sqlite3";

export const initDB=async(callback:any)=>{
    const db=new sqlite3.Database("db.sqlite",(err)=>{
        if(err){
            console.log(err);
            return;
        }

        db.run(`
            CREATE TABLE IF NOT EXISTS posts(
                id integer primary key autoincrement,
                name text,
                message text,
                image text,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `,(err)=>{
            if(err) console.log(err);
            callback(db)
        })

    })
}