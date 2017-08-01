const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const jsonfile = require('jsonfile')
const expressSession = require('express-session')
const expressValidator = require('express-validator')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressValidator())
app.use(express.static('public'))
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}))

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

const todoList = jsonfile.readFileSync('todos.json', {throws:false}) || []

app.get("/login", (req, res) =>{
  // display the form to login
})
app.post("/login"(req,res) =>{
  // set session
  //redirect to /
})
const checkAuthenication = (req, res,next) => {
 if (req.session.username){
   next()
 } else{
   res.redirect("/login")
 }
}

app.use(checkAuthenication)

app.get('/', (req, res) => {
  const templateData = {
    uncompleted: todoList.filter(todo => !todo.completed),
    completed: todoList.filter(todo => todo.completed),
    anyItem: todoList.length > 0
  }

  res.render('home', templateData)
})

app.post('/addTodo', (req, res) => {
  const newTodoDescript = req.body.description

  //todoList.push(newTodoDescript)
  todoList.push({
    id: todoList.length + 1,
    completed: false,
    description: newTodoDescript
  })
  console.log(todoList)

  jsonfile.writeFile('todos.json', todoList, {
    spaces: 2
  }, err => {
    console.log(`todos.json error ${err}`)
  })

  res.redirect('/')
})

app.post('/markComplete', (req, res) => {
  //const description = req.body.description
  const id = parseInt(req.body.id)

  //  completedList.push(description)
  const todo = todoList.find(todo => todo.id === id)

  // const indexOfItem = todoList.indexOf(description)
  // todoList.splice(indexOfItem, 1)
  if (todo) {
    todo.completed = true
  }

  jsonfile.writeFile('todos.json', todoList, {
    spaces: 2
  }, err => {
    console.log(`todos.json error: ${err}`)
  })

  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Listening level over level 3000!')
})
