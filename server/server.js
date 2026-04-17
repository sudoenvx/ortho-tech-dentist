import 'dotenv/config'
import express from 'express'
import { adminApp } from './lib/firebase.js'
import { getAuth } from 'firebase-admin/auth'

const app = express()
app.use(express.json())

const api = express.Router()
const auth = getAuth(adminApp)


api.put('auth-user/:uid', async (req, res) => {
  const { uid } = req.params
  const updates = {}
  const { displayName, email, password } = req.body

  if (displayName) updates.displayName = displayName
  if (email) updates.email = email
  if (password) updates.password = password

  try {
    await auth.updateUser(uid, updates)
    res.status(200).send('User updated successfully')
  } catch (error) {
    console.error('Failed to update user:', error)
    res.status(500).send('Failed to update user')
  }
})

api.get('/managers', async (req, res) => {
  try {
    const listUsersResult = await auth.listUsers()
    console.log(listUsersResult);
    
    const managers = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
    }))
    res.json(managers)
  } catch (error) {
    console.error('Failed to list users:', error)
    res.status(500).send('Failed to list users')
  }
})

app.use('/api', api)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})