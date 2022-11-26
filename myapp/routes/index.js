var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  let db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      // db.all('DROP table blog')
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_txt, blog_body from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Welcome to the Blog', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_txt text NOT NULL,
                     blog_body text NOT NULL);
                      insert into blog (blog_txt, blog_body)
                      values ('This is a great blog', 'blog_body 1'),
                             ('Oh my goodness blogging is fun', 'blog_body 3');`,
              () => {
                db.all(` select blog_id, blog_txt, blog_body from blog`, (err, rows) => {
                  res.render('index', { title: 'Welcome to the Blog', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  console.log("Adding blog");
  let db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("adding " + req.body.blog_txt);
    
      db.exec(`insert into blog (blog_txt, blog_body)
                values ('${req.body.blog_txt}', '${req.body.blog_body}');`)
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  console.log("deleted");
  let db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("deleted " + req.body.blog_id);
 
      db.exec(`delete from blog where blog_id='${req.body.blog_id}';`);     
      res.redirect('/');
    }
  );
})

router.post('/edit', (req, res, next) => {
  console.log("edited");
  let db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("edited " + req.body.blog_id);
      console.log("here")
      db.exec(`update blog set blog_body = '${req.body.blog_body}',blog_txt = '${req.body.blog_txt}' where blog_id='${req.body.blog_id}';`); 
      console.log("here pt2")
      res.redirect('/');
    }
  );
})

module.exports = router;