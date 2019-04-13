import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { sequelize } from './db.connection'
import { message } from './models/message'
import { chatroom } from './models/chatroom'
import { user } from './models/user'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt';
import jwtDecode from 'jwt-decode'

const app = express();
const config = {
  secret: `malchikBananan` //тот самый секретный ключ, которым подписывается каждый токен, выдаваемый клиенту
}

function jwtWare() {
  const { secret } = config;
  return expressJwt({ secret }).unless({ //блюдет доступ к приватным роутам
    path: [
      // public routes that don't require authentication
      '/authenticate', '/registration'
    ]
  });
}

sequelize
  .authenticate()
  .then(function (err) {
    console.log('Connection has been established successfully.');
  }, function (err) {
    console.log('Unable to connect to the database:', err);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(jwtWare())

app.post("/authenticate", async function authenticate(req, res) { //контроллер авторизации
  const { nick, pass } = req.body
  const userRecord = await user.findOne({ where: { user: nick, password: pass } });
  if (userRecord) {
    console.log(userRecord)
    const token = jwt.sign({ sub: userRecord.id }, config.secret); //подписывам токен нашим ключем
    res.status(201).send({ token })
  }
  res.status(404).send()
})

app.post("/registration",async (req,res) =>{
  const { nick, pass } = req.body
  const existUser = await user.findOne({where :{user : nick}})
  if(!existUser) {
    const newUser = await user.create({user:nick,password:pass})
    const token = jwt.sign({ sub: newUser.id }, config.secret); //подписывам токен нашим ключем
    res.status(201).send({ token })
  }
  res.send(400).send({err: "User is exist"})
})


app.get('/message/:id', async (req, res) => {

  const messageFind = await message.findAll({
    include: [{
      model: user,
    }],
    where: { chatroomId: req.params.id }
  })

  res.status(201).send(messageFind)
});

app.post('/message', async function (req, res) {
  try {
    const {sub  } = req.user
    console.log(req.user)
    let time = new Date().toLocaleTimeString();
    const body = req.body
    body.time = time

    let existUser = await user.findOne({
      where: {
        id: sub
      }
    })

    if (!existUser) {
      res.status(404).send('Not Found')
    }

    const messageCreate = await message.create({
      message: req.body.message,
      chatroomId: req.body.chatroomId,
      userId: sub
    })

    const messageWithUser = await message.findByPk(messageCreate.id, {
      include: [{
        model: user,
      }]
    })

    res.status(201).send(messageWithUser)
  } catch (err) {
    console.log(err)
    console.log("what&.")
  }
});

app.get('/Chatrooms', async (req, res) => {
  try {
    const chatroomFind = await chatroom.findAll()
    console.log(chatroomFind)
    res.status(201).send(chatroomFind)
  } catch (err) {
    console.log(err)
    console.log("Kakogo hrena?")
  }
});

app.listen(3001, function () {
  console.log('Example app listening on port 3000!')

});
