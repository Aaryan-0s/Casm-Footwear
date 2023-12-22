import {
    ALL_AUDIT_FAIL,
    ALL_AUDIT_REQUEST,
    ALL_AUDIT_SUCESS,
    CLEAR_ERRORS
} from "../constants/userConstant";

export const auditReducer=(state=  { audit:[] },action)=>{
    switch (action.type){
        case ALL_AUDIT_REQUEST:
            return{
                ...state,
                loading:true,
            };
        case ALL_AUDIT_SUCESS:
            return{
                ...state,
                loading:false,
                audit:action.payload,
            };
        case ALL_AUDIT_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload,
            };
            case CLEAR_ERRORS:
                return {
                  ...state,
                  error: null,
                };
          
              default:
                return state;
            
    }
}