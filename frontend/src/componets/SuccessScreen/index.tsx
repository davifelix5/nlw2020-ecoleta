import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

import './styles.css'

interface props {
    message: string
}

const SuccessScreen: React.FC<props> = ({ message }) => {
    return (
        <div className="success">
            <FaCheckCircle size={45} color="#34CB79" />
            <p>{message}</p>
        </div> 
    )
}

export default SuccessScreen;
