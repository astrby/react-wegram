import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { useTranslation } from 'react-i18next'
import { languageData } from './storage/userData'

const Footer = () => {

  const[t, i18n] = useTranslation("global");
  const language = languageData(state=>state.language)

useEffect(()=>{
  i18n.changeLanguage(language)
},[])

  return (
    <Container className='text-center mt-5'>
        <p>{t("footer.footer")}</p>
    </Container>
  )
}

export default Footer