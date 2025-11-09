import React,  { createContext, useState, useEffect } from 'react'; 
import { api } from '../components/users/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({ });

const guest = {
  role: 'guest',
  isLoggedIn: false,
  first_name: null,
  last_name: null,
  email: null,
  accessToken: null,
}
// Removed unused authenticateToken helper and inlined logic into checkAuth with async/await


export const AuthProvider =  ({ children }) => {
    const [auth, setAuth] = useState(null)
    const [loading, isLoading] = useState(true)
    const [isMounted, didMount] = useState(false)

    useEffect(()=> {    
      authenticateUser();
    }, [])

    const authenticateUser = async () => {
      try {   
          const accessToken = localStorage.getItem('accessToken')
          
          if (accessToken) {
              console.log(accessToken);
              const res = await api.get( '/api/users/auth', { params: { accessToken: accessToken } })
              console.log(res);

              if (res?.data?.success) {
                  setAuth({ ...res.data.user, isLoggedIn: true })
                  localStorage.setItem('loggedIn', true)
              } else {
                  localStorage.removeItem('accessToken')
                  localStorage.setItem('loggedIn', false)
                  setAuth(guest)
              }
          } else {
              localStorage.setItem('loggedIn', false)
              setAuth(guest)
          }
      } catch (error) {
          const serverMessage = error?.response?.data?.message
          if (serverMessage === 'Token expired') {
              // Token expired; clear and reset
              localStorage.setItem('loggedIn', false)
              localStorage.removeItem('accessToken')
              setAuth(guest)
          } else {
              console.log('error', error);
              // Network/timeout or other error; fail safe by resetting auth
              localStorage.setItem('loggedIn', false)
              setAuth(guest)
          }
      } finally {
          didMount(true)
      }
  }

    useEffect(()=> {
        if (isMounted) {
            isLoading(false)
        }
    }, [isMounted])

    useEffect(()=> {
      if (!loading) console.log('auth:', auth);
    }, [auth, loading])

    if (!loading) return (

        <AuthContext.Provider value={{ auth, setAuth}}>
            { children }
        </AuthContext.Provider>
       

    )
}

export default AuthContext; // not AuthProviderr