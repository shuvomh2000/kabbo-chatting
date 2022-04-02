import {combineReducers} from 'redux'

const initialState = {
    id: null
} 

const userreducer = (state = initialState,action)=>{
    if(action.type == 'ACTIVE_USER'){
        return{...state,id:action.payload}
    }else{
        return state
    }
}

const grpreducer = (state = initialState,action)=>{
    if(action.type == 'ACTIVE_GRP'){
        return {...state,id:action.payload}
    }else{
        return state
    }
}

const rootReducer = combineReducers({
    activeuser: userreducer,
    activegrp:grpreducer
})

export default rootReducer