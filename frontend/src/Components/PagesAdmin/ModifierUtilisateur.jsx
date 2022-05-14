import React from 'react'
import { useParams } from 'react-router-dom'

export default function ModifierUtilisateur() {
    const { id } = useParams();
  return (
    <h1>Utilisateur {id}</h1>
  )
}
