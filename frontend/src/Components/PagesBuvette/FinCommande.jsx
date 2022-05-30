import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function FinCommande() {

    const { activeSession, isUserTokenExpired, setNeedOrderReset, currentOrder, setCurrentOrder } = useContext(SessionContext);
    const myAppNavigator = useNavigate();

    useEffect(() => {
      setNeedOrderReset(true);
    
      return () => {}
    }, [])
    
   
    const resetOrder = () => {
        setCurrentOrder([]);
        setNeedOrderReset(false);
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
      <div className='BoxSimple'>
          {currentOrder.id !== undefined 
            ? <div>
                <h1 className='PageName'>La commande #{currentOrder.id} a été validée.</h1>
                <h3>Vous pouvez retrouver les détails de cette commande sur la page listant toutes les commandes.</h3>
                <br />

                <button className='ActionButton' onClick={goToNewOrder}>Nouvelle commande</button>
                <br />
                <button className='SubButton' onClick={goToDetails}>Détails de la commande</button>
                <br />
                <button className='SubButton' onClick={goToOrderList}>Historique des commandes</button>
                <br />
                <button className='SubButton' onClick={goToMenuBuvette}>Gestion de la buvette</button>

                <br />
                <br />
                <br />
            </div>
            : <div>
            <h1 className='PageName' >Veuillez commencer par entrer une commande</h1>
            <br />
            <button className='ActionButton' onClick={goToNewOrder}>Nouvelle commande</button>
        </div>
          }

            
      </div>
  )
}
