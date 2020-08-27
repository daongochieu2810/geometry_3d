import React from 'react'

export default CardContext = React.createContext({
    y : null,
    index: 0,
    name: "",
    pic: "",
    path: "",
    cardW: 0,
    cardH: 0,
    isHorizontal: false,
    eventEmitter: null
})