import create from 'zustand'
import {persist} from 'zustand/middleware'

export let userData = create
(persist(set=>({
    user:[],
    login: (user) => set(()=>({user: [user]})),
    logout: () => set(()=>({user: []}))
})),
    {
        name: 'user'
    }
)

export let languageData = create
(persist(set=>({
    language: 'es',
    setLanguage: (lang)=> set(()=>({language: lang})),
    deleteLanguage: ()=> set({})
})),
    {
        name: 'language'
    }
)