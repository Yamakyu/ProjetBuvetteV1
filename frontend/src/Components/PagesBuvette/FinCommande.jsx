import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function FinCommande() {

    const { activeSession, isUserTokenExpired, currentOrder, setCurrentOrder } = useContext(SessionContext);
    const myAppNavigator = useNavigate();

    
    const resetOrder = () => {
        setCurrentOrder([]);
    }
    const goToDetails = () => {
        let orderID = currentOrder.id
        resetOrder();
        myAppNavigator("/manage/buvette/invoices/details/"+orderID);
    }
    const goToOrderList = () => {
        resetOrder();
        myAppNavigator("/manage/buvette/invoices");
    }
    const goToNewOrder = () => {
        resetOrder();
        myAppNavigator("/manage/buvette/orders/new");
    }
    const goToMenuBuvette = () => {
        resetOrder();
        myAppNavigator("/manage/buvette/articles/overview");
    }

  return (
      <div>
          {currentOrder.id !== undefined 
            ? <div>
                <h2>La commande #{currentOrder.id} a été validée.</h2>
                <h4>Vous pouvez retrouver les détails de cette commande sur la page listant toutes les commandes.</h4>

                <button onClick={goToDetails}>Voir les détails de la commande</button>
                <button onClick={goToOrderList}>Consulter l'historique complet des commandes</button>
                <br />
                <br />
                <br />
                <button onClick={goToNewOrder}>Faire une nouvelle commande</button>
                <button onClick={goToMenuBuvette}>Retour au menu de gestion de buvete</button>
            </div>
            : <div>
            <h2>Veuillez commencer par entrer une commande</h2>
            <br />
            <button onClick={goToNewOrder}>Faire une nouvelle commande</button>
        </div>
          }

            
      </div>
  )
}
